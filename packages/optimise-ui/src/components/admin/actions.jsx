import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Helmet from '../scaffold/helmet';
import style from './admin.module.css';
import { AdminRouter } from './router';

export class AdminActions extends Component {
    render() {
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='Administration Panel' />
                    <h2>Administration Panel</h2>
                </div>
                <div className={style.panel}>
                    <div className={style.actionsMenu}>
                        <NavLink to='/administration/users' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>Manage users</button>
                        </NavLink>
                        <br /> <br />
                        <NavLink to='/administration/meddra' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>Manage MedDRA</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/patientMappings' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>Patient ID Mappings</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/sync' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>Synchronisation</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/update' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>Updates</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/log' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>View access log</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/system' className={({ isActive }) => isActive ? style.activeNavLink : undefined}>
                            <button>System information</button>
                        </NavLink>
                    </div>
                    <div className={style.actionsDisplay}>
                        <AdminRouter />
                    </div>
                </div>
            </>
        );
    }
}