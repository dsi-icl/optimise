import React, { Component } from 'react';
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

    constructor(props) {
        super(props);
        this.usernameFieldRef = React.createRef();
        this.passwordFieldRef = React.createRef();
    }

    componentWillUnmount() {
        store.dispatch(clearError());
    }

    login = (e) => {
        e.preventDefault();
        this.props.requestLogin({
            username: this.usernameFieldRef.current.value,
            pw: this.passwordFieldRef.current.value
        });
    };

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
                        <input type='text' placeholder='Username' ref={this.usernameFieldRef} autoComplete='username' /><br />
                        <input type='password' placeholder='Password' ref={this.passwordFieldRef} autoComplete='current-password' /><br />
                        {isProcessing ? (<LoadBar />) : (<button type='submit'>Login</button>)}<br />
                        {hasAttempted && error !== undefined ? <div className={style.error}>{error}</div> : null}
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;

