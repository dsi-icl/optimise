import React, { Component } from 'react';
import { SearchPatientsById } from './searchPatient/searchPatientsById';
import { Section } from './patientProfile/patientProfile.jsx';
import { WelcomePanel } from './welcomePage.jsx';
import css from '../../css/scaffold.module.css';
import cssButtons from '../../css/buttons.module.css';
import { connect } from 'react-redux';
import { CreatePatientComponent } from './createPatient/createPatientPage.jsx';
import { PatientChart } from './patientProfile/patientChart.jsx';
import { Switch, Route, NavLink } from 'react-router-dom';
import { DataPageRouter } from './medicalData/router.jsx';
import { History } from './exportCDSIC/history.jsx';
import { CreateVisit } from './createMedicalElements/createVisit.jsx';
import { SearchIcon, SettingIcon, CloudIcon, ExportIcon, FilterIcon, LogoutIcon } from '../../statics/svg/icons.jsx';
import { AdminActions } from './admin/actions.jsx';
import { FilterPanel } from './filterPatient/selectPanel.jsx';
import { Fields } from './filterPatient/fieldPanel.jsx';
import { CreateElementRouter } from './createMedicalElements/router.jsx';
export class MenuBar extends Component {
    render() {
        return (
            <div className={css.MenuBar}>
                <br/><br/><br/>
                <NavLink to='/searchPatientById'  style={{ gridRow: '2/3' }} className={cssButtons.menuButton} title='Search and edit patients' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center' }}>
                        <SearchIcon width='50%'/>
                    </div>
                </NavLink>

                <NavLink to='/exportCDISC' style={{ gridRow: '3/4' }} className={cssButtons.menuButton} title='Export as CDISC' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center' }}>
                        <ExportIcon width='40%'/>
                    </div>
                </NavLink>

                <NavLink to='/administration' style={{ gridRow: '4/5' }} className={cssButtons.menuButton} title='Admin settings' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center' }}>
                        <SettingIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink id='logoutButton' to='/logout' style={{ gridRow: '8/9' }} title='Logout' className={cssButtons.menuButton}>
                    <div style={{ textAlign: 'center' }}>
                        <LogoutIcon width='45%'/>
                    </div>
                </NavLink>
      
            </div>
        );
    }
}

/* <NavLink to='/filterPatients' style={{ gridRow: '3/4' }} className={cssButtons.menuButton} title='Filter patients' activeStyle={{ fill: 'white' }}>
<div style={{ textAlign: 'center' }}>
    <FilterIcon width='50%'/>
</div>
</NavLink>
<NavLink to='/uploadToCloud' style={{ gridRow: '5/6' }} className={cssButtons.menuButton} title='Upload to central DB' activeStyle={{ fill: 'white' }}>
<div style={{ textAlign: 'center' }}>
    <CloudIcon width='50%'/>
</div>
</NavLink> */

export class MiddlePanel extends Component {
    render() {
        return (
            <div className={css.LeftPanel}>
                <Switch>
                    <Route exact path='/' component={SearchPatientsById}/>
                    <Route exact path='/searchPatientById' component={SearchPatientsById}/>
                    <Route path='/createPatient' component={SearchPatientsById}/>
                    <Route exact path='/exportCDISC' component={History}/>
                    <Route exact path='/administration' component={AdminActions}/>
                    <Route exact path='/filterPatients' component={FilterPanel}/>
                    <Route path='/patientProfile/:patientId' component={SearchPatientsById}/>
                </Switch>
            </div>
        );
    }
}

export class RightPanel extends Component {
    render() {
        return (
            <div className={css.MiddlePanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId' render={({ match, location }) => <PatientChart location={location.pathname} match={match}/>}/>
                    <Route exact path='/searchPatientById'component={''}/>
                    <Route exact path='/' component={WelcomePanel}/>
                    <Route exact path='/exportCDISC' component={''}/>
                    <Route exact path='/administration' component={''}/>
                    <Route exact path='/createPatient/:patientIdCreated' render={({ match }) => <CreatePatientComponent match={match}/>}/>
                    <Route exact path='/filterPatients' component={Fields}/>
                    <Route component={() => <span>Oops! seems like we cannot find your url</span>}/>
                </Switch>
            </div>
        );
    }
}

export class FarRightPanel extends Component {
    render() {
        return (
            <div className={css.RightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/create/:visitId/:type' render={({ match }) => <CreateElementRouter match={match}/>}/>
                    <Route path='/patientProfile/:patientId/data/:elementType/:elementId' render={({ match }) => <DataPageRouter match={match}/>}/>
                    <Route path='/patientProfile/:patientId/createVisit' render={({ match }) => <CreateVisit match={match}/>}/>
                    <Route path='/patientProfile/:patientId' render={({ match }) => <Section match={match}/>}/>
                    <Route exact path='/exportCDISC' component={''}/>
                    <Route exact path='/administration' component={''}/>
                    <Route exact path='/searchPatientById'component={''}/>
                    <Route exact path='/createPatient' component={''}/>
                    <Route exact path='/filterPatients' component={''}/>
                    <Route exact path='/' component={''}/>
                </Switch>
            </div>
        );
    }
}

export class StatusBar extends Component {
    render() {
        return (
            <div className={css.StatusBar}>
                <span style={{ float: 'left', marginLeft: 10, marginTop: '0.2em', display: 'block' }}> You are logged in as </span>
                <span style={{ display: 'block', marginTop: '0.2em', position: 'absolute', float: 'left', right: 10 }}> OptimiseMS v1.0.0</span>
            </div>
        )
    }
}