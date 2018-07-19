import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { EditTest, EditCE, EditMed } from './index';

export class EditElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/edit/test/:elementId' render={({ match }) => <EditTest match={match}/>} />
                <Route path='/patientProfile/:patientId/edit/clinicalEvent/:elementId' render={({ match }) => <EditCE match={match}/>} />
                <Route path='/patientProfile/:patientId/edit/treatment/:elementId' render={({ match }) => <EditMed match={match}/>} />
                <Route path='/' component={() => <></>} />
            </Switch>
        );
    }
}