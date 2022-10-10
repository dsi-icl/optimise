import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditComorbidity from '../../../editMedicalElements/editComorbidity';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

export class ComorbidityWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no'
                render={({ match, location }) => <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>}
            />
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) =>
                <>
                    <div className={scaffold_style.padding_div}>
                        <p>Please record all comorbidities for this visit:</p>
                        <EditComorbidity match={match} location={location} override_style={override_style}/>
                    </div>
                    <FrontPageNavigationButton match={match} location={location}/>
                </>
            }/>
        </Switch>;
    }
}