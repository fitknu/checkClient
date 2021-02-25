import Server from "./Server";
import Profile from "./Profile";
import { Route, Switch, BrowserRouter, useRouteMatch } from "react-router-dom";
import BoardOffline from "./BoardOffline";
import Navigation from "./Navigation";


function Main()
{
    return (
        <BrowserRouter>
            <Navigation />
            <Switch>
                <Route exact path='/' component={Server} />
                <Route path="/online" component={Server} />
                <Route path="/bot">
                </Route>
                <Route path="/offline" component={BoardOffline}>
                </Route>
                <Route path="/user">
                    <Profile />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
export default Main