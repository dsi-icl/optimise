import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreatePatient } from '../createPatient';
import { Section } from '../patientProfile/patientProfile';
import { DataPageRouter } from '../medicalData/router';
import { CreateVisit } from '../createMedicalElements/createVisit';
import { CreateElementRouter } from '../createMedicalElements/router';
import { EditElementRouter } from '../editMedicalElements/router';
import { ExportSets } from '../exportCDSIC/exportSet';
import { DeletedPatient } from '../patientProfile/deletedProfile';
import { UserCreate } from '../admin/userCreatePage';
import { UserDetail } from '../admin/userDetailPage';
import { UserActions } from '../admin/userActions';
import { UserManualMenu } from '../userManual';
import style from './scaffold.module.css';
import { EditPregnancies } from '../pregnancyForms/editPregnancy';


export default class FarRightPanel extends Component {
    render() {
        return (
            <div className={style.farRightPanel}>
            <Switch>
            {
                /*<Route path='/' render={({ match }) => <PregnancyBaselineDataForm/>} /> */
            }
            <Route path='/patientProfile/:patientId/create/:type' render={({ match }) => <CreateElementRouter match={match} />} />
            <Route path='/patientProfile/:patientId/edit/:elementType/:elementId' render={({ match }) => <EditElementRouter match={match} />} />
            <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match} />} />
            <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match} />} />
            <Route path='/patientProfile/:patientId/editPregnancyDataEntry/:entryId' render={({ match }) => <EditPregnancies match={match} />} />
            <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match} />} />
            <Route exact path='/searchPatient/from/deletionSuccessful' component={() => <DeletedPatient />} />
            <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatient match={match} />} />
            <Route exact path='/createPatient/' render={() => <CreatePatient />} />
            <Route exact path='/filterPatients' component={() => <></>} />
            <Route exact path='/administration/users/create' render={({ match }) => <UserCreate match={match} />} />
            <Route exact path='/administration/users/:userId' render={({ match }) => <UserDetail match={match} />} />
            <Route exact path='/administration/users' render={({ match }) => <UserActions match={match} />} />
            <Route path='/administration' component={() => <></>} />
            <Route path='/userManual' component={UserManualMenu} />
            <Route path='/' render={({ match }) => <ExportSets match={match} />} />
            </Switch>
            </div>
        );
    }
}
