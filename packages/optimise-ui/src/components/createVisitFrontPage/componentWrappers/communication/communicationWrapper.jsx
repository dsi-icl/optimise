import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import { Route, Switch } from 'react-router-dom';
import EditCommunication from '../../../editMedicalElements/editCommunication';
// import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';

export class CommunicationWrapper extends Component {
    render() {
        return <Switch>
            {/* <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={'Any communication?'}/>}/> */}
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <EditCommunication match={match} location={location} override_style={override_style}/>}/>
        </Switch>;
    }
}