import React, { Component } from 'react';
import { connect } from 'react-redux';
import SyncIndicator from './syncIndicator';
import style from './scaffold.module.css';
import packageInfo from '../../../package.json';
import { NavLink } from 'react-router-dom';

@connect(state => ({
    username: state.login.username,
    fetching: state.availableFields.fetching,
    adminPriv: state.login.adminPriv
}))
class StatusBar extends Component {
    render() {
        let version = packageInfo.version;
        if (window && window.optimiseVersion)
            version = window.optimiseVersion;
        const { username, fetching, adminPriv } = this.props;
        return (
            <div className={style.statusBar} style={{ visibility: (username !== '' && fetching !== true) ? 'visible' : 'hidden' }}>
                <span> Logged in as {username}</span>
                {adminPriv === 1 ?
                    <SyncIndicator></SyncIndicator>
                    :
                    null
                }
                <div className={style.rightPush}>
                    <NavLink to='/remoteControl'>
                        <span className={style.remote_button}>Remote</span>
                    </NavLink>
                    <span>OptimiseMS v{version}</span>
                </div>
            </div>
        );
    }
}

export default StatusBar;
