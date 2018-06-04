import React, {Component} from 'react';
import {SearchPatientsById} from './searchPatientsById.jsx';
import {Section} from './patientProfile.jsx';

const height = 500; //for dev
const padding = 20; //for dev

export class MenuBar extends Component {
    render() {
        const menuBar = {
            backgroundColor: '#313E51',
            width: 100,
            height: height,
            padding: padding,
            float: 'left'
        };

        return (
            <div style={menuBar}><span>d</span></div>
        );
    }
}

export class MiddlePanel extends Component {
    render() {
        const middlePanel = {
            backgroundColor: '#E7E5E6',
            width: 300,
            height: height,
            padding: padding,
            float: 'left',
            overflow: 'auto'
        };

        return (
            <div style={middlePanel}>
            <SearchPatientsById/>
            </div>
        );
    }
}

export class RightPanel extends Component {
    render() {
        const rightPanel = {
            backgroundColor: '#f5f6fa',
            width: 800,
            height: height,
            padding: padding,
            float: 'left',
            overflow: 'auto'
        };

        return (
            <div style={rightPanel}>
            <Section/>
            </div>
        );
    }
}