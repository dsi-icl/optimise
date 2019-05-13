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
                        <NavLink to='/administration/users' activeClassName={style.activeNavLink}>
                            <button>Manage users</button>
                        </NavLink>
                        <br /> <br />
                        <NavLink to='/administration/meddra' activeClassName={style.activeNavLink}>
                            <button>Manage MedDRA</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/patientMappings' activeClassName={style.activeNavLink}>
                            <button>Patient ID Mappings</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/log' activeClassName={style.activeNavLink}>
                            <button>View access log</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/system' activeClassName={style.activeNavLink}>
                            <button>System information</button>
                        </NavLink>
                        <br /><br />
                        <NavLink to='/administration/update' activeClassName={style.activeNavLink}>
                            <button>Updates</button>
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