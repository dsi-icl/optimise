import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Button} from './sharedComponents.jsx';
import css from '../../css/searchPatientsById.css.js';

export class UserActions extends Component {
    render() {
        const buttonStyle = {
            margin: '0 auto',
            width: '40%',
            backgroundColor: 'grey'
        };
        return (
            <div style={{width: '100%'}}>
                <div style={Object.assign({}, css.patientBanner, {width: null, minWidth: '20%', minHeight: '1.3em', float: 'left'})}>
                    Create visit
                </div>
                <div style={Object.assign({}, css.patientBanner, {width: null, minWidth: '20%', minHeight: '1.3em', float: 'left'})}>
                    Add tests, events and prescription
                </div>
            </div>
        )
    }
}