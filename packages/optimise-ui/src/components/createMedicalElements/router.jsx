import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreateTest } from './createTest';
import { CreateCE } from './createCE';
import { CreateTreatment } from './createTreatment';

export class CreateElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path="/patientProfile/:patientId/create/test" render={({ match }) => <CreateTest match={match} />} />
                <Route path="/patientProfile/:patientId/create/clinicalEvent" render={({ match }) => <CreateCE match={match} />} />
                <Route path="/patientProfile/:patientId/create/treatment" render={({ match }) => <CreateTreatment match={match} />} />
                <Route path="/" component={() => null} />
            </Switch>
        );
    }
}
