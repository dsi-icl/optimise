import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Log } from './log';
import { Users } from './users';
import { Messages } from './messages';
import { SystemInfo } from './system';

export class AdminRouter extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/administration/log' render={({ match }) => <Log match={match} />} />
                <Route exact path='/administration/users' render={({ match }) => <Users match={match} />} />
                <Route exact path='/administration/messages' render={({ match }) => <Messages match={match} />} />
                <Route exact path='/administration/system' render={({ match }) => <SystemInfo match={match} />} />
                <Route path='/' component={() => <></>} />
            </Switch>
        );
    }
}