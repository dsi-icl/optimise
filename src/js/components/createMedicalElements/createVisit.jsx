import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/dataPage.jsx';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import cssTexts from '../../../css/inlinetexts.module.css';
import cssButtons from '../../../css/buttons.module.css';
import { PickDate } from './datepicker.jsx';

@connect(state => ({ patientId: state.patientProfile.data.id }), dispatch => ({ createVisit: body => dispatch(createVisitAPICall(body)) }))
export class CreateVisit extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment()
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate._d;
        return {
            data: {
                patientId: this.props.patientId,
                visitDate: date.toDateString()
            },
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createVisit(requestBody);
    }

    render() {
        return (<div>
            <BackButton to={`/patientProfile/${this.props.patientId}`} />
            <h2>CREATE A NEW VISIT</h2>
            <span className={cssTexts.centeredBlock}>Please enter date on which the visit occurs / occured: <br /> <span className={cssTexts.centeredBlock}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /></span> </span>
            <div onClick={this._handleSubmitClick} className={cssButtons.createPatientButton} style={{ width: '30%' }}>Submit</div>
        </div>);
    }
}