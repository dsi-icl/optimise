import React, {Component} from 'react';
import css from '../../css/patientProfile.css.js';
import patientIcon from '../../statics/icons/icons8-user-48.png';
import resumeIcon from '../../statics/icons/icons8-resume-48.png';


////////////////////////
let hey = {"patientId":"chons","demographicData":{"DOB":"14/7/1994","gender":"male","dominant_hand":"left","ethnicity":"chinese","country_of_origin":"macau","alcohol_usage":"More than 3 units a day","smoking_history":"unknown"},"immunisations":[{"vaccine_name":"BCG","immunisation_date":"14/7/1997"}],"medicalHistory":[{"relation":"self","condition_name":"MS","start_date":"1/6/1025","outcome":"resolved","resolved_year":1954},{"relation":"self","condition_name":"Pneumonia","start_date":"2015","outcome":"resolved","resolved_year":2016},{"relation":"self","condition_name":"Pneumonia","start_date":"2014","outcome":"unknown","resolved_year":null}],"visits":[{"visitId":10,"visitDate":"4/7/2000","data":[]}],"tests":[{"testId":1,"ordered_during_visit":1,"type":2,"expected_occur_date":"5/6/1","data":[{"field":64,"value":"13"},{"field":65,"value":"12"}]}],"treatments":[{"id":1,"ordered_during_visit":1,"drug":"2","dose":2,"unit":"cc","form":"oral","times_per_day":2,"duration_weeks":4,"terminated_date":null,"terminated_reason":null,"interruptions":[{"reason":"pregnancy","start_date":"dsafsaf","end_date":"dsafsdf"},{"reason":"pregnancy","start_date":"fdsaf","end_date":"dsaf"},{"reason":"pregnancy","start_date":"t45325","end_date":"432532"}]},{"id":2,"ordered_during_visit":1,"drug":"1","dose":2,"unit":"cc","form":"oral","times_per_day":2,"duration_weeks":7,"terminated_date":null,"terminated_reason":null,"interruptions":[]},{"id":3,"ordered_during_visit":10,"drug":"1","dose":2,"unit":"cc","form":"oral","times_per_day":3,"duration_weeks":3,"terminated_date":null,"terminated_reason":null,"interruptions":[]}],"clinicalEvents":[{"id":3,"recorded_during_visit":10,"type":1,"date_start_date":"4/7/2100","end_date":null,"data":[]}]};

export class Section extends Component {
    render() {
        return (<div style={css.bigWrapper}>
                <PatientProfileTop/>
                <DemographicSection/>
                <NoteSection/>
                <ImmunisationSection/>
                <MedicalHistorySection/>
            </div>)
    }
}

export class PatientProfileTop extends Component {
    render(){
        return (
            <div>
                <span>Patient ID: <b>{hey.patientId}</b></span>
                <img src={patientIcon}/>
                <img src={resumeIcon}/>
            </div>
        );
    }
}

class PatientProfileSectionScaffold extends Component {
    render() {
        return (
        <div>
            <div style={css.sectionTitleBar}>{this.props.sectionName.toUpperCase()}</div>
            <div style={css.sectionBody}>
            {this.props.children}
            </div>
        </div>
        );
    }
}

class DemographicSection extends Component {
    render() {
        return (
        <PatientProfileSectionScaffold sectionName='Profile'>
                {Object.entries(hey.demographicData).map(el => <span><b>{el[0].replace(/_/g, ' ') + ': '}</b>{el[1]}<br/></span>)}
        </PatientProfileSectionScaffold>
        );
    }
}

class ImmunisationSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Immunisations'>
                {hey.immunisations.map(el => <span><b>{el['vaccine_name']}</b>: {el[ 'immunisation_date']}</span>)}
            </PatientProfileSectionScaffold>
        );
    }
}

class NoteSection extends Component {
    render() {
        return (
            <PatientProfileSectionScaffold sectionName='Notes'>
            </PatientProfileSectionScaffold>
        );
    }
}

class MedicalHistorySection extends Component {
    render() {
        return (
            <div>
            <PatientProfileSectionScaffold sectionName='Existing Medical Conditions'>
                {hey.medicalHistory.filter(el => el.relation === 'self').map(el => {
                    return (
                        <span>{`${el['condition_name']}: ${el['start_date']} : ${el.outcome} : ${el['resolved_year']}`}<br/></span>
                    );
                })}
            </PatientProfileSectionScaffold>
            <PatientProfileSectionScaffold sectionName='Family Medical History'>
                {hey.medicalHistory.filter(el => el.relation !== 'self').map(el => {
                    return (
                        <span>{`${el.relation} : ${el['condition_name']}: ${el['start_date']} : ${el.outcome} : ${el['resolved_year']}`}<br/></span>
                    );
                })}
            </PatientProfileSectionScaffold>
            </div>
        );
    }
}