import { AppBar, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { useRef, useState } from "react";
import PeopleIcon from '@material-ui/icons/People';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import SupervisedUserCircleRoundedIcon from '@material-ui/icons/SupervisedUserCircleRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ServerList from "./ServerList";
import Servers from "./Servers";
import Server from "./Server";
import Profile from "./Profile";
import { Route, Switch, Link as RouterLink, BrowserRouter } from "react-router-dom";
import BoardOffline from "./BoardOffline";

function Main()
{
    const [menu, setMenu] = useState(false)
    const anchorRef = useRef()

    return (
        <BrowserRouter>
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
                        Расписание
                    </Typography>
                    <IconButton style={{ marginLeft: 'auto' }} color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
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
            <Switch>
                <Route path="/online">
                    <Server />
                </Route>
                <Route path="/bot">

                </Route>
                <Route path="/offline">
                    <BoardOffline />
                </Route>
                <Route path="/user">
                    <Profile />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
export default Main