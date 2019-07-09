import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSyncStatusAPICall } from '../../redux/actions/syncInfo';
import Icon from '../icon';
import style from './scaffold.module.css';

@connect(state => ({
    syncInfo: state.syncInfo
}), dispatch => ({
    getSyncStatus: () => dispatch(getSyncStatusAPICall())
}))
export default class StatusBar extends Component {

    constructor() {
        super();
        this._updateStatus = this._updateStatus.bind(this);
    }

    componentDidMount() {
        this.statusUpdater = setInterval(this._updateStatus, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.statusUpdater);
    }

    _updateStatus() {
        this.props.getSyncStatus();
    }

    render() {
        const { syncInfo } = this.props;
        if (syncInfo.config === undefined || syncInfo.config.host === undefined || syncInfo.config.host === '')
            return null;
        if (syncInfo.status.syncing === true)
            return (
                <span><strong className={`${style.statusIcon} ${style.syncActive}`}><Icon symbol={'sync'}></Icon></strong> Syncing ...</span>
            );
        else if (syncInfo.status.available === true)
            return (
                <span><strong className={style.statusIcon}><Icon symbol={'cloud'}></Icon></strong> Remote available at {(new URL(syncInfo.config.host)).host}</span>
            );
        else
            return (
                <span><strong className={style.statusIcon}><Icon symbol={'attention'}></Icon></strong> Remote unavailable</span>
            );
    }
}