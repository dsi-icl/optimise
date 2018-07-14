import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import cssButtons from '../../../css/buttons.module.css';

export class AdminActions extends Component {
    render() {
        return (
            <div >
                <h2> ADMIN MENU </h2>
                <NavLink to='/administration/users' activeClassName={cssButtons.adminActionButtonClicked}>
                    <div className={cssButtons.patientBanner}>
                        <b>Manage users</b>
                    </div>
                </NavLink>
                <NavLink to='/administration/log' activeClassName={cssButtons.adminActionButtonClicked}>
                    <div className={cssButtons.patientBanner}>
                        <b>View access log</b>
                    </div>
                </NavLink>
            </div>
        );
    }
}