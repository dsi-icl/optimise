import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { TreatmentInterruption } from './treatmentInterruptions';
import { VisitData } from './visitDataPage';
import { TestData } from './testDataPage';
import { CeData } from './ceDataPage';
import { PregnancyEntry } from '../pregnancyForms/pregnancyEntry';

export class DataPageRouter extends Component {
    render() {
        /* delegating checking valid :elementType to a router rather than checking it in <DataTemplate/> through the match props
           keeping the logic of validating url in one place (routers) instead of in components */
        /* different elementType passed to dataTemplate makes it look in different places in the store */
        return (
            <Switch>
                <Route path="/patientProfile/:patientId/data/test/:testId" render={({ match }) => <TestData elementType="test" match={match} />} />
                <Route path="/patientProfile/:patientId/data/visit/:visitId/vitals" render={({ match }) => <VisitData elementType="visit" match={match} category="vitals" />} />
                <Route path="/patientProfile/:patientId/data/visit/:visitId/symptoms" render={({ match }) => <VisitData elementType="visit" match={match} category="symptoms" />} />
                <Route path="/patientProfile/:patientId/data/visit/:visitId/pregnancy" render={({ match }) => <PregnancyEntry elementType="pregnancy" match={match} />} />
                <Route path="/patientProfile/:patientId/data/visit/:visitId/signs" render={({ match }) => <VisitData elementType="visit" match={match} category="signs" />} />
                <Route path="/patientProfile/:patientId/data/treatment/:elementId" render={({ match }) => <TreatmentInterruption match={match} />} />
                <Route path="/patientProfile/:patientId/data/clinicalEvent/:ceId" render={({ match }) => <CeData elementType="clinicalEvent" match={match} />} />
                <Route path="/" component={() => null} />
            </Switch>
        );
    }
}
