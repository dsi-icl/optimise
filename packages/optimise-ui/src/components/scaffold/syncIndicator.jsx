import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../icon';
import style from './scaffold.module.css';

@connect(state => ({
    syncInfo: state.syncInfo
}))
export default class StatusBar extends Component {
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