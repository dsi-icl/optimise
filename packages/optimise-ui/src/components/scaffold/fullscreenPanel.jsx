import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import FullTimeline from '../patientProfile/fullTimeline';
import EDSSCalculator from '../EDSScalculator/calculator';
import style from './scaffold.module.css';
import { FrontPage } from '../createVisitFrontPage/frontPageWrapper';

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
                        <div className={style.fullscreenPanel}>
                            <EDSSCalculator match={match} location={location} />
                        </div>
                    } />
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) =>
                        <div className={style.fullscreenPanel}>
                            <FrontPage match={match} location={location}/>
                        </div>
                    } />
                    <Route path='/' component={() => null} />
                </Switch>
            </>
        );
    }
}
