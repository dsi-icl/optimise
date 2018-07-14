import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { ExportIcon, LogoutIcon, SearchIcon, SettingIcon } from '../../../statics/svg/icons';
import { logoutAPICall } from '../../redux/actions/login.js';
import store from '../../redux/store.js';
import style from './scaffold.module.css';

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
            <div className={style.menuBar}>
                <br /><br /><br />
                <NavLink to='/searchPatientById' className={style.menuButton} title='Search and edit patients' activeClassName={style.menuButtonActive}>
                    <div >
                        <SearchIcon width='50%' />
                    </div>
                </NavLink>

                <a href='/export' className={style.menuButton} title='Export as CDISC'>
                    <div >
                        <ExportIcon width='40%' />
                    </div>
                </a>

                <NavLink to='/administration' className={style.menuButton} title='Admin settings' activeClassName={style.menuButtonActive}>
                    <div >
                        <SettingIcon width='50%' />
                    </div>
                </NavLink>
                <div onClick={this._handleLogout} id='logoutButton' title='Logout' className={style.menuButton}>
                    <div >
                        <LogoutIcon width='45%' />
                    </div>
                </div>

            </div>
        );
    }
}
