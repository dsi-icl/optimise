import React, { Component } from 'react';
import cssButtons from '../../../css/buttons.module.css';
import { NavLink } from 'react-router-dom';

export class AdminActions extends Component {
    render() {
        return (
            <div style={{ backgroundColor: '#E7E5E6' }}>
                <h2> ADMIN MENU </h2>
                <NavLink to='/administration/users' style={{ textDecoration: 'none' }} activeClassName={cssButtons.adminActionButtonClicked}>
                    <div className={cssButtons.patientBanner}>
                        <b>Manage users</b>
                    </div>
                </NavLink>
                <NavLink to='/administration/log' style={{ textDecoration: 'none' }} activeClassName={cssButtons.adminActionButtonClicked}>
                    <div className={cssButtons.patientBanner}>
                        <b>View access log</b>
                    </div>
                </NavLink>
            </div>
        );
    }
}