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
        const matchId = this.props.match.params.entryId;
        console.log(examplePregnancyData);
        const data = examplePregnancyData.reduce((a, el) => { a = a.concat(el.dataEntries);  return a; }, []);
        console.log(data);
        const matchedEntry = data.filter(el => el.id === parseInt(matchId));

        if (!matchedEntry || matchedEntry.length !== 1) {
            return 'An error occured.';
        }

        switch (matchedEntry[0].dataType) {
            case 'baseline':
                return <PregnancyBaselineDataForm/>;
            case 'followup':
                return <PregnancyFollowupDataForm/>;
            case 'term':
                return <PregnancyPostDataForm/>;
        }
    }
}
