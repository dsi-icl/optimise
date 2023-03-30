import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EDSSPage from '../../../EDSScalculator/calculator';
import { Route, Routes, useLocation } from 'react-router-dom';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import style from '../../frontpage.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';

let TempComponent = () =>
    <>
        <div className={style.page}>
            <div className={scaffold_style.padding_div}>
                <EDSSPage childRef={component => { this.form = component; }} location={useLocation()} renderedInFrontPage={true} override_style={override_style}/>
            </div>
        </div>
        <FrontPageNavigationButton onClickNext={(ev) => { this.form._handleSubmit(ev); this.forceUpdate(); }} formSaved={() => this.form.state.saved} location={useLocation()}/>
    </>;

export class EDSSWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <Routes>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion} />} />
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={ <TempComponent />} />
        </Routes>;
    }
}