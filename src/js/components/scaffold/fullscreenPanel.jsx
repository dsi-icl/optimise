import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FullTimeline from '../patientProfile/fullTimeline';
import EDSSCalculator from '../EDSScalculator/calculator';
import style from './scaffold.module.css';
import './timeline.css';

export default class FullscreenPanel extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route path='/patientProfile/:patientId/timeline' render={({ match }) =>
                        <div className={style.fullscreenPanel}>
                            <FullTimeline match={match} />
                        </div>
                    } />
                    <Route path='/patientProfile/:patientId/edit/msPerfMeas/:visitId/edss' render={({ match, location }) =>
                        <EDSSCalculator match={match} location={location} />
                    } />
                    <Route path='/' component={() => null} />
                </Switch>
            </>
        );
    }
}
