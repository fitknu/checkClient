import { Button, Container, Divider, fade, Grid, IconButton, InputAdornment, List, ListItem, makeStyles, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import BoardOnline from "./BoardOnline";
import { serverIP } from "../config";
import Fuse from 'fuse.js'
import Chat from "./Chat";
const useStyles = makeStyles(theme => ({
    root: {
        // backgroundColor: theme.palette.action.hover,
        height: '100%'
    },
    search: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        }
    },
    table: {
        boxSizing: 'border-box',
        width: '100%',
        maxHeight: 550,
        overflowY: 'auto'
    },
    head: {
        backgroundColor: theme.palette.action
    },
    ball: {
        width: '15px',
        height: '15px',
        borderRadius: '50%'
    },
    even: {
        backgroundColor: theme.palette.action.hover
    }

}))

function Row({ name, id, status, index, joinMode })
{
    const classes = useStyles()
    let word
    let color
    switch (status)
    {
        case 0:
            word = "Ожидание игроков"
            color = 'gold'
            break;
        case 1:
            word = "Ожидание игрока 1"
            color = 'gold'
            break
        case 2:
            word = "Ожидание игрока 2"
            color = 'gold'
            break
        case 3:
            word = 'Игра идёт'
            color = 'green'
            break
        default:
            break;
    }
    return <>
        <ListItem className={(index + 1) % 2 === 0 ? classes.even : ""}>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={4} container alignItems="center">
                    {name}
                </Grid>
                <Grid item xs={6} sm={4} container wrap="nowrap" direction="row" alignItems="center" justify="flex-start" spacing={1}>
                    <Grid item xs={8}>
                        {word}
                    </Grid>
                    <Grid item xs={4}>
                        <div className={classes.ball} style={{ backgroundColor: color }} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4} container justify="flex-end">
                    <Button fullWidth component={RouterLink}
                        to={`?id=${id}&mode=${joinMode}`}
                        variant="outlined" color="inherit" >Подключиться</Button>
                </Grid>
                <Divider />
            </Grid>
        </ListItem>
        <Divider />
    </>
}

function useQuery()
{
    return new URLSearchParams(useLocation().search);
}
function Server()
{
    const query = useQuery()
    const classes = useStyles()

    const [servers, setServers] = useState([])
    const [loading, setLoading] = useState(false)

    const [joinMode, setJoinMode] = useState('auto')
    useEffect(() =>
    {
        const next = [
            { name: "Европа 1", status: 3 },
            { name: "Европа 2", status: 0 },
            { name: "Европа 3", status: 1 },
            { name: "Европа 4", status: 2 },
            { name: "Европа 5", status: 1 },
        ]
        setServers(next)
    }, [])

    useEffect(() =>
    {
        setLoading(true)
        fetch(`${serverIP}/rooms`).then(data => data.json())
            .then(data => 
            {
                setServers(data)
                setSearchServers(data)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    const [search, setSearch] = useState("")
    const [fuse, setFuse] = useState(null)
    const [searchServers, setSearchServers] = useState([])
    useEffect(() =>
    {
        const f = new Fuse(servers, { keys: ['name'] })
        setFuse(f)
    }, [servers])
    const Search = text =>
    {
        setSearch(text)
        if (text.length === 0)
        {
            setSearchServers(servers)
        } else 
        {
            const result = fuse.search(text)
            const resultsMap = result.map(item => item.item)
            setSearchServers(resultsMap)
        }

    }
    const history = useHistory()
    const goRandom = () =>
    {
        if (searchServers.length === 0)
        {
            return
        }
        const ip = searchServers[Math.floor(Math.random() * searchServers.length)]
        history.push(`?id=${ip.id}&mode=${joinMode}`)
    }
    if (query.get('id') && query.get('mode'))
    {
        return <BoardOnline id={parseInt(query.get('id'))} mode={query.get('mode')} />
    }


    return (
        <>

            <Container maxWidth="xl" className={classes.root}>
                <br />
                <Grid container
                    style={{ width: '100%' }}
                    spacing={1} justify="center" >
                    <Grid item sm={12} lg={8}>
                        <Button onClick={goRandom}
                            size="large" variant="contained" color="secondary">
                            НАЧАТЬ ИГРАТЬ
                        </Button>
                        <br />
                        <br />
                        <TextField
                            value={search}
                            onChange={(e) => Search(e.target.value)}
                            label="Поиск севера"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => Search("")}
                                            style={search.length > 0 ?
                                                { display: 'inline-block' } :
                                                { display: 'none' }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        >

                        </TextField>
                        <List className={classes.table}>
                            <ListItem>
                                <Grid className={classes.head} container item xs={12}>
                                    <Grid item xs={6} sm={4}> <strong>Название</strong> </Grid>
                                    <Grid item xs={6} sm={4}> <strong>Статус</strong> </Grid>
                                    <Grid item xs={12} sm={4}></Grid>
                                </Grid>
                            </ListItem>
                            <Divider />
                            {loading ?
                                <ListItem style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center' }}>
                                    <CircularProgress size="100px" />
                                </ListItem>
                                : searchServers.map((server, index) => 
                                {
                                    return <Row name={server.name} id={server.id} status={server.status} key={server.name} index={index} joinMode={joinMode} />
                                })}
                        </List>
                    </Grid>
                    <Grid item sm={12} lg={4}>
                        <Chat />
                    </Grid>
                </Grid>
                <br />

            </Container>

            <br />
        </>
    )
}
export default Server