import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreatePatient } from '../createPatient';
import { Section } from '../patientProfile/patientProfile';
import { DataPageRouter } from '../medicalData/router';
import { CreateVisit } from '../createMedicalElements/createVisit';
import { CreateElementRouter } from '../createMedicalElements/router';
import { VisitSelector } from '../createMedicalElements/visitSelector';
import { AdminRouter } from '../admin/router';

import style from './scaffold.module.css';

export default class FarRightPanel extends Component {
    render() {
        return (
            <div className={style.farRightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/create/:visitId/:type' render={({ match }) => <CreateElementRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/create/:type' render={({ match }) => <VisitSelector match={match} />} />
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match} />} />
                    <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match} />} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route path='/administration' render={() => <></>} />
                    <Route exact path='/searchPatient/from/deletionSuccessful' component={() => <>The patient has been successfully deleted!</>} />
                    <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatient match={match} />} />
                    <Route exact path='/filterPatients' component={() => <></>} />
                    <Route path='/' component={() => <></>} />
                </Switch>
            </div>
        );
    }
}
