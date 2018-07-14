import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { SearchIcon, SettingIcon, ExportIcon, LogoutIcon } from '../../../statics/svg/icons';
import { logoutAPICall } from '../../redux/actions/login.js';
import store from '../../redux/store.js';
import css from '../../../css/scaffold.module.css';
import cssButtons from '../../../css/buttons.module.css';

@connect(state => ({ username: state.login.username }))
export default class MenuBar extends Component {
    constructor() {
        super();
        this._handleLogout = this._handleLogout.bind(this);
    }

    _handleLogout() {
        store.dispatch(logoutAPICall({
            username: this.props.username
        }));
    }

    render() {
        return (
            <div className={css.MenuBar}>
                <br /><br /><br />
                <NavLink to='/searchPatientById' className={cssButtons.menuButton} title='Search and edit patients' activeStyle={{ fill: 'white' }}>
                    <div >
                        <SearchIcon width='50%' />
                    </div>
                </NavLink>

                <a href='/export' className={cssButtons.menuButton} title='Export as CDISC' activeStyle={{ fill: 'white' }}>
                    <div >
                        <ExportIcon width='40%' />
                    </div>
                </a>

                <NavLink to='/administration' className={cssButtons.menuButton} title='Admin settings' activeStyle={{ fill: 'white' }}>
                    <div >
                        <SettingIcon width='50%' />
                    </div>
                </NavLink>
                <div onClick={this._handleLogout} id='logoutButton' title='Logout' className={cssButtons.menuButton}>
                    <div >
                        <LogoutIcon width='45%' />
                    </div>
                </div>

            </div>
        );
    }
}
