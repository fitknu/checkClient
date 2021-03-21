import
{
    Avatar, Card, CardContent, CardHeader,
    Collapse, Container, Divider, Grid, IconButton,
    InputAdornment, Link, List, ListItem, ListItemAvatar,
    ListItemText, makeStyles, Tab, Tabs, TextField,
    Typography
} from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import PeopleIcon from '@material-ui/icons/People';
import { io } from "socket.io-client";
import { serverIP } from "../config";
import Peer from "peerjs";
import { names } from "../names";

const useStyles = makeStyles(theme => ({
    messages: {
        maxHeight: 350,
        overflowY: 'auto'
    },
    chatInput: {
        '& textarea':
        {
            overflow: 'hidden'
        }
    }
}))

function Chat()
{
    const classes = useStyles()

    const [myMessage, setMyMessage] = useState("")
    const [messasges, setMessages] = useState([])
    const bottomMessageRef = useRef()

    const [open, setOpen] = useState(true)
    const [logedIn, setLogedIn] = useState(true)

    const [myName, setMyName] = useState(null)
    const socketRef = useRef()
    const [socketOnline, setSocketOnline] = useState(false)

    const [tab, setTab] = useState(0)
    const [voiceTry, setVoiceTry] = useState(false)
    const peerRef = useRef()

    const [users, setUsers] = useState([])
    const [audios, setAudios] = useState([])
    // const [got, setGot] = use
    useEffect(() =>
    {
        function go(myPeerId, myStream)
        {
            socketRef.current.emit('peerId', myPeerId)
            socketRef.current.on('peerId', (otherPeerId) =>
            {
                console.log('peerId ' + otherPeerId);
                const call = peerRef.current.call(otherPeerId, myStream)
                // callsRef.current.push(call)
                call.on('stream', otherPeerStream =>
                {
                    otherPeerStream.peerId = otherPeerId
                    otherPeerStream.autoPlay = true
                    setAudios(oldAudios => [...oldAudios, otherPeerStream])
                })
            })
            peerRef.current.on('call', call =>
            {
                // callsRef.current.push(call)
                call.answer(myStream)
                call.on('stream', otherPeerStream =>
                {
                    otherPeerStream.peerId = call.peer
                    otherPeerStream.autoPlay = true
                    setAudios(oldAudios => [...oldAudios, otherPeerStream])
                })
            })
            socketRef.current.on('peerLeft', (peerId) =>
            {
                console.log('peerLeft' + peerId);
                setAudios(oldAudios => oldAudios.filter(oldAudio => oldAudio.peerId !== peerId))

                try
                {
                    // const lostConnection = callsRef.current.find(call => call.peer === peerId)
                    // lostConnection[0].close()
                    peerRef.current.connections[peerId][0].close()
                    // callsRef.current = callsRef.current.filter(call => call.peer !== peerId)

                } catch (e) 
                {
                    console.log(peerRef.current.connections)
                }


            })

        }
        //If user wants to speak and has connection to the server
        if (voiceTry && socketOnline)
        {
            navigator.mediaDevices.getUserMedia({ audio: true })
                // navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } })
                .then(myStream =>
                {
                    myStream.peerName = myName
                    myStream.myPlay = false
                    // setAudios([myStream])

                    peerRef.current = new Peer()
                    peerRef.current.on('open', myPeerId =>
                    {
                        go(myPeerId, myStream)
                    })

                })
                .catch((e) =>
                {
                    console.log(e);
                    setVoiceTry(false)
                })
            //
        } else if (!voiceTry && peerRef.current)
        {
            setAudios([])
            socketRef.current.emit('peerLeft')
            peerRef.current.destroy()
            socketRef.current.off('peerId')
            socketRef.current.off('peerLeft')
        }
        return () => 
        {
            setAudios([])
            if (peerRef.current)
            {
                socketRef.current.emit('peerLeft')
                peerRef.current.destroy()
                socketRef.current.off('peerId')
                socketRef.current.off('peerLeft')

            }
        }

        // setAudios(['duck'])
    }, [voiceTry, socketOnline, myName])

    useEffect(() =>
    {
        console.log(audios)
    }, [audios])

    //Socket text chat stuff
    useEffect(() =>
    {

        socketRef.current = io(serverIP)
        const name = names[Math.floor(Math.random() * names.length)]
        setMyName(name)
        console.log('My name ' + name)
        socketRef.current.emit("joinChat")
        socketRef.current.emit("login", name)

        socketRef.current.on('debug', answer => console.log(answer))
        socketRef.current.on('login', status => setSocketOnline(status))
        socketRef.current.on('newUser', userName =>
        {
            console.log('Got a name' + userName)
            setUsers(old =>
            {
                const next = [...old, { userName, inVoiceChat: false }]
                // console.log('NExt ' + next);
                return next
            })
        })
        socketRef.current.on('userLeft', userName =>
        {
            setUsers(old => old.filter(oldUser => oldUser.userName !== userName))
        })
        socketRef.current.on('message', (name, text) =>
        {
            const date = new Date()
            const time = `${date.getHours()}:${date.getMinutes()}`
            setMessages(oldMessages => [...oldMessages, { name, text, time }])
        })

        socketRef.current.on('disconnect', () =>
        {
            const date = new Date()
            const time = `${date.getHours()}:${date.getMinutes()}`
            setSocketOnline(false)
            setMessages(oldMessages => [...oldMessages,
            { name: "Server", text: "You're diconnected", time }])

        })

        socketRef.current.on('voiceJoined', userName =>
        {
            setUsers(oldUsers =>
            {
                const m = oldUsers.find(user => user.userName === userName)
                m.inVoiceChat = true
                return [...oldUsers]
            })
        })

        socketRef.current.on('voiceLeft', userName =>
        {
            setUsers(oldUsers =>
            {
                const m = oldUsers.find(user => user.userName === userName)
                //the user might already be delete
                if (m)
                {
                    m.inVoiceChat = false

                }
                return [...oldUsers]
            })
        })
        return () => socketRef.current.close()
    }, [])
    const handleSubmit = (event) =>
    {
        if (event !== undefined)
        {
            event.preventDefault()
        }
        if (myMessage.length === 0 || !socketOnline)
        {
            return
        }
        socketRef.current.emit('message', myMessage)
        // setMessages([...messasges, { name: 'Archie', text: myMessage, time: '10:00' }])
        setMyMessage("")
        console.log('Submit')
    }
    const handleKey = (event) =>
    {
        if (event.key === 'Enter' && !event.shiftKey)
        {
            event.preventDefault()
            console.log('Submit2');
            handleSubmit()
        }
    }
    useEffect(() =>
    {
        if (open && tab === 0)
        {
            bottomMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', inline: 'start'
            })
        }

    }, [messasges, open, tab])

    useEffect(() =>
    {
        const index = users.findIndex(oldUser => oldUser === myName)
        if (index > 0)
        {
            setUsers(oldUsers =>
            {
                const temp = oldUsers[index]
                oldUsers[index] = oldUsers[0]
                oldUsers[0] = temp
                return [...oldUsers]
            })
        }
    }, [myName, users])
    return (<>
        <Container maxWidth="md">
            <Card>
                <CardHeader
                    avatar={
                        <Avatar>
                            <ChatIcon />
                        </Avatar>
                    }
                    title={<Typography variant="h6">Чат</Typography>}
                    subheader="123 игрока онлайн"
                    action={
                        <IconButton
                            title={open ? "Закрыть" : "Открыть"}
                            onClick={() => setOpen(!open)}>
                            {open ?
                                <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />}
                        </IconButton>
                    }
                />
                <CardContent>
                    <Collapse
                        in={open}
                        unmountOnExit
                    >
                        <Tabs
                            value={tab}
                            onChange={(e, newVal) => setTab(newVal)}
                            centered
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label={<Grid container direction="row"
                                alignItems="center" wrap="nowrap"
                                spacing={2}
                            >
                                <Grid item>
                                    <ChatIcon />
                                </Grid>
                                <Grid item>
                                    Чат
                                </Grid>
                            </Grid>} />
                            <Tab label={<Grid container direction="row"
                                alignItems="center" wrap="nowrap"
                                spacing={2}
                            >
                                <Grid item>
                                    <PeopleIcon />
                                </Grid>
                                <Grid item>
                                    Пользователи
                                </Grid>
                            </Grid>} />
                        </Tabs>
                        {audios.map((audio, audioIndex) =>
                        {
                            // console.log(audio.name);
                            return <ListItem
                                key={audioIndex}
                                style={{ display: 'none' }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        style={{ backgroundColor: 'purple' }}

                                    >{audioIndex}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={audio.peerName ?
                                        `${audio.peerName}${audio.peerName === myName ?
                                            " - Я" : ""}`
                                        : "No name"}
                                />
                                {audio.myPlay ?
                                    <IconButton title="Выключить">
                                        <MicOffIcon />
                                    </IconButton> :
                                    <IconButton title="Включить">
                                        <MicIcon />
                                    </IconButton>}
                                <audio
                                    ref={el => el ? el.srcObject = audio : null}
                                    autoPlay={audio.autoPlay}
                                    controls
                                    style={{ display: 'none' }}
                                ></audio>
                            </ListItem>
                        })}
                        {tab === 1 && <List>
                            {users.map((user, userIndex) =>
                            {
                                const { userName } = user
                                return <ListItem
                                    key={userIndex}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            style={user.inVoiceChat ?
                                                { backgroundColor: 'purple' } : {}}
                                        >{userName.slice(0, 2)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${userName}${userName === myName ? " - Я" : ""}`}
                                    />
                                </ListItem>
                            })}
                        </List>}


                        {tab === 0 && <>
                            <List className={classes.messages}>
                                {messasges.map((message, messageIndex) =>
                                {
                                    const { name, text, time } = message
                                    if (messageIndex !== 0 &&
                                        name === messasges[messageIndex - 1].name &&
                                        time === messasges[messageIndex - 1].time)
                                    {
                                        return <ListItem
                                            key={messageIndex}
                                            alignItems="flex-start"
                                            style={{ paddingTop: '0px', paddingBottom: 0 }}
                                        >
                                            <ListItemAvatar style={{ visibility: 'hidden' }}>
                                                <Avatar>

                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                secondary={text}
                                            />

                                        </ListItem>
                                    }
                                    return <ListItem key={messageIndex} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>
                                                {name.slice(0, 1)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <Typography component="span">
                                                        {name}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        component="span">
                                                        {" " + time}
                                                    </Typography>
                                                </>
                                            }
                                            secondary={text}
                                        />
                                    </ListItem>
                                })}
                                <ListItem ref={bottomMessageRef} />
                            </List>
                            <List>
                                <Divider />
                                {!logedIn && <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountCircleIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography>
                                                <Link>Авторизуйтесь</Link>, чтобы использовать чат
                                    </Typography>
                                        }
                                    />
                                </ListItem>}
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar title="Моё фото">
                                        <Avatar>
                                            V
                                </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <TextField
                                                disabled={!logedIn}
                                                component="form"
                                                onSubmit={handleSubmit}
                                                onKeyPress={handleKey}
                                                onChange={(e) => setMyMessage(e.target.value)}
                                                value={myMessage}
                                                label="Сообщение"
                                                multiline
                                                fullWidth
                                                rows={2}
                                                rowsMax={100}
                                                className={classes.chatInput}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment
                                                            position="end">
                                                            <IconButton
                                                                disabled={myMessage.length === 0}
                                                                color="primary"
                                                                type="submit"
                                                                title="Отправить"
                                                            >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />}
                                    />
                                </ListItem>
                                <ListItem button onClick={() => setVoiceTry(!voiceTry)}>
                                    <ListItemText>{voiceTry ?
                                        "Выключить голос" :
                                        "Включить голос"}</ListItemText>
                                </ListItem>
                            </List>
                        </>}
                    </Collapse>
                </CardContent>
            </Card>
        </Container>
    </>)
}
export default Chat