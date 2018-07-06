import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssLogin from '../../../css/loginpage.css';
import cssButton from '../../../css/buttons.css';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import cssIcons from '../../../css/icons.css';
import { loginAPICall } from '../../redux/actions/login.js';

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
            fontSize: 16,
            color: 'white',
            borderBottom: '1.5px solid white',
            borderRadius: 0,
            margin: '10px auto'
        };
        console.log(`logging ${this.props.loggingIn}`);
        return (<div className={cssLogin.loginPage}>
            <div className={cssLogin.upperCircle}> </div>
            <div className={cssLogin.logoText}> Optimise MS </div>
            <div className={cssLogin.lowerCircle}> </div>
            <form onKeyPress={this._handleEnterKey}>
                <div className={cssLogin.inputField}>
                U: <input onChange={this._handleUsernameInput} value={this.state.username} style={inputStyle} type='text'/>
                </div>
                <div className={cssLogin.inputField}>
                P: <input onChange={this._handlePwInput} value={this.state.pw} style={inputStyle} className={cssLogin.input} type='text'/>
                </div>
                {this.props.loggingIn ? 
                    <div style={{ marginTop: 0 }} className={cssIcons.spinner}><LoadingIcon/></div>
                    :
                    <div><div onClick={this._handleSubmit} style={{ width: '10%', margin: '0 auto', float: 'none', borderRadius: 0 }} className={[cssButton.patientBanner, cssButton.userActionButton].join(' ')}>
                        Log me in!
                    </div><div><br/>{this.props.loginFailed ? <LoginFailed/> : null}</div></div>
                }
            </form>
        </div>);
    }
}