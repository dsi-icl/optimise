import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { EditVisit, EditTest, EditCE, EditMed, EditDemo, EditDiagnoses, EditPregnancies, EditCommunication, EditPerformanceMesaure, EditComorbidities } from './index';

export class EditElementRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/edit/visit/:visitId' render={({ match, location }) => <EditVisit match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/comorbidity/:visitId' render={({ match, location }) => <EditComorbidities match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/test/:elementId' render={({ match, location }) => <EditTest match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/clinicalEvent/:elementId' render={({ match, location }) => <EditCE match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/treatment/:elementId' render={({ match, location }) => <EditMed match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/demographic/data' render={({ match, location }) => <EditDemo match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/diagnosis/data' render={({ match, location }) => <EditDiagnoses match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/pregnancy/data' render={({ match, location }) => <EditPregnancies match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/communication/:visitId' render={({ match, location }) => <EditCommunication match={match} location={location} />} />
                <Route path='/patientProfile/:patientId/edit/msPerfMeas/:visitId' render={({ match, location }) => <EditPerformanceMesaure match={match} location={location} />} />
                <Route path='/' component={() => <></>} />
            </Switch>
        );
    }
}