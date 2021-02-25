import Server from "./Server";
import Profile from "./Profile";
import { Route, Switch, BrowserRouter, useRouteMatch } from "react-router-dom";
import BoardOffline from "./BoardOffline";
import Navigation from "./Navigation";
import BoardBot from "./BoardBot";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { useReducer, useState } from "react";
import SourceContext from "../Source/Source";
import reducerSource from "../Source/reducerSource";
import initSource from "../Source/initSource";

const theme = createMuiTheme({
    palette: {
        type: 'light'
    }
})

function Main()
{
    const [state, action] = useReducer(reducerSource, initSource)
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SourceContext.Provider value={{ state, action }}>
                <BrowserRouter>
                    <Navigation
                    />
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
            </SourceContext.Provider>

        </ThemeProvider>

    )
}
export default Main