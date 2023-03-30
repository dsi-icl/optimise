import React, { Component, PureComponent } from 'react';
import override_style from '../overrideStyle.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { CreateTreatment } from '../../../createMedicalElements/createTreatment';
import { TreatmentInterruption } from '../../../medicalData/treatmentInterruptions';
import { connect } from 'react-redux';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { Medication } from '../../../patientProfile/patientChart';
import EditMed from '../../../editMedicalElements/editMedication';
import style from '../../frontpage.module.css';
import { YesOrNo } from '../yesOrNoQuestion/yesOrNoQuestion';
import { FrontPageNavigationButton } from '../navigationButtons/navigationButtons';


@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    drugHash: state.availableFields.drugs_Hash[0]
}))

export class TreatmentWrapper extends Component {
    render() {
        const { yesOrNoQuestion } = this.props;
        return <>
            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/yes_or_no' element={<YesOrNo location={useLocation()} questionString={yesOrNoQuestion} />} />
            <div className={style.page}>
                <div className={scaffold_style.wrapper}>
                    <div className={scaffold_style.create_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' element={<EditMedWrapper location={useLocation()} />}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/interruptions/:elementId' element={<TreatmentCreatedMessage drugHash={this.props.drugHash} location={useLocation()} treatments={this.props.data.treatments} />}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={<CreateTreatmentsWrapper location={useLocation()} />}/>
                        </Routes>
                    </div>
                    <div className={scaffold_style.list_element_panel}>
                        <Routes>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/interruptions/:elementId' element={<TreatmentInterruptionWrapper location={useLocation()} />}/>
                            <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' element={<RenderTreatmentsWrapper location={useLocation()} treatments={this.props.data.treatments} baselineVisit={true} />}/>
                        </Routes>
                    </div>
                </div>
            </div>
            <FrontPageNavigationButton location={useLocation()}/>
        </>;
    }
}

class RenderTreatmentsWrapper extends PureComponent {
    render() {
        const { treatments, match } = this.props;
        if (treatments.length === 0) {
            return <p>No DMT has been recorded for this patient yet.</p>;
        }

        const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <>
            <p>Here are the DMTs this patient has been on:</p>
            <table className={override_style.treatment_table}>
                <thead>
                    <tr><th></th><th>Treatment</th><th>Start date</th><th>End date</th><th>Dose</th><th>Form</th><th>Frequency</th><th>#interruptions</th><th></th></tr>
                </thead>
                <tbody>
                    {treatmentssorted.map(el => <Medication key={el.id} data={el} renderedInFrontPage={true} match={match}/>)}
                </tbody>
            </table>
        </>;
    }
}

class EditMedWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;
        return <>
            <h3>Edit this DMT</h3>
            <EditMed match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>
        </>;
    }
}

class TreatmentInterruptionWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;
        return <TreatmentInterruption renderedInFrontPage={true} location={location} match={match} override_style={override_style}/>;
    }
}

class CreateTreatmentsWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;

        return <>
            <h3>Record a DMT</h3>
            <CreateTreatment match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>
        </>;
    }
}

class TreatmentCreatedMessage extends Component {
    render() {
        const { patientId, visitId, currentPage, elementId } = this.props.match.params;
        const { drugHash } = this.props;
        const treatmentsFiltered = this.props.treatments.filter(el => el.id.toString() === elementId);

        if (treatmentsFiltered.length !== 1) {
            return <p>Error: Cannot find treatment.</p>;
        }

        const currentTreatment = treatmentsFiltered[0];
        const dateOccur = new Date(parseInt(currentTreatment.startDate)).toDateString();
        return (
            <div>
                <p>Record any interruptions to this treatment:</p>

                <br/>
                <p><b>Drug:</b> {drugHash[currentTreatment.drug] && drugHash[currentTreatment.drug].name}</p>
                <p><b>Date:</b> {dateOccur}</p>
                <br/><br/>
                <p>You can also record another treatment:</p>
                <br/>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}${this.props.location.search}`}> <button>Record another treatment</button></NavLink>
            </div>
        );
    }
}