import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class AdminActions extends Component {
    render() {
        return (
            <div >
                <h2> ADMIN MENU </h2>
                <NavLink to='/administration/users'>
                    <button>Manage users</button>
                </NavLink>
                <NavLink to='/administration/log'>
                    <button>View access log</button>
                </NavLink>
            </div>
        );
    }
}