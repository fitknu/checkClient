import { useRef, useState } from "react";
import { AppBar, Dialog, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Tab, Tabs, TextField, Toolbar, Typography } from "@material-ui/core"
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import SupervisedUserCircleRoundedIcon from '@material-ui/icons/SupervisedUserCircleRounded';
import Login from "./Login";

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
function Navigation()
{
    const [menu, setMenu] = useState(false)

    const anchorRef = useRef()
    const routeName = useRouteName()

    const [log, setLog] = useState(false)
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
            </List>
        </SwipeableDrawer>
    </>
}
export default Navigation