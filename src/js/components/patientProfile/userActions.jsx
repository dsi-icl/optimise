import React, { Component } from 'react';
import css from '../../../css/searchPatientsById.css.js';
import { NavLink } from 'react-router-dom';
import { PatientProfileSectionScaffold } from './patientProfile.jsx';
export class UserActions extends Component {
    render() {
        return (
            <div>
                <NavLink to={`${window.location.pathname}/createVisit`} style={{ textDecoration: 'none' }}>
                    <div className='patientBanner UserActionButton' style={{ borderRadius: '8px 8px 0 0' }}>
                        <b>&#9679; Create visit</b>
                    </div>
                </NavLink>
                <div className='patientBanner UserActionButton' style={{ borderRadius: '0 0 0 0' }}>
                    <b>&#9679; Add tests, events and prescription </b>
                </div>
                <div className='patientBanner UserActionButton' style={{ borderRadius: '0 0 8px 8px' }}>
                    <b>&#9679; Record clinical events outside visit </b>
                </div>
            </div>
        )
    }
}