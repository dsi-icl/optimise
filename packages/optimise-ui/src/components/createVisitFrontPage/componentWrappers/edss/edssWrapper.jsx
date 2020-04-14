import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EDSSPage from '../../../EDSScalculator/calculator';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';

export class EDSSWrapper extends Component {
    render() {
        return <Switch>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={'Any EDSS?'}/>}/>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <EDSSPage match={match} location={location} override_style={override_style}/>}/>
        </Switch>;
    }
}