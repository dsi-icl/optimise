import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import style from './admin.module.css';

/* receives prop this.props.match.params.userId and store.getAllUsers*/
@connect(state => ({ data: state.getAllUsers }))
export class UserDetail extends Component {
    render() {
        const { data } = this.props;
        const { userId } = this.props.match.params;
        if (!data.fetching) {
            const usersFiltered = data.result.filter(el => el.id === parseInt(userId, 10));
            if (usersFiltered.length === 0) {
                return <>Cannot find your user</>;
            } else {
                return (
                    <>
                        <div className={style.ariane}>
                            <h2>USER INFORMATION</h2>
                        </div>
                        <div className={style.userDetailPanel}>
                            <div className={style.userDetail}>
                                <UserInfo data={usersFiltered[0]}/>
                                <ChangeUserPassword/> <br/>
                                <ChangeUserPrivilege/>
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
                <label>Username: </label> {data.username} <br/>
                <label>ID: </label> {data.id}  <br/>
                <label>This user is {data.isAdmin ? 'an admin' : 'a standard user'}. </label> <br/>
            </div>
        )
    }
}

class ChangeUserPassword extends Component {
    render() {
        return (
            <div>
                <button>Change user password </button>
            </div>
        );
    }
}

class ChangeUserPrivilege extends Component {
    render() {
        return (
            <div>
                <button>Change user privilege </button>
            </div>
        );
    }
}