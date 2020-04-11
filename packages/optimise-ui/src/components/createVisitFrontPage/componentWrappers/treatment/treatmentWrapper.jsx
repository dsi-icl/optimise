import React, { Component, PureComponent } from 'react';
import override_style from './overrideStyle.module.css';
import scaffold_style from './scaffoldStyle.module.css';
import { CreateTreatment } from '../../../createMedicalElements/createTreatment';
import { TreatmentInterruption } from '../../../medicalData/treatmentInterruptions';
import { RenderTreatments } from '../../../patientProfile/patientChart';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Medication } from '../../../patientProfile/patientChart';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class TreatmentWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
                <CreateTreatmentsWrapper match={this.props.match}/>
            </div>
            {/* <div className={scaffold_style.edit_element_panel}>
                <TreatmentInterruptionsWrapper match={this.props.match}/>
            </div> */}
            <div className={scaffold_style.list_element_panel}>
                <RenderTreatmentsWrapper treatments={this.props.data.treatments} baselineVisit={true} visitId={this.props.match.params.visitId}/>
            </div>
        </div>;
    }
}

class RenderTreatmentsWrapper extends PureComponent {
    render() {
        const { visitId, treatments } = this.props;
        const _visitIdParsed = parseInt(visitId, 10);
        const treatmentForThisVisit = treatments.filter(el => el['orderedDuringVisit'] === _visitIdParsed);
        if (treatmentForThisVisit.length === 0) {
            return <p>Treatments will be displayed here.</p>;
        }

        return <table className={override_style.treatment_table}>
            <thead>
                <tr><th>Treatment</th><th>Start date</th><th>End date</th><th>Dose</th><th>Form</th><th>Frequency</th><th>#interruptions</th></tr>
            </thead>
            <tbody>
                {treatmentForThisVisit.map(el => <Medication key={el.id} data={el} suppressButtons={true}/>)}
            </tbody>
        </table>;
    }
}

class CreateTreatmentsWrapper extends PureComponent {
    render() {
        const { match } = this.props;

        return <CreateTreatment match={match} override_style={override_style}/>;
    }
}
// class TreatmentInterruptionsWrapper extends PureComponent {
//     render() {
//         const { match } = this.props;

//         return <TreatmentInterruption match={match} override_style={override_style}/>;
//     }
// }