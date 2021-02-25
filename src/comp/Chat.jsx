import { Avatar, Button, Card, CardContent, CardHeader, Collapse, Container, Divider, FormControl, Grid, IconButton, InputAdornment, Link, List, ListItem, ListItemAvatar, ListItemText, makeStyles, TextField, Typography } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import SendIcon from '@material-ui/icons/Send';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
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
    const [open, setOpen] = useState(false)
    const [myMessage, setMyMessage] = useState("")
    const [messasges, setMessages] = useState([])

    const [logedIn, setLogedIn] = useState(true)
    const bottomMessageRef = useRef()
    useEffect(() =>
    {
        const next = [
            { name: 'Владислав', text: 'Всё вроде работает теперь нормально', time: '10:00' }
        ]
        setMessages(next)
    }, [])
    const handleSubmit = (event) =>
    {
        if (event !== undefined)
        {
            event.preventDefault()
        }
        if (myMessage.length === 0)
        {
            return
        }
        setMessages([...messasges, { name: 'Archie', text: myMessage, time: '10:00' }])
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
                        </List>
                    </Collapse>

                </CardContent>
            </Card>
        </Container>
    </>)
}
export default Chat