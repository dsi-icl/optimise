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
import { SearchIcon, SettingIcon, CloudIcon, ExportIcon, FilterIcon } from '../../statics/svg/icons.jsx';

export class MenuBar extends Component {
    render() {
        const style = {
            display: 'block',
            margin: '0 auto',
            cursor: 'pointer',
            width: 'calc(80%)',
            marginTop: 10,
            marginBottom: 10
        };

        return (
            <div style={css.menuBar}>
                <br/><br/><br/>
                <NavLink to='/searchPatientById' className='menuButton' activeStyle={{ fill: 'white' }}>
                    <div>
                        <SearchIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/filterPatients' className='menuButton' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <FilterIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/exportCDISC' className='menuButton' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <ExportIcon width='40%'/>
                    </div>
                </NavLink>
                <NavLink to='/uploadToCloud' className='menuButton' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <CloudIcon width='50%'/>
                    </div>
                </NavLink>
                <NavLink to='/administration' className='menuButton' activeStyle={{ fill: 'white' }}>
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <SettingIcon width='50%'/>
                    </div>
                </NavLink>
      
            </div>
        );
    }
}

function MiddlePanelWrapper(children) {
    return (
        () =>
            <div style={css.middlePanel}>
                {children}
            </div>
    );
}

export class MiddlePanel extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={MiddlePanelWrapper(<SearchPatientsById/>)}/>
                <Route exact path='/searchPatientById' component={MiddlePanelWrapper(<SearchPatientsById/>)}/>
                <Route exact path='/createPatient' component={MiddlePanelWrapper(<SearchPatientsById/>)}/>
                <Route exact path='/exportCDISC' component={MiddlePanelWrapper(<History/>)}/>
                <Route path='/patientProfile/:patientId' component={MiddlePanelWrapper(<SearchPatientsById/>)}/>
            </Switch>
        );
    }
}

function RightPanelWrapper(children) {
    return (
        () => 
            <div style={css.rightPanel}>
                {children}
            </div>
    );
}



@connect(state => ({ page: state.rightPanel }), null, null, { pure: false })
export class RightPanel extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId' render={RightPanelWrapper(<PatientChart/>)}/>
                <Route exact path='/searchPatientById'component={RightPanelWrapper('')}/>
                <Route exact path='/' component={RightPanelWrapper(<WelcomePanel/>)}/>
                <Route exact path='/createPatient' component={RightPanelWrapper(<CreatePatientComponent/>)}/>
                <Route component={() => <span>Oops! seems like we cannot find your url</span>}/>
            </Switch>
        );
    }
}

function FarRightPanelWrapper(children) {
    return (
        () =>
            <div style={css.farRightPanel}>
                {children}
            </div>
    );
}

export class FarRightPanel extends Component {
    render() {
        return (
            <Switch>
                <Route path='/patientProfile/:patientId/ce/:ceId' component={FarRightPanelWrapper('CE')}/>
                <Route path='/patientProfile/:patientId/test/:testId' component={FarRightPanelWrapper(<TestData/>)}/>
                <Route path='/patientProfile/:patientId/createVisit' render={FarRightPanelWrapper(<CreateVisit/>)}/>
                <Route path='/patientProfile/:patientId' render={FarRightPanelWrapper(<Section/>)}/>
                <Route exact path='/searchPatientById'component={FarRightPanelWrapper('')}/>
                <Route exact path='/createPatient' component={FarRightPanelWrapper('')}/>
                <Route exact path='/' component={FarRightPanelWrapper(<SearchPatientsById/>)}/>
            </Switch>
        );
    }
}

export class StatusBar extends Component {
    render() {
        return (
            <div style={css.statusBar}>
                <span style={{ marginLeft: 10, marginTop: '0.2em', display: 'block' }}> You are logged in as </span>
            </div>
        )
    }
}
