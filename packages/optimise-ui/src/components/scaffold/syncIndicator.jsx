import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSyncStatusAPICall, syncNowAPICall } from '../../redux/actions/syncInfo';
import Icon from '../icon';
import style from './scaffold.module.css';

@connect(state => ({
    syncInfo: state.syncInfo
}), dispatch => ({
    getSyncStatus: () => dispatch(getSyncStatusAPICall()),
    syncNow: () => dispatch(syncNowAPICall())
}))
export default class StatusBar extends Component {

    constructor() {
        super();
        this.state = {
            lastCall: 0,
            lastError: 0
        };
        this._updateStatus = this._updateStatus.bind(this);
    }

    componentDidMount() {
        this.statusUpdater = setInterval(this._updateStatus, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.statusUpdater);
    }

    _updateStatus() {

        const { syncInfo: { status: { lastSuccess, syncing, error, status } } } = this.props;
        const { lastCall, lastError, triggered } = this.state;
        const now = (new Date()).getTime();

        // Sync every 15 minutes
        const limit = 1000 * 60 * 15;

        let state = {
            lastCall: now
        };

        if ((status === 900 || error !== undefined) && lastError === 0)
            state.lastError = now;
        if (syncing !== true)
            state.triggered = false;
        if (lastCall === 0 || (lastError !== 0 && now - lastError >= limit) || (lastSuccess !== undefined && now - lastSuccess >= limit)) {
            this.props.syncNow();
            state.triggered = true;
            state.lastError = 0;
        } else if (triggered === true && syncing === true)
            this.props.getSyncStatus();

        this.setState(state);
    }

    render() {
        const { syncInfo } = this.props;

        if (syncInfo.config === undefined || syncInfo.config.host === undefined || syncInfo.config.host === '')
            return null;
        if (syncInfo.status.syncing === true)
            return (
                <span><strong className={`${style.statusIcon} ${style.syncActive}`}><Icon symbol={'sync'}></Icon></strong> Syncing ...</span>
            );
        else if (syncInfo.status.lastSuccess !== undefined)
            return (
                <span><strong className={style.statusIcon}><Icon symbol={'cloud'}></Icon></strong> Synced with {(new URL(syncInfo.config.host)).host}</span>
            );
        else
            return (
                <span><strong className={style.statusIcon}><Icon symbol={'attention'}></Icon></strong> Remote unavailable</span>
            );
    }
}