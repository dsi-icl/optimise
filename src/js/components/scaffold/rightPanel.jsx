import React, { Component } from 'react';
import { WelcomePanel } from '../welcomePage';
import { CreatePatientComponent } from '../createPatient/createPatientPage';
import { PatientChart } from '../patientProfile/patientChart';
import { Switch, Route } from 'react-router-dom';
import { Fields } from '../filterPatient/fieldPanel';
import { AdminRouter } from '../admin/router';

export default class RightPanel extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId' render={({ match, location }) => <PatientChart location={location.pathname} match={match} />} />
                <Route exact path='/searchPatientById' component={() => <></>} />
                <Route exact path='/' component={WelcomePanel} />
                <Route exact path='/export' component={() => <></>} />
                <Route path='/administration' render={() => <AdminRouter />} />
                <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatientComponent match={match} />} />
                <Route exact path='/filterPatients' component={Fields} />
                <Route component={() => <span>Oops! seems like we cannot find your url</span>} />
            </Switch>
        );
    }
}
