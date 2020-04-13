import React, { Component, PureComponent } from 'react';
import override_style from '../overrideStyle.module.css';
import scaffold_style from '../scaffoldStyle.module.css';
import { CreateTreatment } from '../../../createMedicalElements/createTreatment';
import { TreatmentInterruption } from '../../../medicalData/treatmentInterruptions';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import { Medication } from '../../../patientProfile/patientChart';
import EditMed from '../../../editMedicalElements/editMedication';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class TreatmentWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' render={({ match, location }) => <EditMedWrapper match={match} location={location}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/interruptions/:elementId' render={({ match }) => <TreatmentCreatedMessage match={match} treatments={this.props.data.treatments}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <CreateTreatmentsWrapper match={match} location={location}/>}/>
                </Switch>
            </div>
            <div className={scaffold_style.list_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/interruptions/:elementId' render={({ match }) => <TreatmentInterruptionWrapper match={match}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match }) => <RenderTreatmentsWrapper match={match} treatments={this.props.data.treatments} baselineVisit={true}/>}/>
                </Switch>
            </div>
        </div>;
    }
}

class RenderTreatmentsWrapper extends PureComponent {
    render() {
        const { treatments, match } = this.props;
        if (treatments.length === 0) {
            return <p>Treatments will be displayed here.</p>;
        }

        const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <table className={override_style.treatment_table}>
            <thead>
                <tr><th></th><th>Treatment</th><th>Start date</th><th>End date</th><th>Dose</th><th>Form</th><th>Frequency</th><th>#interruptions</th><th></th></tr>
            </thead>
            <tbody>
                {treatmentssorted.map(el => <Medication key={el.id} data={el} renderedInFrontPage={true} match={match}/>)}
            </tbody>
        </table>;
    }
}

class EditMedWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;
        return <EditMed match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>;
    }
}

class TreatmentInterruptionWrapper extends PureComponent {
    render() {
        const { match } = this.props;
        return <TreatmentInterruption match={match} override_style={override_style}/>;
    }
}

class CreateTreatmentsWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;

        return <CreateTreatment match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>;
    }
}

class TreatmentCreatedMessage extends Component {
    render() {
        const { patientId, visitId, currentPage, elementId } = this.props.match.params;
        const treatmentsFiltered = this.props.treatments.filter(el => el.id.toString() === elementId);

        if (treatmentsFiltered.length !== 1) {
            return <p>Error: Cannot find treatment.</p>;
        }

        const currentTreatment = treatmentsFiltered[0];
        const dateOccur = new Date(parseInt(currentTreatment.startDate)).toDateString();
        return (
            <div>
                <p>Treatment has been recorded! Please enter related data on the opposite panel.</p>
                <p>{currentTreatment.drugId}</p>
                <p>{dateOccur}</p>

                <p>You can also record another treatment:</p>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}`}> <button>Record another treatment</button></NavLink>
            </div>
        );
    }
}