import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Log } from './log.jsx';
import { Users } from './users.jsx';

export class AdminRouter extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/administration' component={() => <></>} />
                <Route exact path='/administration/log' render={({ match }) => <Log match={match} />} />
                <Route exact path='/administration/users' render={({ match }) => <Users match={match} />} />
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>} />
            </Switch>
        );
    }
}