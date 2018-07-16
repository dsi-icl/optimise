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
                    <h1>OOPS!</h1> <span className={style.cancelButton}>&#10006;</span>
                    <span>Seems like you have encountered an error!</span> <br/><br/>
                    
                    Message: {error.error}
                </div>
            );
        } else {
            return null;
        }

    }
}
