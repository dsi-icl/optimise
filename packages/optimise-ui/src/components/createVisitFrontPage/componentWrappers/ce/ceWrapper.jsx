import React, { Component, PureComponent } from 'react';
import override_style from './overrideStyle.module.css';
import scaffold_style from './scaffoldStyle.module.css';
import { CreateTreatment } from '../../../createMedicalElements/createTreatment';
import { TreatmentInterruption } from '../../../medicalData/treatmentInterruptions';
import { RenderTreatments } from '../../../patientProfile/patientChart';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Medication } from '../../../patientProfile/patientChart';
import EditMed from '../../../editMedicalElements/editMedication';
import { ClinicalEvent } from '../../../patientProfile/patientChart';
import EditCE from '../../../editMedicalElements/editClinicalEvent';
import { CeData } from '../../../medicalData/ceDataPage';
import { CreateCE } from '../../../createMedicalElements/createCE';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class CeWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
                <Switch>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/edit/:elementId' render={({ match, location }) => <EditEventWrapper match={match} location={location}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage/data/:ceId' render={({ match }) => <EditEventDataWrapper match={match}/>}/>
                    <Route path='/patientProfile/:patientId/visitFrontPage/:visitId/page/:currentPage' render={({ match, location }) => <CreateEventWrapper match={match} location={location}/>}/>
                </Switch>
            </div>
            <div className={scaffold_style.list_element_panel}>
                <RenderEventsWrapper events={this.props.data.clinicalEvents} baselineVisit={true} visitId={this.props.match.params.visitId}/>
            </div>
        </div>;
    }
}

class RenderEventsWrapper extends PureComponent {
    render() {
        const { visitId, events } = this.props;
        if (events.length === 0) {
            return <p>Clinical events (SAEs, opportunistic infections) will be displayed here.</p>;
        }

        // const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <table className={override_style.treatment_table}>
            <thead>
                <tr><th></th><th>Type</th><th>Start date</th><th>End date</th><th>MedDRA</th><th></th></tr>
            </thead>
            <tbody>
                { events.map(el => <ClinicalEvent key={el.id} data={el} renderedInFrontPage={true} />) }
            </tbody>
        </table>;
    }
}

class EditEventWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;
        return <EditCE match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>;
    }
}

class EditEventDataWrapper extends PureComponent {
    render() {
        const { match } = this.props;
        return <CeData match={match} override_style={override_style}/>;
    }
}

class CreateEventWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;

        return <CreateCE match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>;
    }
}

