import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from '../icon';
import { logoutAPICall } from '../../redux/actions/login';
import store from '../../redux/store';
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
                <NavLink to='/searchPatientById' title='Search and edit patients' activeClassName={style.active}>
                    <Icon symbol='search' />
                </NavLink>

                <a title='Export as CDISC' href='/export'>
                    <Icon symbol='export' />
                </a>

                <NavLink to='/administration' title='Admin settings' activeClassName={style.active}>
                    <Icon symbol='setting' />
                </NavLink>

                <a title='Logout' href='#logout' onClick={this._handleLogout} id='logoutButton'>
                    <Icon symbol='logout' />
                </a>

            </div>
        );
    }
}
