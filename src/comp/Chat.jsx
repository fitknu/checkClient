import { Avatar, Button, Card, CardContent, CardHeader, Collapse, Container, Divider, FormControl, Grid, IconButton, InputAdornment, Link, List, ListItem, ListItemAvatar, ListItemText, makeStyles, TextField, Typography } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { io } from "socket.io-client";
import { serverIP } from "../config";
import Peer from "peerjs";
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
    const [open, setOpen] = useState(true)
    const [myMessage, setMyMessage] = useState("")
    const [messasges, setMessages] = useState([])

    const [logedIn, setLogedIn] = useState(true)
    const bottomMessageRef = useRef()

    const socketRef = useRef()
    const [socketOnline, setSocketOnline] = useState(false)

    const [voiceTry, setVoiceTry] = useState(false)
    const peerRef = useRef()
    const [conns, setConns] = useState([])

    const [audios, setAudios] = useState([])
    // const [got, setGot] = use
    useEffect(() =>
    {

        if (voiceTry && socketOnline)
        {
            // navigator.mediaDevices.getUserMedia({ audio: true })
            navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } })
                .then(myStream =>
                {
                    myStream.myPlay = false
                    setAudios([myStream])
                    peerRef.current = new Peer()
                    peerRef.current.on('open', myPeerId =>
                    {
                        //Me calling others
                        socketRef.current.on('peerId', peerId =>
                        {
                            console.log('I call');
                            const call = peerRef.current.call(peerId, myStream)
                            call.on('stream', otherPeerStream =>
                            {
                                console.log('I call stream');
                                otherPeerStream.myPlay = true //my custom property for autoPlay
                                otherPeerStream.peerId = peerId //my custom property for closing connections
                                setAudios(old => [...old, otherPeerStream])
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
                        socketRef.current.emit('peerId', myPeerId)
                        socketRef.current.on('peerGone', otherPeerId =>
                        {
                            console.log('Other peer left ' + otherPeerId);
                            // console.log()
                            peerRef.current.connections[otherPeerId][0].close()
                            setAudios(old => [...old.filter(str => str.peerId !== otherPeerId)])
                        })
                    })
                    // setAudios([stream])

                })
                .catch((e) => console.log(e))
        }

        // setAudios(['fuck'])
    }, [voiceTry, socketOnline])
    useEffect(() =>
    {

    }, [audios])

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
        socketRef.current.emit('message', "Vlad", myMessage)
        // setMessages([...messasges, { name: 'Archie', text: myMessage, time: '10:00' }])
        setMyMessage("")
        console.log('Submit')
    }
    //Socket text chat stuff
    useEffect(() =>
    {

        socketRef.current = io(serverIP)
        socketRef.current.emit("joinChat")
        socketRef.current.on('sucess', () =>
        {
            setSocketOnline(true)
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

    }, [])
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
        if (open)
        {
            bottomMessageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', inline: 'start'
            })
        }

    }, [messasges, open])
    return (<>
        <Container maxWidth="md">
            <br />
            {/* {audios.map((stream, i) =>
            {
                return <audio
                    key={i}
                    autoPlay
                    controls
                    ref={el => el ? el.srcObject = stream : null}
                ></audio>
            })} */}
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
                        <Grid container>
                            <Grid item>
                                <List
                                    subheader="Пользователи"
                                >
                                    {audios.map((audio, audioIndex) =>
                                    {
                                        return <ListItem
                                            button
                                            key={audioIndex}
                                            onClick={() =>
                                            {
                                                audio.myPlay = !audio.myPlay
                                                setAudios(old => [...old])
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>{audioIndex}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={audio.myPlay ?
                                                    "Заглушить" : "Включить"}
                                            />
                                            <audio
                                                ref={el => el ? el.srcObject = audio : null}
                                                autoPlay={audio.myPlay}
                                                controls
                                                style={{ display: 'none' }}
                                            ></audio>
                                        </ListItem>
                                    })}
                                </List>
                            </Grid>
                            <Grid item>

                            </Grid>
                        </Grid>
                        <Divider />
                        <List className={classes.messages}>
                            {messasges.map((message, messageIndex) =>
                            {
                                const { name, text, time } = message
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
                    </Collapse>
                </CardContent>
            </Card>
        </Container>
    </>)
}
export default Chat