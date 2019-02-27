import React, { Component } from 'react';
import { default as T } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { loginAPICall } from '../../redux/actions/login';
import LoadBar from '../loadBar';
import store from '../../redux/store';
import { clearError } from '../../redux/actions/error';
import Helmet from '../scaffold/helmet';
import style from './login.module.css';

function mapStateToProps(state) {
    return {
        isProcessing: state.login.loggingIn,
        hasAttempted: true,
        error: state.login.loginFailed ? 'Login failed. Please try again' : undefined
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestLogin: body => dispatch(loginAPICall(body))
    };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Login extends Component {

    // Custom name for container
    static displayName = 'Login';

    // Types for available context
    static contextTypes = {
        dispatch: T.func
    };

    componentWillUnmount() {
        store.dispatch(clearError());
    }

    login = (e) => {
        e.preventDefault();
        this.props.requestLogin({
            username: this.refs.username.value,
            pw: this.refs.password.value
        });
    }

    render() {

        const { location, isAuthenticated, isProcessing, hasAttempted, error } = this.props;
        const { from } = location.state || { from: { pathname: '/' } };

        if (from.pathname === '/logout')
            from.pathname = '/';

        if (isAuthenticated === true) {
            return (
                <Redirect to={from} />
            );
        }

        return (
            <div className={style.page}>
                <Helmet title='Login' />
                <div className={style.box}>
                    <div className={style.title}>
                        <span>optimise<strong>:</strong>ms</span>
                    </div>
                    <form className={style.form} onSubmit={this.login.bind(this)}>
                        <input type='text' placeholder='Username' ref='username' autoComplete='username' /><br />
                        <input type='password' placeholder='Password' ref='password' autoComplete='current-password' /><br />
                        {isProcessing ? (<LoadBar />) : (<button type='submit'>Login</button>)}<br />
                        {hasAttempted && error !== undefined ? <div className={style.error}>{error}</div> : null}
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;

