import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import store from '../../redux/store';
import { BackButton } from '../medicalData/utils';
import { createUserAPICall } from '../../redux/actions/admin';
import style from './admin.module.css';

// eslint-disable-next-line no-useless-escape
const email_reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class UserCreate extends Component {
    constructor() {
        super();
        this.state = { error: false, dispatched: false };
        this.usernameRef = React.createRef();
        this.realnameRef = React.createRef();
        this.isAdminRef = React.createRef();
        this.emailRef = React.createRef();
        this.pwRef = React.createRef();
        this.pwConRef = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit() {
        for (let each of [this.usernameRef, this.realnameRef, this.pwRef, this.pwConRef, this.emailRef]) {
            if (each.current.value === '') {
                this.setState({ error: true });
                return;
            }
        }
        if (this.pwRef.current.value !== this.pwConRef.current.value) {
            this.setState({ error: true });
            return;
        }
        if (!email_reg.test(this.emailRef.current.value)) {
            this.setState({ error: true });
            return;
        }
        const body = {
            username: this.usernameRef.current.value,
            pw: this.pwRef.current.value,
            email: this.emailRef.current.value,
            realname: this.realnameRef.current.value,
            isAdmin: this.isAdminRef.current.checked ? 1 : 0
        };
        store.dispatch(createUserAPICall(body));
        this.setState({ error: false, dispatched: true });
    }

    render() {
        if (!this.state.dispatched) {
            return (
                <>
                    <div className={style.ariane}>
                        <h2>+ NEW USER</h2>
                        <BackButton to={'/administration/users'} />
                    </div>
                    <div className={style.userDetailPanel}>
                        <div className={style.userDetail}>
                            <label htmlFor='username'>Username:</label><br /><input name='username' type='text' ref={this.usernameRef} /><br /><br />
                            <label htmlFor='realname'>Real name:</label><br /><input name='realname' type='text' ref={this.realnameRef} /><br /><br />
                            <label htmlFor='email'>Email:</label><br /><input name='email' type='text' ref={this.emailRef} /><br /><br />
                            <label htmlFor='password'>Password:</label><br /><input name='password' type='password' ref={this.pwRef} /><br /><br />
                            <label htmlFor='passwordConf'>Confirm Password:</label><br /><input name='passwordConf' type='password' ref={this.pwConRef} /><br /><br />
                            <label htmlFor='isadmin'>Is Admin:</label><input name='isadmin' type='checkbox' ref={this.isAdminRef} /><br /><br />
                            {this.state.error ? <><div className={style.error}>None of the fields can be empty!</div><br /><br /></> : null}
                            <button onClick={this._handleSubmit}>Create</button><br /><br />
                        </div>
                    </div>
                </>
            );
        } else {
            return <Redirect to={'/administration/users'} />;
        }
    }
}