import React, { Component } from 'react';
import cssButtons from '../../../css/buttons.module.css';

export class AdminActions extends Component {
    render() {
        return (
            <div>
                <h2> ADMIN MENU </h2>
                <div className={cssButtons.patientBanner}>
                    <b>Manage users </b>
                </div>
                <div className={cssButtons.patientBanner}>
                    <b>Export database for backup</b>
                </div>
                <div className={cssButtons.patientBanner}>
                    <b>View access log</b>
                </div>
            </div>
        );
    }
}