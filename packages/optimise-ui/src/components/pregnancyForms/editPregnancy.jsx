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

//function mapStateToProps(state) {
//    return {
//        fields: state.availableFields,
//        patientProfile: state.patientProfile
//    };
//}
//
//@withRouter
//@connect(mapStateToProps)


@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,

}))
class EditPregnancies extends Component {
    render() {
        const matchId = this.props.match.params.entryId;
        const renderedInFrontPage = this.props.renderedInFrontPage;


        const data = examplePregnancyData.reduce((a, el) => { a = a.concat(el.pregnancyDataEntries); return a; }, []);

        //const data = this.props.data.pregnancy.reduce((a, el) => { a = a.concat(el.pregnancyDataEntries); return a; }, []);

        const matchedEntry = data.filter(el => el.id === parseInt(matchId));

        console.log("edit pregnancy", this.props)

        if (!matchedEntry || matchedEntry.length !== 1) {
            return 'An error occured.';
        }

        switch (matchedEntry[0].dataType) {
            case 'baseline':
                return <PregnancyBaselineDataForm renderedInFrontPage={renderedInFrontPage} />;
            case 'followup':
                return <PregnancyFollowupDataForm renderedInFrontPage={renderedInFrontPage} />;
            case 'term':
                return <PregnancyPostDataForm renderedInFrontPage={renderedInFrontPage} />;
        }
    }
}

export default EditPregnancies;
