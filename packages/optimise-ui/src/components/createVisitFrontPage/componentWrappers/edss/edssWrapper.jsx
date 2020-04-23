import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EDSSPage from '../../../EDSScalculator/calculator';
import { Route, Switch } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import style from '../../frontpage.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

export class EDSSWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Switch>
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no'
                render={({ match, location }) =>
                    <>
                        <YesOrNo match={match} location={location} questionString={yesOrNoQuestion}/>
                        <FrontPageNavigationButton match={match} location={location}/>
                    </>
                }
            />
            <Route
                path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage'
                render={({ match, location }) =>
                    <>
                        <div className={style.page}>
                            <div className={scaffold_style.padding_div}>
                                <EDSSPage childRef={component => { this.form = component; }} match={match} location={location} renderedInFrontPage={true} override_style={override_style}/>
                            </div>
                        </div>
                        <FrontPageNavigationButton onClickNext={(ev) => { this.form._handleSubmit(ev); this.forceUpdate() }} formSaved={() => this.form.state.saved} match={match} location={location}/>
                    </>
                }
            />
        </Switch>;
    }
}