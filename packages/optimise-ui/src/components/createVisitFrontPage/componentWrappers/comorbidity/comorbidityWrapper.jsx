import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditComorbidity from '../../../editMedicalElements/editComorbidity';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';

export class ComorbidityWrapper extends Component {
    render() {
        return <Switch>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={'Any comorbidity?'}/>}/>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <EditComorbidity match={match} location={location} override_style={override_style}/>}/>
        </Switch>;
    }
}