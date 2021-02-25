import { useContext, useRef, useState } from "react";
import { AppBar, Card, CardContent, Container, Dialog, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, SwipeableDrawer, Tab, Tabs, TextField, Toolbar, Typography } from "@material-ui/core"
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import SupervisedUserCircleRoundedIcon from '@material-ui/icons/SupervisedUserCircleRounded';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Login from "./Login";
import SourceContext from "../Source/Source";

function useRouteName()
{
    const onlineMatch = useRouteMatch('/online')
    const botMatch = useRouteMatch('/bot')
    const offlineMatch = useRouteMatch('/offline')

    if (onlineMatch !== null)
    {
        return "Онлайн игра"
    }
    if (botMatch !== null)
    {
        return "Игра против компьютера"
    }
    if (offlineMatch !== null)
    {
        return "Оффлайн игра"
    }
    return "Druven"
}
const useStyle = makeStyles(theme => ({
    inviteLink: {
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(1)
    }
}))
function Navigation()
{
    const { state } = useContext(SourceContext)
    const classes = useStyle()
    const [menu, setMenu] = useState(false)
    const anchorRef = useRef()
    const routeName = useRouteName()
    const [log, setLog] = useState(false)

    const [inviteLink, setInviteLink] = useState(false)
    return <>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    ref={anchorRef}
                    onClick={() => setMenu(true)}
                    edge="start"
                    color="inherit">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                    {routeName}
                </Typography>
                <IconButton
                    style={{ marginLeft: 'auto' }}
                    color="inherit"
                    onClick={() => setLog(true)}
                >
                    <AccountCircleIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Dialog
            open={log}
            onClose={() => setLog(false)}
        >
            <Login />
        </Dialog>
        <SwipeableDrawer
            anchor="left"
            open={menu}
            onOpen={() => setMenu(true)}
            onClose={() => setMenu(false)}
        >
            <List>
                <ListItem button component={RouterLink}
                    to="/online" onClick={() => setMenu(false)}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Онлайн игра" />
                </ListItem>
                <ListItem button component={RouterLink}
                    to="/bot" onClick={() => setMenu(false)}>
                    <ListItemIcon>
                        <DesktopWindowsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Против компьютера" />
                </ListItem>
                <ListItem button component={RouterLink}
                    to="/offline" onClick={() => setMenu(false)}>
                    <ListItemIcon>
                        <SupervisedUserCircleRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Оффлайн игра" />
                </ListItem>
                {state.onlineGameId && <>
                    <Divider />
                    <ListItem
                        onClick={() => setInviteLink(true)}
                        button
                    >
                        <ListItemIcon>
                            <GroupAddIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Пригласить друга"
                        />
                    </ListItem>
                </>}
            </List>
        </SwipeableDrawer>

        <Dialog
            open={inviteLink}
            onClose={() => setInviteLink(false)}
        >
            <Card>
                <CardContent>
                    <Typography>
                        Отправь ссылку своему другу
                    </Typography>
                    <br />
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        wrap="nowrap"
                        className={classes.inviteLink}
                    >
                        <Grid item>
                            {`https://${window.location.hostname}/online?id=${state.onlineGameId}&mode=auto`}
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={() =>
                                {
                                    navigator.clipboard.writeText(`https://${window.location.hostname}/online?id=${state.onlineGameId}&mode=auto`)
                                }}>
                                <FileCopyIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>

        </Dialog>
    </>
}
export default Navigation