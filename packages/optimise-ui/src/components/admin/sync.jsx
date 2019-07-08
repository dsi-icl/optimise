import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { saveSyncOptionsAPICall } from '../../redux/actions/syncOptions';
import style from './admin.module.css';

@connect(state => ({
    syncOptions: state.syncOptions
}), dispatch => ({
    saveSyncOptions: body => dispatch(saveSyncOptionsAPICall(body))
}))
export class Sync extends PureComponent {

    constructor() {
        super();
        this.state = { error: false };
        this.syncAddress = React.createRef();
        this.syncKey = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit() {
        if (this.conPwRef.current.value === '' || this.pwRef.current.value === '' || this.pwRef.current.value !== this.conPwRef.current.value) {
            this.setState({ error: true });
            return;
        }
        const body = {
            username: this.props.username,
            pw: this.pwRef.current.value,
        };
        this.saveSyncOptions(body);
        this.setState({ addMore: false, error: false });
    }

    render() {
        return (
            <>
                <p>Optimise can connect to a central site to synchronise the content of your database.</p><br />
                <label htmlFor='host'>Remote Host:</label><br /> <input name='host' type='text' ref={this.syncAddress} /><br /><br />
                <label htmlFor='key'>Validation Key:</label><br /> <input name='key' type='text' ref={this.syncKey} /><br /><br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmitClick} >Save Connection Information</button><br /><br />
                <button onClick={this._handleSubmitClick} >Synchronize now</button>
            </>
        );

    }
}