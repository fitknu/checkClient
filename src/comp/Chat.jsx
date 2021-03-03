import
{
    Avatar, Button, Card, CardContent, CardHeader,
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
        maxHeight: theme.breakpoints.values.sm,
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
        // if (peerRef.current)
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

                        //Me calling others
                        socketRef.current.on('peerId', (peerId, peerName) =>
                        {
                            console.log('I call');
                            const call = peerRef.current.call(peerId, myStream)
                            call.on('stream', otherPeerStream =>
                            {
                                console.log('I call stream');
                                otherPeerStream.myPlay = true //my custom property for autoPlay
                                otherPeerStream.peerId = peerId //my custom property for closing connections
                                otherPeerStream.peerName = peerName
                                setAudios(old => [...old, otherPeerStream])

                                //send my name to the peer i'm calling throught the server
                                socketRef.current.emit('peerCall', peerId)
                            })
                        })
                        //Others calling me
                        peerRef.current.on('call', call =>
                        {
                            console.log('Called me');
                            call.answer(myStream)
                            call.on('stream', otherPeerStream =>
                            {
                                console.log('Called me stream');
                                otherPeerStream.myPlay = true
                                otherPeerStream.peerId = call.peer
                                setAudios(old => [...old, otherPeerStream])
                            })
                        })
                        //I got a name for one of my current media connection, so add that
                        socketRef.current.on('peerCall', (otherPeerId, otherPeerName) =>
                        {
                            setAudios(oldAudios =>
                            {
                                const m = oldAudios.find(oldAudio => oldAudio.peerId === otherPeerId)
                                m.peerName = otherPeerName
                                return [...oldAudios]
                            })
                        })
                        //Send my peerId to server to start the whole things
                        socketRef.current.emit('peerId', myPeerId)
                        //When someone leaves the voice chat
                        socketRef.current.on('peerLeft', otherPeerId =>
                        {
                            console.log('Other peer left ' + otherPeerId);
                            //Close the connection manualy, because peerJS does not do
                            //that by automaticaly, athought sometimes it does so we need this check
                            console.log(peerRef.current.connections);
                            if (peerRef.current.connections[otherPeerId] && peerRef.current.connections[otherPeerId].length)
                            {
                                peerRef.current.connections[otherPeerId][0].close()
                            }
                            //Delete the peer from the list of audios
                            setAudios(old => [...old.filter(str => str.peerId !== otherPeerId)])
                        })
                    })
                    // setAudios([stream])

                })
                .catch((e) => console.log(e))
            //
        } else if (!voiceTry && peerRef.current)
        {
            socketRef.current.emit('myPeerLeft')
            peerRef.current.destroy()
        }
        return () => 
        {
            if (peerRef.current)
            {
                socketRef.current.emit('myPeerLeft')
                peerRef.current.destroy()
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
        socketRef.current.on('userJoined', userName =>
        {
            console.log('Got a name' + userName)
            setUsers(old =>
            {
                const next = [...old, { userName, inVoiceChat: false }]
                // console.log('NExt ' + next);
                return next
            })
        })
        socketRef.current.on('userJoinedVoice', userName =>
        {
            setUsers(oldUsers =>
            {
                const userThatJoinedVoice = oldUsers.find(oldUser => oldUser.userName === userName)
                if (userThatJoinedVoice)
                {
                    userThatJoinedVoice.inVoiceChat = true

                }
                return [...oldUsers]
            })
        })
        socketRef.current.on('userLeftVoice', userName =>
        {
            setUsers(oldUsers =>
            {
                const userThatLeftVoice = oldUsers.find(oldUser => oldUser.userName === userName)
                if (userThatLeftVoice)
                {
                    userThatLeftVoice.inVoiceChat = false

                }
                return [...oldUsers]
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
            <br />
            <br />
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
                                    autoPlay={audio.myPlay}
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
                                        >
                                            <ListItemAvatar>

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