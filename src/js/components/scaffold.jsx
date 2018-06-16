import React, {Component} from 'react';
import {SearchPatientsById} from './searchPatientsById.jsx';
import {Section} from './patientProfile.jsx';
import {WelcomePanel} from './welcomePage.jsx';
import css from '../../css/scaffold.css.js';
import { connect } from 'react-redux';
import { CreatePatientComponent } from './createPatientPage.jsx';
import { PatientChart } from './patientChart.jsx';
import { Switch, Route, NavLink } from 'react-router-dom';
import { TestData } from './dataPage.jsx';
import { History } from './exportCDSIC/history.jsx';
import { UserActions } from './userActions.jsx';
import filterIcon from '../../statics/icons/icons8-conversion-48.png';
import adminIcon from '../../statics/icons/icons8-monarch-48.png';
import csvIcon from '../../statics/icons/icons8-csv-48.png';
import cloudIcon from '../../statics/icons/icons8-cloud-40.png';
import searchIcon from '../../statics/icons/icons8-detective-48.png';

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
                <NavLink to='/searchPatientById' activeClassName='menuButton'>
                    <div>
                        <img src={searchIcon} alt='search patient by id' title='Search Patient by Id' style={style}/>
                    </div>
                </NavLink>
                <NavLink to='/filterPatients' activeClassName='menuButton'>
                    <div>
                        <img src={filterIcon} alt='filter patient' title='Filter patients' style={style}/>
                    </div>
                </NavLink>
                <NavLink to='/exportCDISC' activeClassName='menuButton'>
                    <div>
                        <img src={csvIcon} alt='export CDISC' title='Export as CDISC' style={style}/>
                    </div>
                </NavLink>
                <NavLink to='/uploadToCloud' activeClassName='menuButton'>
                    <div>
                        <img src={cloudIcon} alt='upload to cloud' title='Upload to central db' style={style}/>
                    </div>
                </NavLink>
                <NavLink to='/administration' activeClassName='menuButton'>
                    <div>
                        <img src={adminIcon} alt='admin' title='Administration' style={style}/>     
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



class RightPanel_toConnect extends Component {
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
                <Route path='/patientProfile/:patientId' component={FarRightPanelWrapper(<UserActions/>)}/>
                <Route exact path='/searchPatientById'component={FarRightPanelWrapper('')}/>
                <Route exact path='/createPatient' component={FarRightPanelWrapper('')}/>
                <Route exact path='/' component={FarRightPanelWrapper(<SearchPatientsById/>)}/>
            </Switch>
        );
    }
}

export const RightPanel = connect(state => ({page: state.rightPanel}), null,null, {pure: false})(RightPanel_toConnect);