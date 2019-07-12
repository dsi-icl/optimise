import React, { Component } from 'react';
import { connect } from 'react-redux';
import SyncIndicator from './syncIndicator';
import style from './scaffold.module.css';
import packageInfo from '../../../package.json';

@connect(state => ({
    username: state.login.username,
    fetching: state.availableFields.fetching
}))
export default class StatusBar extends Component {
    render() {
        let version = packageInfo.version;
        if (window && window.optimiseVersion)
            version = window.optimiseVersion;
        const { username, fetching } = this.props;
        return (
            <div className={style.statusBar} style={{ visibility: (username !== '' && fetching !== true) ? 'visible' : 'hidden' }}>
                <span> Logged in as {username}</span>
                <SyncIndicator></SyncIndicator>
                <span className={style.rightPush}> OptimiseMS v{version}</span>
            </div>
        );
    }
}
