//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import React, { Component } from 'react';
//import style from './dataPage.module.css';
//import store from '../../redux/store';
import { examplePregnancyData } from './exampleData';
import { PregnancyBaselineDataForm } from './pregBaselineData';
import { PregnancyPostDataForm } from './pregPostData';
import { PregnancyFollowupDataForm } from './pregFollowupData';

//function mapStateToProps(state) {
//    return {
//        fields: state.availableFields,
//        patientProfile: state.patientProfile
//    };
//}
//
//@withRouter
//@connect(mapStateToProps)
export class EditPregnancies extends Component {
    render() {
        const type = this.props.match.params.type;
        const renderedInFrontPage = this.props.renderedInFrontPage;
        const pregnancyId = this.props.match.params.pregnancyId;

        switch (type) {
            case 'baseline':
                return (
                    <PregnancyBaselineDataForm
                        pregnancyId={pregnancyId}
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            case 'followup':
                return (
                    <PregnancyFollowupDataForm
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            case 'term':
                return (
                    <PregnancyPostDataForm
                        renderedInFrontPage={renderedInFrontPage}
                    />
                );
            default:
                return null;
        }
    }
}
