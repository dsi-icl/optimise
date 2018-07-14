import React, { Component } from 'react';
import { SearchPatientsById } from './searchPatient/searchPatientsById';
import { Section } from './patientProfile/patientProfile.jsx';
import { WelcomePanel } from './welcomePage.jsx';
import css from '../../css/scaffold.module.css';
import cssButtons from '../../css/buttons.module.css';
import { CreatePatientComponent } from './createPatient/createPatientPage.jsx';
import { PatientChart } from './patientProfile/patientChart.jsx';
import { Switch, Route, NavLink } from 'react-router-dom';
import { DataPageRouter } from './medicalData/router.jsx';
import { connect } from 'react-redux';
import { CreateVisit } from './createMedicalElements/createVisit.jsx';
import { SearchIcon, SettingIcon, ExportIcon, LogoutIcon } from '../../statics/svg/icons.jsx';
import { AdminActions } from './admin/actions.jsx';
import { FilterPanel } from './filterPatient/selectPanel.jsx';
import { Fields } from './filterPatient/fieldPanel.jsx';
import { CreateElementRouter } from './createMedicalElements/router.jsx';
import { logoutAPICall } from '../redux/actions/login.js';
import { AdminRouter } from './admin/router.jsx';
import store from '../redux/store.js';

@connect(state => ({ username: state.login.username }))
export class MenuBar extends Component {
    constructor() {
        super();
        this._handleLogout = this._handleLogout.bind(this);
    }

    _handleLogout() {
        store.dispatch(logoutAPICall({
            username: this.props.username
        }));
    }

    render() {
        return (
            <div className={css.MenuBar}>
                <br /><br /><br />
                <NavLink to='/searchPatientById' className={cssButtons.menuButton} title='Search and edit patients' activeStyle={{ fill: 'white' }}>
                    <div >
                        <SearchIcon width='50%' />
                    </div>
                </NavLink>

                <a href='/export' className={cssButtons.menuButton} title='Export as CDISC' activeStyle={{ fill: 'white' }}>
                    <div >
                        <ExportIcon width='40%' />
                    </div>
                </a>

                <NavLink to='/administration' className={cssButtons.menuButton} title='Admin settings' activeStyle={{ fill: 'white' }}>
                    <div >
                        <SettingIcon width='50%' />
                    </div>
                </NavLink>
                <div onClick={this._handleLogout} id='logoutButton' title='Logout' className={cssButtons.menuButton}>
                    <div >
                        <LogoutIcon width='45%' />
                    </div>
                </div>

            </div>
        );
    }
}

/*
<NavLink to='/exportCDISC' className={cssButtons.menuButton} title='Export as CDISC' activeStyle={{ fill: 'white' }}>
    <div >
        <ExportIcon width='40%' />
    </div>
</NavLink>
<NavLink to='/filterPatients' className={cssButtons.menuButton} title='Filter patients' activeStyle={{ fill: 'white' }}>
<div >
    <FilterIcon width='50%'/>
</div>
</NavLink>
<NavLink to='/uploadToCloud' className={cssButtons.menuButton} title='Upload to central DB' activeStyle={{ fill: 'white' }}>
<div >
    <CloudIcon width='50%'/>
</div>
</NavLink> */

export class MiddlePanel extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={SearchPatientsById} />
                <Route exact path='/searchPatientById' component={SearchPatientsById} />
                <Route path='/createPatient' component={SearchPatientsById} />
                <Route exact path='/export' component={() => <></>} />
                <Route path='/administration' render={({ match, location }) => < AdminActions location={location.pathname} match={match} />} />
                <Route exact path='/filterPatients' component={FilterPanel} />
                <Route path='/patientProfile/:patientId' component={null} />
            </Switch>
        );
    }
}

export class RightPanel extends Component {
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

export class FarRightPanel extends Component {
    render() {
        return (
            <div className={css.RightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/create/:visitId/:type' render={({ match }) => <CreateElementRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match} />} />
                    <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match} />} />
                    <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match} />} />
                    <Route exact path='/export' component={() => <></>} />
                    <Route exact path='/administration' component={() => <></>} />
                    <Route exact path='/searchPatientById' component={() => <></>} />
                    <Route exact path='/createPatient' component={() => <></>} />
                    <Route exact path='/filterPatients' component={() => <></>} />
                    <Route exact path='/' component={() => <></>} />
                </Switch>
            </div>
        );
    }
}

@connect(state => ({ username: state.login.username }))
export class StatusBar extends Component {
    render() {
        return (
            <div className={css.StatusBar}>
                <span > You are logged in as {this.props.username}</span>
                <span > OptimiseMS v1.0.0</span>
            </div>
        );
    }
}