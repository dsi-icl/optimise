import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EDSSPage from '../../../EDSScalculator/calculator';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import scaffold_style from '../scaffoldStyle.module.css';

export class EDSSWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' render={({ match, location }) => <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>}/>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <div className={scaffold_style.padding_div}><EDSSPage match={match} location={location} override_style={override_style}/></div>}/>
        </Switch>;
    }
}