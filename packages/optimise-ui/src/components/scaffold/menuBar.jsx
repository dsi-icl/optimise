import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from '../icon';
import { logoutAPICall } from '../../redux/actions/login';
import store from '../../redux/store';
import style from './scaffold.module.css';


@connect(state => ({
    username: state.login.username,
    priv: state.login.priv
}))
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
                <br />
                <NavLink to='/patientProfile' title='Patient view' className={style.active}>
                    <Icon symbol='user' />
                </NavLink>
                <NavLink to='/searchPatient' title='Search and edit patients' className={style.active}>
                    <Icon symbol='search' />
                </NavLink>
                {this.props.priv === 1 ?
                    (
                        <NavLink to='/administration' title='Admin settings' className={style.active}>
                            <Icon symbol='setting' />
                        </NavLink>
                    ) : null}
                <NavLink to='/userManual' title='Browse the documentation on how to use the software' className={style.active}>
                    <Icon symbol='help' />
                </NavLink>
                <NavLink title='Logout' to='/logout' onClick={this._handleLogout} className={style.active}>
                    <Icon symbol='logout' />
                </NavLink>
            </div>
        );
    }
}
