import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import store from '../../redux/store';
import { createUserAPICall, getAllUsersAPICall } from '../../redux/actions/admin';
import Icon from '../icon';
import style from './admin.module.css';


export class Users extends Component {
    render() {
        return (
            <>
                <UserList />
                <CreateUser />
            </>
        );
    }
}


@connect(state => ({ getAllUsers: state.getAllUsers }))
export class UserList extends Component {
    componentDidMount() {
        store.dispatch(getAllUsersAPICall());
    }

    render() {
        const { fetching, error, result } = this.props.getAllUsers;
        if (fetching) {
            return <div><Icon symbol='loading' /></div>;
        } else {
            if (error) {
                return <div> Cannot fetch.. </div>;
            } else {
                const users = result.slice(Math.max(0, result.length - 100));
                return <>{users.map(el => <UserEntry key={el.id} entry={el} />)}</>;
            }
        }
    }
}

/**
 * @prop {Object} this.props.entry
 */
export class UserEntry extends PureComponent {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <NavLink to={`/administration/users/${el.id}`}>
                <div className={style.clickable}>
                    <b>Id: </b> {el.id} <br />
                    <b>Username: </b> {el.username}<br />
                    <b>Real name: </b>{el.realname} <br />
                </div>
            </NavLink>
        );
    }
}


class CreateUser extends Component {
    constructor() {
        super();
        this.state = { addMore: false, error: false };
        this.usernameRef = React.createRef();
        this.realnameRef = React.createRef();
        this.isAdminRef = React.createRef();
        this.pwRef = React.createRef();
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleClickingAdd() {
        this.setState({ addMore: !this.state.addMore });
    }

    _handleSubmit() {
        for (let each of [this.usernameRef, this.realnameRef, this.pwRef]) {
            if (each.current.value === '') {
                this.setState({ error: true });
                return;
            }
        }
        const body = {
            username: this.usernameRef.current.value,
            pw: this.pwRef.current.value,
            realname: this.realnameRef.current.value,
            isAdmin: this.isAdminRef.current.checked ? 1 : 0
        };
        store.dispatch(createUserAPICall(body));
        this.setState({ addMore: false, error: false });
    }

    render() {
        return (
            <>
                {!this.state.addMore ?
                    <button onClick={this._handleClickingAdd}>Create new user</button>
                    :
                    <>
                        <table>
                            <thead>
                                <tr><th>Username</th><th>Real name</th><th>Password</th><th>Is admin?</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type='text' ref={this.usernameRef} />
                                    </td>
                                    <td>
                                        <input type='text' ref={this.realnameRef} />
                                    </td>
                                    <td>
                                        <input type='text' ref={this.pwRef} />
                                    </td>
                                    <td>
                                        <input type='checkbox' ref={this.isAdminRef} />
                                    </td>
                                </tr>
                            </tbody>
                        </table><br />
                        <br />
                        {this.state.error ? <><div className={style.error}>None of the fields can be empty!</div><br /><br /></> : null}
                        <button onClick={this._handleSubmit}>Submit</button><br /><br />
                        <button onClick={this._handleClickingAdd}>Cancel</button>
                    </>
                }
            </>
        );
    }
}