import React, { Component } from 'react';
import css from '../../css/searchPatientsById.css.js';
import { NavLink } from 'react-router-dom';

export class UserActions extends Component {
    render() {
        return (
            <div style={{ width: '100%' }}>
                <NavLink to={`${window.location.pathname}/createVisit`}>
                    <div style={Object.assign({}, css.patientBanner, { width: null, minWidth: '20%', minHeight: '1.3em', float: 'left' })}>
                        Create visit
                    </div>
                </NavLink>
                <div style={Object.assign({}, css.patientBanner, { width: null, minWidth: '20%', minHeight: '1.3em', float: 'left' })}>
                    Add tests, events and prescription
                </div>
            </div>
        )
    }
}