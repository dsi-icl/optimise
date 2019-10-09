import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getSyncOptionsAPICall, setSyncOptionsAPICall, syncNowAPICall } from '../../redux/actions/syncInfo';
import style from './admin.module.css';

@connect(state => ({
    syncInfo: state.syncInfo
}), dispatch => ({
    getSyncOptions: () => dispatch(getSyncOptionsAPICall()),
    setSyncOptions: body => dispatch(setSyncOptionsAPICall(body)),
    syncNow: adminPass => dispatch(syncNowAPICall(adminPass))
}))
export class Sync extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            id: props.syncInfo.config.id,
            host: props.syncInfo.config.host,
            key: props.syncInfo.config.key
        };
        this.syncAddress = React.createRef();
        this.syncKey = React.createRef();
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleSync = this._handleSync.bind(this);
    }

    componentDidMount() {
        this.props.getSyncOptions();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.syncInfo.config.id === prevState.id)
            return prevState;
        return {
            ...prevState,
            id: nextProps.syncInfo.config.id,
            host: nextProps.syncInfo.config.host,
            key: nextProps.syncInfo.config.key
        };
    }

    _handleSubmit() {
        try {
            if (this.syncAddress.current.value !== '')
                new URL(this.syncAddress.current.value);
        } catch (e) {
            this.setState({ error: 'Invalid Remote Host' });
            return;
        }
        if (this.syncAddress.current.value === '' && this.syncKey.current.value !== '') {
            this.setState({ error: 'Missing Remote Host information' });
            return;
        }
        if (this.syncAddress.current.value !== '' && this.syncKey.current.value === '') {
            this.setState({ error: 'Missing a Validation Key' });
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
        this.props.syncNow(true);
    }

    _handleInputChange(event) {
        this.setState({ [`${event.target.attributes.name}`]: event.target.value });
    }

    render() {
        const { id, host, key } = this.state;

        if (id === undefined)
            return null;

        return (
            <>
                <p>Optimise can connect to a central site to synchronise the content of your database.</p><br />
                <label htmlFor='id'>Agent ID:</label><br /> <input name='id' type='text' readOnly value={id} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck='false' /><br /><br />
                <label htmlFor='host'>Remote Host:</label><br /> <input name='host' type='text' ref={this.syncAddress} defaultValue={host} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck='false' /><br /><br />
                <label htmlFor='key'>Validation Key:</label><br /> <input name='key' type='text' ref={this.syncKey} defaultValue={key} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck='false' /><br /><br />
                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                <button onClick={this._handleSubmit} >Save Connection Information</button><br /><br />
                <button onClick={this._handleSync} >Synchronize now</button>
            </>
        );

    }
}