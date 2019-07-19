import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Log } from './log';
import { UserList } from './users';
import { SystemInfo } from './system';
import { Meddra } from './meddra';
import { Update } from './update';
import { Sync } from './sync';
import { PatientMappings } from './patientMappings';

export class AdminRouter extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/administration/log' render={({ match }) => <Log match={match} />} />
                <Route path='/administration/users' render={({ match }) => <UserList match={match} />} />
                <Route exact path='/administration/system' render={({ match }) => <SystemInfo match={match} />} />
                <Route exact path='/administration/meddra' render={({ match }) => <Meddra match={match} />} />
                <Route exact path='/administration/update' render={({ match }) => <Update match={match} />} />
                <Route exact path='/administration/sync' render={({ match }) => <Sync match={match} />} />
                <Route exact path='/administration/patientMappings' render={({ match }) => <PatientMappings match={match} />} />
                <Route path='/' component={() => <></>} />
            </Switch>
        );
    }
}