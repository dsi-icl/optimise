import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import style from './admin.module.css';
import { BackButton } from '../medicalData/utils';
import { changePasswordAPICall, deleteUserAPICall, changePrivAPICall, changeEmailAPICall } from '../../redux/actions/admin';
import { addAlert } from '../../redux/actions/alert';
import store from '../../redux/store';

// eslint-disable-next-line no-useless-escape
const email_reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* receives prop this.props.match.params.userId and store.getAllUsers*/
@connect(state => ({
    data: state.getAllUsers
    }))
export class UserDetail extends Component {
    render() {
        const { data } = this.props;
        const { userId } = this.props.match.params;
        if (!data.fetching) {
            const usersFiltered = data.result.filter(el => el.id === parseInt(userId, 10));
            return (
                <>
                    <div className={style.ariane}>
                        <h2>USER INFORMATION</h2>
                        <BackButton to={'/administration/users'} />
                    </div>
                    <div className={style.userDetailPanel}>
                        <div className={style.userDetail}>
                            {usersFiltered.length === 1 ?
                                <>
                                    <UserInfo data={usersFiltered[0]} /><br />
                                    <ChangeUserEmail username={usersFiltered[0].username} /> <br /><br />
                                    <ChangeUserPassword username={usersFiltered[0].username} /> <br /><br />
                                    <ChangeUserPrivilege userId={usersFiltered[0].id} priv={usersFiltered[0].priv} /> <br /><br />
                                    <DeleteUser username={usersFiltered[0].username} /> <br />
                                </>
                                :
                                <div>
                                    <i>We could not find the user you are looking for!</i>
                                </div>
                            }
                        </div>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}

class UserInfo extends PureComponent {
    render() {
        const { data } = this.props;
        return (
            <div>
                <label>ID: </label> {data.id}  <br />
                <label>Username: </label> {data.username} <br />
                <label>Real name: </label> {data.realname} <br />
                <label>Email: </label> {data.email} <br />
                <label>This user is {data.priv ? 'an admin' : 'a standard user'}. </label> <br />
            </div>
        );
    }
}

/* receive props this.props.username*/
class ChangeUserEmail extends Component {
    constructor() {
        super();
        this.state = { addMore: false, error: false };
        this.emailRef = React.createRef();
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore }));
    }

    _handleSubmit() {
        if (this.emailRef.current.value === '' || !email_reg.test(this.emailRef.current.value)) {
            this.setState({ error: true });
            return;
        }
        const body = {
            username: this.props.username,
            email: this.emailRef.current.value
        };
        store.dispatch(changeEmailAPICall(body));
        this.setState({ addMore: false, error: false });
    }

    render() {
        return (
            <>
                {!this.state.addMore ?
                    <button onClick={this._handleClickingAdd}>Change user email</button>
                    :
                    <div className={style.userFeature}>
                        <label htmlFor='email'>Email:</label><br /><input name='email' type='text' ref={this.emailRef} /><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /><br /></> : null}
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button>
                    </div>
                }
            </>
        );
    }
}

/* receive props this.props.username*/
class ChangeUserPassword extends Component {
    constructor() {
        super();
        this.state = { addMore: false, error: false };
        this.conPwRef = React.createRef();
        this.pwRef = React.createRef();
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore }));
    }

    _handleSubmit() {
        if (this.conPwRef.current.value === '' || this.pwRef.current.value === '' || this.pwRef.current.value !== this.conPwRef.current.value) {
            this.setState({ error: true });
            return;
        }
        const body = {
            username: this.props.username,
            pw: this.pwRef.current.value
        };
        store.dispatch(changePasswordAPICall(body));
        this.setState({ addMore: false, error: false });
    }

    render() {
        return (
            <>
                {!this.state.addMore ?
                    <button onClick={this._handleClickingAdd}>Change user password</button>
                    :
                    <div className={style.userFeature}>
                        <label htmlFor='password'>Password:</label><br /><input name='password' type='password' ref={this.pwRef} /><br /><br />
                        <label htmlFor='passwordConf'>Confirm Password:</label><br /><input name='passwordConf' type='password' ref={this.conPwRef} /><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /><br /></> : null}
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button>
                    </div>
                }
            </>
        );
    }
}

class ChangeUserPrivilege extends Component {
    _handleClick = () => {
        const body = {
            id: this.props.userId,
            adminPriv: this.props.priv === 1 ? 0 : 1
        };
        store.dispatch(changePrivAPICall(body));
    };
    render() {
        return (
            <>
                {this.props.priv === 1 ?
                    <button onClick={this._handleClick}>Withdraw admin privileges from this user</button>
                    :
                    <button onClick={this._handleClick}>Give this user admin privileges</button>
                }
            </>
        );
    }
}


class DeleteUser extends Component {
    constructor() {
        super();
        this.state = { clicked: false };
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    _handleClick() {
        store.dispatch(addAlert({ alert: `Are you sure you want to delete user ${this.props.username}?`, handler: this._deleteFunction }));
    }

    _deleteFunction() {
        this.setState({ clicked: true });
        store.dispatch(deleteUserAPICall({ username: this.props.username }));
    }

    render() {
        if (this.state.clicked) {
            return <Redirect to='/administration/users' />;
        } else {
            return (
                <div>
                    <button onClick={this._handleClick}>Delete this user</button>
                </div>
            );
        }
    }
}