import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { deleteCEAPICall } from '../../redux/actions/clinicalEvents';
import { Redirect } from 'react-router-dom';


export default class EditCE extends Component {
    constructor() {
        super();
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    _handleClick(ev) {
        ev.preventDefault();
        store.dispatch(addAlert({ alert: 'about deleting this event?', handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const { params } = this.props.match;
        const body = { patientId: params.patientId, data: { ceId: parseInt(params.elementId) }, to: `/patientProfile/${params.patientId}` };
        store.dispatch(deleteCEAPICall(body));
    }

    render() {
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit Clinical Event</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <h3>Please select the following options: </h3>
                    <br/>
                    <button>Change start date</button> <br/><br/>
                    <button>Change end date</button> <br/><br/>
                    <button>Change severity</button> <br/><br/><br/><br/>
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this event</button>
                    <br/><br/>
                    Note: event type is not allowed to be changed. If you entered an event of the wrong type by error, you can delete the event and create a new one.
                </form>
            </>
        );
    }
}