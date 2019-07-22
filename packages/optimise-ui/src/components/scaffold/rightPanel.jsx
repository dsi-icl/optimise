import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PatientChart } from '../patientProfile/patientChart';
import { PatientDispatch } from '../patientProfile/patientDispatch';
import { SearchPatient } from '../searchPatient';
import { UserManual } from '../userManual';
import { AdminActions } from '../admin/actions';
import { FilterPanel } from '../filterPatient/selectPanel';
import style from './scaffold.module.css';

export default class RightPanel extends Component {
    render() {
        return (
            <div className={style.rightPanel}>
                <Switch>
                    <Route path='/administration' render={({ match, location }) =>
                        <AdminActions location={location.pathname} match={match} />
                    } />
                    <Route path='/createPatient' component={SearchPatient} />
                    <Route path='/patientProfile/:patientId' render={({ match, location }) =>
                        <PatientChart location={location.pathname} match={match} />
                    } />
                    <Route path='/patientProfile' component={PatientDispatch} />
                    <Route path='/filterPatients' component={FilterPanel} />
                    <Route path='/userManual' component={UserManual} />
                    <Route path='/' component={SearchPatient} />
                </Switch>
            </div>
        );
    }
}
