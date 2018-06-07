import React, {Component} from 'react';
import {SearchPatientsById} from './searchPatientsById.jsx';
import {Section} from './patientProfile.jsx';
import {WelcomePanel} from './welcomePage.jsx';
import { Route, Switch } from 'react-router-dom';
import css from '../../css/scaffold.css.js';
import { connect } from 'react-redux';
import { CreatePatientComponent } from './createPatientPage.jsx';
import { PatientChart } from './patientChart.jsx';


export class MenuBar extends Component {
    render() {
        return (
            <div style={css.menuBar}><span>d</span></div>
        );
    }
}

export class MiddlePanel extends Component {
    render() {
        return (
            <div style={css.middlePanel}>
            <SearchPatientsById/>
            </div>
        );
    }
}

class RightPanel_toConnect extends Component {
    render() {
        switch (this.props.page){
            case 0:
                return <div style={css.rightPanel}><WelcomePanel/></div>;
            case 1:
                return <div style={css.rightPanel}><Section/></div>;
            case 2:
                return <div style={css.rightPanel}><CreatePatientComponent/></div>;
            case 3:
                return <div style={css.rightPanel}><PatientChart/></div>;
        }
    }
}

export const RightPanel = connect(state => ({page: state.rightPanel}))(RightPanel_toConnect);