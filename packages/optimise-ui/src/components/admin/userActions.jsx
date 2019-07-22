import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import style from './admin.module.css';

export class UserActions extends Component {

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <h2>USER ACTIONS</h2>
                </div>
                <div className={style.userDetailPanel}>
                    <div className={style.userDetail}>
                        <NavLink to='/administration/users/create'>
                            <button>Create a new user</button>
                        </NavLink>
                    </div>
                </div>
            </>
        );
    }
}