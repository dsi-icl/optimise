import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Log } from './log';
import { Users } from './users';
import { Messages } from './messages';

export class AdminRouter extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/administration' component={() => <></>} />
                <Route exact path='/administration/log' render={({ match }) => <Log match={match} />} />
                <Route exact path='/administration/users' render={({ match }) => <Users match={match} />} />
                <Route exact path='/administration/messages' render={({ match }) => <Messages match={match} />} />
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>} />
            </Switch>
        );
    }
}