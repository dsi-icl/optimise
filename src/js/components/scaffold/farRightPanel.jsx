import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreatePatient } from '../createPatient';
import { Section } from '../patientProfile/patientProfile';
import { DataPageRouter } from '../medicalData/router';
import { CreateVisit } from '../createMedicalElements/createVisit';
import { CreateElementRouter } from '../createMedicalElements/router';
import { EditElementRouter } from '../editMedicalElements/router';
import { VisitSelector } from '../createMedicalElements/visitSelector';
import { ExportSets } from '../exportCDSIC/exportSet';
import { UserDetail } from '../admin/userDetailPage';

import style from './scaffold.module.css';

export default class FarRightPanel extends Component {
    render() {
        return (
            <div className={style.farRightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/create/:visitId/:type' render={({ match }) => <CreateElementRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/create/:type' render={({ match }) => <VisitSelector match={match} />} />
                    <Route path='/patientProfile/:patientId/edit/:elementType/:elementId' render={({ match }) => <EditElementRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match} />} />
                    <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match} />} />
                    <Route exact path='/searchPatient/from/deletionSuccessful' component={() => <h3>The patient has been successfully deleted!</h3>} />
                    <Route exact path='/searchPatient/' render={({ match }) => <ExportSets match={match} />} />
                    <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatient match={match} />} />
                    <Route exact path='/filterPatients' component={() => <></>} />
                    <Route exact path='/administration/users/:userId' render={({ match }) => <UserDetail match={match} />} />
                    <Route path='/' component={() => <></>} />
                </Switch>
            </div>
        );
    }
}
