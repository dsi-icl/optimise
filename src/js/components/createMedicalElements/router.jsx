import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreateTest } from './createTest';
import { CreateCE } from './createCE';
import { CreateTreatment } from './createTreatment';
export class CreateElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/create/:visitId/test' render={({ match }) => <CreateTest match={match} />} />
                <Route path='/patientProfile/:patientId/create/:visitId/clinicalEvent' render={({ match }) => <CreateCE match={match} />} />
                <Route path='/patientProfile/:patientId/create/:visitId/treatment' render={({ match }) => <CreateTreatment match={match} />} />
                <Route path='/' render={() => <div>This element type is not allowed ;) URL error</div>} />
            </Switch>
        );
    }
}