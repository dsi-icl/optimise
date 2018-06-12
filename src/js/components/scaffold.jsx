import React, {Component} from 'react';
import {SearchPatientsById} from './searchPatientsById.jsx';
import {Section} from './patientProfile.jsx';
import {WelcomePanel} from './welcomePage.jsx';
import css from '../../css/scaffold.css.js';
import { connect } from 'react-redux';
import { CreatePatientComponent } from './createPatientPage.jsx';
import { PatientChart } from './patientChart.jsx';
import { Switch, Route } from 'react-router-dom';

export class MenuBar extends Component {
    render() {
        return (
            <div style={css.menuBar}><span>d</span></div>
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
                <Route path='/patientProfile/:patientId' component={RightPanelWrapper(<PatientChart/>)}/>
                <Route exact path='/' component={RightPanelWrapper(<WelcomePanel/>)}/>
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
                <Route path='/patientProfile/:patientId' component={FarRightPanelWrapper(<SearchPatientsById/>)}/>
                <Route exact path='/' component={FarRightPanelWrapper(<SearchPatientsById/>)}/>
            </Switch>
        );
    }
}

export const RightPanel = connect(state => ({page: state.rightPanel}), null,null, {pure: false})(RightPanel_toConnect);