import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import style from './scaffold.module.css';

@connect(state => ({ error: state.appLevelError }))
export default class ErrorMessage extends PureComponent {
    render() {
        const { error } = this.props;
        if (error.error) {
            return (
                <div className={style.errorMessage}>
                    <div className={style.errorMessageDialogBox}>
                        <h4>OOPS!</h4> <span className={style.cancelButton}>&#10006;</span>
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
