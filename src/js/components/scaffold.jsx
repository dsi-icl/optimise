import React, {Component} from 'react';
import {SearchPatientsById} from './searchPatientsById.jsx';
import {Section} from './patientProfile.jsx';
import {WelcomePanel} from './welcomePage.jsx';
import { Route, Switch } from 'react-router-dom';
import css from '../../css/scaffold.css.js';


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

export class RightPanel extends Component {
    render() {
        return (
            <div style={css.rightPanel}>
                <Switch>
                    <Route exact path='/' component={WelcomePanel}/>
                    <Route path='/patientProfile' component={Section}/>
                </Switch>
            </div>
        );
    }
}