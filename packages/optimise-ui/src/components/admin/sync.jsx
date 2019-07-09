import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getSyncOptionsAPICall, setSyncOptionsAPICall, syncNowAPICall } from '../../redux/actions/syncInfo';
import style from './admin.module.css';

@connect(state => ({
    syncInfo: state.syncInfo
}), dispatch => ({
    getSyncOptions: () => dispatch(getSyncOptionsAPICall()),
    setSyncOptions: body => dispatch(setSyncOptionsAPICall(body)),
    syncNow: () => dispatch(syncNowAPICall())
}))
export class Sync extends PureComponent {

    constructor() {
        super();
        this.state = { error: false };
        this.syncAddress = React.createRef();
        this.syncKey = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleSync = this._handleSync.bind(this);
    }

    componentDidMount() {
        this.props.getSyncOptions();
    }

    _handleSubmit() {
        if (this.syncAddress.current.value === '' || this.syncKey.current.value === '') {
            this.setState({ error: 'Please enter remote syncing information' });
            return;
        }
        const body = {
            host: this.syncAddress.current.value.trim(),
            key: this.syncKey.current.value.trim(),
        };
        this.props.setSyncOptions(body);
        this.setState({ addMore: false, error: false });
    }

    _handleSync() {
        this.props.syncNow();
    }

    render() {
        const { syncInfo: { config: { id, host, key } } } = this.props;

        return (
            <>
                <p>Optimise can connect to a central site to synchronise the content of your database.</p><br />
                <label htmlFor='id'>Agent ID:</label><br /> <input name='id' type='text' readOnly value={id} /><br /><br />
                <label htmlFor='host'>Remote Host:</label><br /> <input name='host' type='text' ref={this.syncAddress} defaultValue={host} /><br /><br />
                <label htmlFor='key'>Validation Key:</label><br /> <input name='key' type='text' ref={this.syncKey} defaultValue={key} /><br /><br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmit} >Save Connection Information</button><br /><br />
                <button onClick={this._handleSync} >Synchronize now</button>
            </>
        );

    }
}