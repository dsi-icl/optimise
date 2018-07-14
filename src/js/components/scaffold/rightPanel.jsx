import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { WelcomePanel } from '../welcomePage';
import { CreatePatient } from '../createPatient';
import { PatientChart } from '../patientProfile/patientChart';
import { Fields } from '../filterPatient/fieldPanel';
import { AdminRouter } from '../admin/router';
import style from './scaffold.module.css';

export default class RightPanel extends Component {
    render() {
        return (
            <div className={style.rightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId' render={({ match, location }) => <PatientChart location={location.pathname} match={match} />} />
                    <Route exact path='/searchPatientById' component={() => <></>} />
                    <Route exact path='/' component={WelcomePanel} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route path='/administration' render={() => <AdminRouter />} />
                    <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatient match={match} />} />
                    <Route exact path='/filterPatients' component={Fields} />
                </Switch>
            </div>
        );
    }
}
