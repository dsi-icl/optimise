import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssLogin from '../../../css/loginpage.css';
import cssButton from '../../../css/buttons.css';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import cssIcons from '../../../css/icons.css';
import { loginAPICall } from '../../redux/actions/login.js';
import { UserIcon, KeyIcon } from '../../../statics/svg/icons.jsx';

function mapStateToProps(state) {
    return {
        loggingIn: state.login.loggingIn,
        loginFailed: state.login.loginFailed
    }
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
    componentDidMount(){
        const shake = () => { this.setState({ left: -5 }); setTimeout(() => { this.setState({ left: 5 }) }, 50) };
        const interval = setInterval(shake, 100);
        setTimeout(() => { clearInterval(interval) }, 300);
    }
    render() {
        return <span style={this.state}>Login failed. Please try again</span>;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class LoginPage extends Component {
    constructor(){
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
        console.log(ev.target.value);
        this.setState({ pw: ev.target.value });
    }

    _handleSubmit(ev){
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
        const inputStyle= {
            background: 'transparent',
            fontSize: 14,
            color: 'white',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 0,
            margin: '10px',
            textAlign: 'center',
            paddingLeft: 30,
            paddingRight: 28,
            position: 'relative',
            right: 9
        };
        const iconStyle={
            fill: 'rgba(255,255,255,0.3)',
            position: 'relative',
            left: 21
        };
        console.log(`logging ${this.props.loggingIn}`);
        return (<div className={cssLogin.loginPage}>
            <div className={cssLogin.upperCircle}> </div>
            <div className={cssLogin.logoText}> Optimise MS </div>
            <div className={cssLogin.lowerCircle}> </div>
            <form onKeyPress={this._handleEnterKey}>
                <UserIcon style={iconStyle} width='15px'/>
                <input onChange={this._handleUsernameInput} value={this.state.username} style={inputStyle} type='text'/> <br/>
                <KeyIcon style={iconStyle} width='17px'/>
                <input onChange={this._handlePwInput} type='password' value={this.state.pw} style={inputStyle} className={cssLogin.input}/>
                {this.props.loggingIn ? 
                    <div style={{ marginTop: 20 }} className={cssIcons.spinner}><LoadingIcon/></div>
                    :
                    <div><div onClick={this._handleSubmit} style={{ margin: '30px auto', float: 'none' }} className={[cssButton.patientBanner, cssLogin.loginButton].join(' ')}>
                        Sign in
                    </div><div>{this.props.loginFailed ? <LoginFailed/> : null}</div></div>
                }
            </form>
        </div>);
    }
}

//autocomplete