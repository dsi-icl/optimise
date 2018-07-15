import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { CreatePatient } from '../createPatient';
import { Section } from '../patientProfile/patientProfile';
import { DataPageRouter } from '../medicalData/router';
import { CreateVisit } from '../createMedicalElements/createVisit';
import { CreateElementRouter } from '../createMedicalElements/router';
import style from './scaffold.module.css';

export default class FarRightPanel extends Component {
    render() {
        return (
            <div className={style.farRightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/create/:visitId/:type' render={({ match }) => <CreateElementRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match} />} />
                    <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match} />} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route exact path='/administration' component={() => <></>} />
                    <Route exact path='/searchPatientById' component={() => <></>} />
                    <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatient match={match} />} />
                    <Route exact path='/filterPatients' component={() => <></>} />
                    <Route exact path='/' component={() => <></>} />
                </Switch>
            </div>
        );
    }
}
