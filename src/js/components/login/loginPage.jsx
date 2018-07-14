import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssLogin from '../../../css/loginpage.module.css';
import cssButton from '../../../css/buttons.module.css';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import cssIcons from '../../../css/icons.module.css';
import { loginAPICall } from '../../redux/actions/login.js';
import { UserIcon, KeyIcon } from '../../../statics/svg/icons.jsx';

function mapStateToProps(state) {
    return {
        loggingIn: state.login.loggingIn,
        loginFailed: state.login.loginFailed
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestLogin: body => dispatch(loginAPICall(body))
    };
}

class LoginFailed extends Component {
    constructor() {
        super();
        this.state = { left: 0, position: 'relative' };
    }
    componentDidMount() {
        const shake = () => { this.setState({ left: -5 }); setTimeout(() => this.setState({ left: 5 }), 50); };
        const interval = setInterval(shake, 100);
        setTimeout(() => clearInterval(interval), 300);
    }
    render() {
        return <span >Login failed. Please try again</span>;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class LoginPage extends Component {
    constructor() {
        super();
        this.state = { username: '', pw: '' };
        this._handlePwInput = this._handlePwInput.bind(this);
        this._handleUsernameInput = this._handleUsernameInput.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleUsernameInput(ev) {
        this.setState({ username: ev.target.value });
    }

    _handlePwInput(ev) {
        this.setState({ pw: ev.target.value });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        this.props.requestLogin(this.state);
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.props.requestLogin(this.state);
        }
    }

    render() {
        return (<div className={cssLogin.loginPage}>
            <div className={cssLogin.upperCircle}> </div>
            <div className={cssLogin.logoText}> Optimise MS </div>
            <div className={cssLogin.lowerCircle}> </div>
            <form onKeyPress={this._handleEnterKey}>
                <UserIcon width='15px' />
                <input onChange={this._handleUsernameInput} value={this.state.username} type='text' autoComplete="username" /> <br />
                <KeyIcon width='17px' />
                <input onChange={this._handlePwInput} type='password' value={this.state.pw} className={cssLogin.input} autoComplete="current-password" />
                {this.props.loggingIn ?
                    <div className={cssIcons.spinner}><LoadingIcon /></div>
                    :
                    <div><div onClick={this._handleSubmit} className={[cssButton.patientBanner, cssLogin.loginButton].join(' ')}>
                        Sign in
                    </div><div>{this.props.loginFailed ? <LoginFailed /> : null}</div></div>
                }
            </form>
        </div>);
    }
}

//autocomplete