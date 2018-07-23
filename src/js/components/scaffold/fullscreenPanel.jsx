import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FullTimeline from '../patientProfile/fullTimeline';
import style from './scaffold.module.css';
import './timeline.css';

export default class FullscreenPanel extends Component {
    render() {
        console.log('PLOP');
        return (
            // <Switch>
            //     <Route path='/patientProfile/:patientId/timeline' render={({ match }) =>
            <div className={style.fullscreenPanel}>
                <FullTimeline match={{ params: { patientId: 42 } }} />
            </div>
            //     } />
            //     <Route path='/' component={() => null} />
            // </Switch>
        );
    }
}
