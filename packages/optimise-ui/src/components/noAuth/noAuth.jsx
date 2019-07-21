import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import UserManual from '../userManual';
import style from './noAuth.module.css';

export default class FullscreenPanel extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route path='/userManual' render={({ match }) =>
                        <div className={style.userManual}>
                            <div className={style.wrapper}>
                                <UserManual />
                            </div>
                        </div>
                    } />
                    <Route path='/' component={() => null} />
                </Switch>
            </>
        );
    }
}
