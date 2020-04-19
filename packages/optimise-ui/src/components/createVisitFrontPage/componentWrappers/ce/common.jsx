import React, { Component, PureComponent } from 'react';
import override_style from '../overrideStyle.module.css';
import { CreateCE } from '../../../createMedicalElements/createCE';
import { CeData } from '../../../medicalData/ceDataPage';
import EditCE from '../../../editMedicalElements/editClinicalEvent';
import { ClinicalEvent } from '../../../patientProfile/patientChart';
import { NavLink } from 'react-router-dom';

export class RenderEventsWrapper extends PureComponent {
    render() {
        /* displayTheseTypes = [1,2,3] */
        const { events: allEvents, match, displayTheseTypes, location, title } = this.props;

        const filteredEvents = allEvents.filter(el => displayTheseTypes.includes(el.type));

        if (filteredEvents.length === 0) {
            return <p>Events will be displayed here.</p>;
        }

        // const treatmentssorted = [...treatments].sort((a, b) => parseInt(a.startDate) - parseInt(b.startDate));

        return <>
            <p>{title}</p>
            <table className={override_style.treatment_table}>
                <thead>
                    <tr><th></th><th>Type</th><th>Start date</th><th>End date</th><th>MedDRA</th><th></th></tr>
                </thead>
                <tbody>
                    { filteredEvents.map(el => <ClinicalEvent key={el.id} location={location} data={el} renderedInFrontPage={true} match={match} />) }
                </tbody>
            </table>
        </>;
    }
}

export class EditEventDataWrapper extends PureComponent {
    render() {
        const { match, location } = this.props;
        return <>
            <h3>Enter data for this event:</h3>
            <CeData match={match} override_style={override_style} location={location}/>
        </>;
    }
}

export class CreateEventWrapper extends PureComponent {
    render() {
        /* fixedCeTypes = [1, 2, 3] */
        const { match, location, fixedCeTypes, title } = this.props;

        return <>
            <h3>{title}</h3>
            <CreateCE match={match} fixedCeTypes={fixedCeTypes} override_style={override_style} renderedInFrontPage={true} location={location}/>
        </>;
    }
}

export class EditEventWrapper extends PureComponent {
    render() {
        const { match, location, title } = this.props;
        return <>
            <h3>{title}</h3>
            <EditCE match={match} override_style={override_style} renderedInFrontPage={true} location={location}/>
        </>;
    }
}

export class EventCreatedMessage extends Component {
    render() {
        const { patientId, visitId, currentPage, ceId } = this.props.match.params;
        const { typeHash, meddraHash } = this.props;
        const eventsFiltered = this.props.events.filter(el => el.id.toString() === ceId);

        if (eventsFiltered.length !== 1) {
            return <p>Error: Cannot find event.</p>;
        }

        const currentEvent = eventsFiltered[0];
        const dateOccur = new Date(parseInt(currentEvent.dateStartDate)).toDateString();
        return (
            <div>
                <p>Please enter related data on the opposite panel for the following event:</p>
                <br/>
                <p><b>Date:</b> {dateOccur}</p>
                <p><b>Type:</b> {typeHash[currentEvent.type]}</p>
                {
                    currentEvent.meddra ?
                        <p><b>Meddra:</b> {meddraHash[currentEvent.meddra]}</p>
                        : null
                }
                <br/><br/>
                <p>You can also record another entry:</p>
                <br/>
                <NavLink to={`/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}${this.props.location.search}`}> <button>Record another entry</button></NavLink>
            </div>
        );
    }
}