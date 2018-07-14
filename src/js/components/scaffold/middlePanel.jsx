import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SearchPatient } from '../searchPatient';
import { AdminActions } from '../admin/actions';
import { FilterPanel } from '../filterPatient/selectPanel';
import style from './scaffold.module.css';

export default class MiddlePanel extends Component {
    render() {
        return (
            <div className={style.middlePanel}>
                <Switch>
                    <Route exact path='/' component={SearchPatient} />
                    <Route exact path='/searchPatientById' component={SearchPatient} />
                    <Route path='/createPatient' component={SearchPatient} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route path='/administration' render={({ match, location }) => < AdminActions location={location.pathname} match={match} />} />
                    <Route exact path='/filterPatients' component={FilterPanel} />
                    <Route path='/patientProfile/:patientId' component={null} />
                </Switch>
            </div>
        );
    }
}
