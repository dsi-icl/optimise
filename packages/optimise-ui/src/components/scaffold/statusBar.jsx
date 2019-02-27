import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './scaffold.module.css';
import packageInfo from '../../../package.json';

@connect(state => ({
    username: state.login.username
}))
export default class StatusBar extends Component {
    render() {
        let version = packageInfo.version;
        if (window && window.optimiseVersion)
            version = window.optimiseVersion;
        return (
            <div className={style.statusBar}>
                <span> You are logged in as {this.props.username}</span>
                <span className={style.rightPush}> OptimiseMS v{version}</span>
            </div>
        );
    }
}