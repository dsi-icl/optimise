import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import store from '../../redux/store';
import { getAllUsersAPICall } from '../../redux/actions/admin';
import Icon from '../icon';
import style from './admin.module.css';

@connect(state => ({
    getAllUsers: state.getAllUsers
    }))
class UserList extends Component {
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
                return (
                    <>
                        {
                            users.map(el => <UserEntry key={el.id} entry={el} />)
                        }
                    </>
                );
            }
        }
    }
}

export {UserList};

/**
 * @prop {Object} this.props.entry
 */
export class UserEntry extends PureComponent {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <NavLink to={`/administration/users/${el.id}`}>
                <div className={style.clickable}>
                    <b>Username: </b> {el.username}<br />
                    <b>Real name: </b>{el.realname} <br />
                    <b>Email: </b>{el.email} <br />
                </div>
            </NavLink>
        );
    }
}

