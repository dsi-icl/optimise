import React, { Component } from 'react';
import { SearchPatientsById } from './searchPatient/searchPatientsById';
import { Section } from './patientProfile/patientProfile.jsx';
import { WelcomePanel } from './welcomePage.jsx';
import css from '../../css/scaffold.css.js';
import { connect } from 'react-redux';
import { CreatePatientComponent } from './createPatient/createPatientPage.jsx';
import { PatientChart } from './patientProfile/patientChart.jsx';
import { Switch, Route, NavLink } from 'react-router-dom';
import { TestData } from './medicalData/dataPage.jsx';
import { History } from './exportCDSIC/history.jsx';
import { CreateVisit } from './createMedicalElements/createVisit.jsx';
import { SearchIcon, SettingIcon, CloudIcon, ExportIcon, FilterIcon, LogoutIcon } from '../../statics/svg/icons.jsx';
import { AdminActions } from './admin/actions.jsx';
import { FilterPanel } from './filterPatient/selectPanel.jsx';
import { Fields } from './filterPatient/fieldPanel.jsx';
export class MenuBar extends Component {
    render() {
        return (
            <div style={css.menuBar}>
                <br/><br/><br/>
                <NavLink to='/searchPatientById' className='menuButton' title='Search and edit patients' activeStyle={{ fill: 'white' }}>
                    <div>
                        <SearchIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/filterPatients' className='menuButton' title='Filter patients' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <FilterIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/exportCDISC' className='menuButton' title='Export as CDISC' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <ExportIcon width='40%'/>
                    </div>
                </NavLink>
                <NavLink to='/uploadToCloud' className='menuButton' title='Upload to central DB' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <CloudIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/administration' className='menuButton' title='Admin settings' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <SettingIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink id='logoutButton' to='/logout' title='Logout' className='menuButton'>
                    <div style={{ textAlign: 'center', position: 'absolute', bottom: '3%' }}>
                        <LogoutIcon width='45%'/>
                    </div>
                </NavLink>
      
            </div>
        );
    }
}

export class MiddlePanel extends Component {
    render() {
        return (
            <div style={css.middlePanel}>
                <Switch>
                    <Route exact path='/' component={SearchPatientsById}/>
                    <Route exact path='/searchPatientById' component={SearchPatientsById}/>
                    <Route exact path='/createPatient' component={SearchPatientsById}/>
                    <Route exact path='/exportCDISC' component={History}/>
                    <Route exact path='/administration' component={AdminActions}/>
                    <Route exact path='/filterPatients' component={FilterPanel}/>
                    <Route path='/patientProfile/:patientId' component={SearchPatientsById}/>
                </Switch>
            </div>
        );
    }
}

@connect(state => ({ page: state.rightPanel }), null, null, { pure: false })
export class RightPanel extends Component {
    render() {
        return (
            <div style={css.rightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId' render={({ match }) => <PatientChart match={match}/>}/>
                    <Route exact path='/searchPatientById'component={''}/>
                    <Route exact path='/' component={WelcomePanel}/>
                    <Route exact path='/exportCDISC' component={''}/>
                    <Route exact path='/administration' component={''}/>
                    <Route exact path='/createPatient' component={CreatePatientComponent}/>
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
            <div style={css.farRightPanel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/ce/:ceId' component={'CE'}/>
                    <Route path='/patientProfile/:patientId/test/:testId' render={({ match }) => <TestData match={match}/>}/>
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
            <div style={css.statusBar}>
                <span style={{ float: 'left', marginLeft: 10, marginTop: '0.2em', display: 'block' }}> You are logged in as </span>
                <span style={{ display: 'block', marginTop: '0.2em', position: 'absolute', float: 'left', right: 10 }}> OptimiseMS v1.0.0</span>
            </div>
        )
    }
}