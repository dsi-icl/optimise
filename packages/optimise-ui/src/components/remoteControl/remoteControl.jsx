import React, { Component } from 'react';
import style from './remoteControl.module.css';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { changePrivAPICall } from '../../redux/actions/admin';

export class RemoteControl extends Component {
    constructor() {
        super();
        this.state = { startedWS: false };
        this._clickStartWS = this._clickStartWS.bind(this);
    }

    _clickStartWS() {
        this.setState({ startedWS: true });
    }

    _clickCloseWS() {

    }

    render() {
        if (!this.state.startedWS) {
            return (
                <div className={style.initial_question}>
                    If you allow remote control, the software team at DSI-ICL can request actions OptimiseMS on your computer. <br/><br/>
                    Do you want to proceed?<br/><br/>
                    <button onClick={this._clickStartWS}>Yes</button>
                    <br/><br/>
                    <NavLink to='/'>
                        <button>No</button>
                    </NavLink>
                </div>
            );
        } else {
            return (
                <div className={style.initial_question}>
                    <WSActions/>
                </div>
            );
        }
    }
}

@connect(state => ({
    username: state.login.username,
    userId: state.login.id,
    wsEndpoint: state.login.remote_control
}))
class WSActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //socket: undefined,
            messages: []
        };
    }

    componentDidMount() {
        const that = this;
        const socket = new WebSocket(that.props.wsEndpoint);
        socket.onopen = function() {
            that.setState(prev => ({
                socket,
                messages: [...prev.messages, `${new Date().toISOString()}: Socket opened!`]
            }));
            socket.send(that.props.userId);
        };
        socket.onmessage = function(event) {
            const message = event.data;
            const newMessages = [`${new Date().toISOString()}: Server request - ${message}`];
            const [action, actionData] = message.split('|');

            switch (action) {
                case 'ADD_PRIVILEGE':
                    store.dispatch(changePrivAPICall({
                        id: parseInt(actionData),
                        adminPriv: 1
                    }));
                    break;
                default:
                    newMessages.push(`${new Date().toISOString()}: Cannot fulfill this action request.`);
            }

            that.setState(prev => ({
                messages: [...prev.messages, ...newMessages]
            }));
        };

        socket.onclose = function() {
            that.setState(prev => ({
                messages: [...prev.messages, `${new Date().toISOString()}: Connection closed.`]
            }));
        };

        socket.onerror = function() {
            that.setState((prev) => ({
                messages: [...prev.messages, `${new Date().toISOString()}: Cannot open socket.`]
            }));
        };
    }

    render() {
        return (
            <div>
                {this.state.messages.map(
                    el => <div key={el}>{el}</div>
                )}
            </div>
        );
    }
}
