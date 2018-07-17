import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { clearError } from '../../redux/actions/error';
import style from './scaffold.module.css';

@connect(state => ({ error: state.appLevelError }))
export default class ErrorMessage extends PureComponent {
    _handleCancel = () => {
        store.dispatch(clearError());
    }

    render() {
        const { error } = this.props;
        if (error.error) {
            return (
                <div className={style.errorMessage}>
                    <div className={style.errorMessageDialogBox}>
                        <h4>OOPS!</h4> <span onClick={this._handleCancel} className={style.cancelButton}>&#10006;</span>
                        Seems like you have encountered an error! <br/><br/>
                        Message: {error.error}
                    </div>
                </div>
            );
        } else {
            return null;
        }

    }
}
