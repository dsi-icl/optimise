import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditConcomitantMed from '../../../editMedicalElements/createConmitantMeds';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import scaffold_style from '../scaffoldStyle.module.css';

export class ConcomitantMedWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>}/>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) =>
                <div className={scaffold_style.padding_div}>
                    <p>All the concomitant medications or supplements this patient has been on will be shown here.</p>
                    <EditConcomitantMed match={match} location={location} renderedInFrontPage={true} override_style={override_style}/>
                </div>
            }/>
        </Switch>;
    }
}