import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store.js';
import { createUserAPICall, getAllUsersAPICall } from '../../redux/actions/admin.js';
import { LoadingIcon } from '../../../statics/svg/icons';
import cssIcons from '../../../css/icons.module.css';
import cssButtons from '../../../css/buttons.module.css';

export class Users extends Component {
    render() {
        return (
            <div>
                <UserList />
                <CreateUser />
            </div>
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
            return <div className={cssIcons.spinner}><LoadingIcon /></div>;
        } else {
            if (error) {
                return <div> Cannot fetch.. </div>;
            } else {
                const users = result.slice(Math.max(0, result.length - 100));
                return <div>{users.map(el => <LogEntry key={el.id} entry={el} />)}</div>;
            }
        }
    }
}

/**
 * @prop {Object} this.props.entry
 */
export class LogEntry extends Component {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <div >
                <b>Id: </b> {el.id} <br />
                <b>Username: </b> {el.username}<br />
                <b>Real name: </b>{el.realname} <br />
            </div>
        );
    }
}

@connect(state => ({ data: state.patientProfile.data }))
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
            realName: this.realnameRef.current.value,
            isAdmin: this.isAdminRef.current.checked ? 1 : 0
        };
        store.dispatch(createUserAPICall(body));
        this.setState({ addMore: false, error: false });
    }

    render() {
        return (<div>
            {!this.state.addMore ?
                <div className={cssButtons.createPatientButton} onClick={this._handleClickingAdd}>Create new user</div>
                :
                <div>
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
                    </table>
                    <div>
                        <div className={cssButtons.createPatientButton} onClick={this._handleSubmit}>Submit</div>
                        <div onClick={this._handleClickingAdd} className={cssButtons.createPatientButton}>Cancel</div>
                    </div>
                    {this.state.error ? <div> None of the fields can be empty! </div> : null}
                </div>
            }
        </div>
        );
    }
}