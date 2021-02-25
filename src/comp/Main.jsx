import Server from "./Server";
import Profile from "./Profile";
import { Route, Switch, BrowserRouter, useRouteMatch } from "react-router-dom";
import BoardOffline from "./BoardOffline";
import Navigation from "./Navigation";
import BoardBot from "./BoardBot";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: 'light'
    }
})

function Main()
{
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Navigation />
                <Switch>
                    <Route exact path='/' component={Server} />
                    <Route path="/online" component={Server} />
                    <Route path="/bot" component={BoardBot} />
                    <Route path="/offline" component={BoardOffline}>
                    </Route>
                    <Route path="/user">
                        <Profile />
                    </Route>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>

    )
}
export default Main