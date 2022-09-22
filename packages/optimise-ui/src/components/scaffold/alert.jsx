import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { clearAlert } from '../../redux/actions/alert';
import { addError } from '../../redux/actions/error';
import style from './scaffold.module.css';


/*  get a click eventhandler state.alert.handler passed down from whatever needs confirmation */
@connect(state => ({
    alert: state.alert
}))
export default class AlertMessage extends Component {

    _handleCancel = () => {
        store.dispatch(clearAlert());
    };

    _handleConfirm = () => {
        if (typeof this.props.alert.handler === 'function') {
            this.props.alert.handler();
            store.dispatch(clearAlert());
        } else {
            store.dispatch(addError({ error: 'This button is doing nothing! please contact your admin' }));
        }
    };

    render() {
        const { alert } = this.props;
        if (alert.alert) {
            return (
                <div className={style.errorMessage}>
                    <div className={style.alertMessageDialogBox}>
                        <span><b>CAREFUL!</b></span> <span onClick={this._handleCancel} className={style.cancelButton}>&#10006;</span>
                        <br /><br />{alert.alert}
                        <br /><br />
                        <button onClick={this._handleConfirm}> YES, I AM SURE! </button>
                    </div>
                </div>
            );
        } else {
            return null;
        }

    }
}