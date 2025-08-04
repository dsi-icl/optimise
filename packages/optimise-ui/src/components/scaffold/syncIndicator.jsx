import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSyncOptionsAPICall, getSyncStatusAPICall, syncNowAPICall } from '../../redux/actions/syncInfo';
import Icon from '../icon';
import style from './scaffold.module.css';

@connect(state => ({
    loggedIn: state.login.loggedIn,
    syncInfo: state.syncInfo
}), dispatch => ({
    getSyncOptions: () => dispatch(getSyncOptionsAPICall()),
    getSyncStatus: () => dispatch(getSyncStatusAPICall()),
    syncNow: () => dispatch(syncNowAPICall())
}))
class SyncIndicator extends Component {
    constructor(props) {
        super(props);
        this.statusUpdater = null;
        this.state = {
            lastCall: 0,
            triggered: false
        };
        this._updateStatus = this._updateStatus.bind(this);
    }

    componentDidMount() {
        if (this.statusUpdater === null)
            this.statusUpdater = setInterval(this._updateStatus, 1000);
    }

    componentDidUpdate() {
        if (this.state.triggered === false) {
            if (this.props.syncInfo?.status?.step === 'triggered'
                || this.props.syncInfo?.status?.syncing === true)
                this.setState({ triggered: true }, () => {
                    if (this.statusUpdater === null)
                        this.statusUpdater = setInterval(this._updateStatus, 1000);
                });
        }
    }

    componentWillUnmount() {
        if (this.statusUpdater !== undefined) {
            clearInterval(this.statusUpdater);
            this.statusUpdater = null;
        }
    }

    _updateStatus() {
        const now = (new Date()).getTime();
        const { syncInfo: { config, status: { syncing, error, status } }, loggedIn } = this.props;
        const { lastCall, triggered } = this.state;
        let state = this.state;

        if (!config.host) {
            if (!loggedIn) {
                state.lastCall = 0;
                this.setState(state, () => {
                    this.props.getSyncOptions();
                });
            }
            return;
        }

        if (status === 900 || error !== undefined) {
            state.triggered = false;
            clearInterval(this.statusUpdater);
            setTimeout(() => {
                this.props.syncNow(true);
                clearInterval(this.statusUpdater);
                state.triggered = true;
                this.setState(state);
                this.statusUpdater = setInterval(this._updateStatus, 1000);
            }, 10000);
            this.statusUpdater = null;
            this.setState(state);
            return;
        }

        if (!syncing && lastCall !== 0) {
            state.triggered = false;
            clearInterval(this.statusUpdater);
            setTimeout(() => {
                this.props.syncNow(true);
                clearInterval(this.statusUpdater);
                state.triggered = true;
                this.setState(state);
                this.statusUpdater = setInterval(this._updateStatus, 1000);
            }, 1000 * 60 * 15);
            this.statusUpdater = null;
            this.setState(state);
            return;
        }

        if (triggered) {
            this.props.getSyncStatus();
            return;
        }

        if (status === 'scheduling') {
            clearInterval(this.statusUpdater);
            state.triggered = true;
            this.setState(state);
            this.statusUpdater = setInterval(this._updateStatus, 1000);
            return;
        }

        // Sync every 15 minutes
        const limit = 1000 * 60 * 15;

        if ((lastCall === 0) || (now - lastCall >= limit)) {
            state.triggered = true;
            state.lastCall = now;
            clearInterval(this.statusUpdater);
            this.statusUpdater = setInterval(this._updateStatus, 1000);
            this.setState(state, () => {
                this.props.syncNow();
            });
            return;
        }
    }

    render() {
        const { syncInfo } = this.props;

        if (syncInfo.config === undefined || syncInfo.config.host === undefined || syncInfo.config.host === '')
            return null;

        const { status } = syncInfo;

        if (status === undefined)
            return null;

        const { lastSuccess, error } = status;

        if (error !== undefined) {
            let message = 'Remote unavailable';
            if (error.message.startsWith('Validation key error'))
                message = 'Sync key error';
            let title = error.message;
            if (error.exception !== undefined)
                title = `${error.message}: ${error.exception}`;
            return (
                <span title={title}>
                    <strong className={style.statusIcon}><Icon symbol="attention"></Icon></strong>
                    {' '}
                    {message}
                </span>
            );
        }
        else if (status.syncing === true) {
            return <span title={`${status.status}: ${status.step}`}>
                <strong className={`${style.statusIcon} ${style.syncActive}`}><Icon symbol="sync"></Icon></strong>
                {
                    status.status === 'scheduling'
                        ? 'Preparing synchronisation'
                        : status.step === 'linking'
                            ? 'Linking'
                            : 'Synching'
                }
                {' '}
                ...
                   </span>;
        }
        else if (lastSuccess !== undefined)
            return (
                <span title={lastSuccess}>
                    <strong className={style.statusIcon}><Icon symbol="cloud"></Icon></strong>
                    {' '}
                    Synced with
                    {' '}
                    {(new URL(syncInfo.config.host)).host}
                </span>
            );
        else
            return null;
    }
}

export default SyncIndicator;
