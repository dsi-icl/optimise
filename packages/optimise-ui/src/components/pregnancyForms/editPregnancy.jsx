//import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
//import Icon from '../icon';
//import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import React, { Component } from 'react';
//import style from './dataPage.module.css';
//import store from '../../redux/store';
import { examplePregnancyData } from './exampleData';
//import { PregnancyBaselineDataForm } from './pregBaselineData';
//import { PregnancyPostDataForm } from './pregPostData';
//import { PregnancyFollowupDataForm } from './pregFollowupData';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PregnancyFollowupDataForm from './pregFollowupData';
import PregnancyBaselineDataForm from './pregBaselineData';
import PregnancyPostDataForm from './pregPostData';


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,
    patientProfile: state.patientProfile

}))
class EditPregnancyDataEntries extends Component {
    render() {

        const patientProfile = this.props.patientProfile;


        if (!patientProfile.fetching) {

            const matchId = this.props.match.params.entryId;
            const renderedInFrontPage = this.props.renderedInFrontPage;
            const matchedEntry = this.props.data.pregnancyEntries.filter(el => el.id === parseInt(matchId));


            if (!matchedEntry || matchedEntry.length !== 1) {
                return 'An error occured.';
            }

            switch (matchedEntry[0].dataType) {
                case 'baseline':
                    return <PregnancyBaselineDataForm renderedInFrontPage={renderedInFrontPage} entryId={matchedEntry[0].id} />;
                case 'followup':
                    return <PregnancyFollowupDataForm renderedInFrontPage={renderedInFrontPage} entryId={matchedEntry[0].id} />;
                case 'term':
                    return <PregnancyFollowupDataForm renderedInFrontPage={renderedInFrontPage} entryId={matchedEntry[0].id} />;
                // case 'term':
                //     return <PregnancyPostDataForm renderedInFrontPage={renderedInFrontPage} formData={matchedEntry[0]} />;
            }
        } else {
            return "Loading..."
        }
    }
}

export default EditPregnancyDataEntries;
