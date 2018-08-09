import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import style from './admin.module.css';
import { changePasswordAPICall, deleteUserAPICall, changePrivAPICall } from '../../redux/actions/admin';
import { addAlert } from '../../redux/actions/alert';
import store from '../../redux/store';

/* receives prop this.props.match.params.userId and store.getAllUsers*/
@connect(state => ({ data: state.getAllUsers }))
export class UserDetail extends Component {
    render() {
        const { data } = this.props;
        const { userId } = this.props.match.params;
        if (!data.fetching) {
            const usersFiltered = data.result.filter(el => el.id === parseInt(userId, 10));
            if (usersFiltered.length !== 1) {
                return <>We cannot find this user!</>;
            } else {
                return (
                    <>
                        <div className={style.ariane}>
                            <h2>USER INFORMATION</h2>
                        </div>
                        <div className={style.userDetailPanel}>
                            <div className={style.userDetail}>
                                <UserInfo data={usersFiltered[0]} />
                                <ChangeUserPassword username={usersFiltered[0].username} /> <br /><br />
                                <ChangeUserPrivilege userId={usersFiltered[0].id} priv={usersFiltered[0].priv}/> <br /><br />
                                <DeleteUser username={usersFiltered[0].username} />
                            </div>
                        </div>
                    </>
                );
            }
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
                <label>Username: </label> {data.username} <br />
                <label>ID: </label> {data.id}  <br />
                <label>Real name: </label> {data.realname} <br />
                <label>This user is {data.priv ? 'an admin' : 'a standard user'}. </label> <br />
            </div>
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
        this.setState({ addMore: !this.state.addMore });
    }

    _handleSubmit() {
        if (this.conPwRef.current.value === '' || this.pwRef.current.value === '' || this.pwRef.current.value !== this.conPwRef.current.value) {
            this.setState({ error: true });
            return;
        }
        const body = {
            username: this.props.username,
            pw: this.pwRef.current.value,
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
                    <>
                        <table>
                            <thead>
                                <tr><th>Password</th><th>Confirm your password</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type='password' ref={this.pwRef} />
                                    </td>
                                    <td>
                                        <input type='password' ref={this.conPwRef} />
                                    </td>
                                </tr>
                            </tbody>
                        </table><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /><br /></> : null}
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button>
                    </>
                }
            </>
        );
    }
}


class ChangeUserPrivilege extends Component {
    _handleClick = () =>  {
        const body = {
            id: this.props.userId,
            adminPriv: this.props.priv === 1 ? 0 : 1
        };
        store.dispatch(changePrivAPICall(body));
    }
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