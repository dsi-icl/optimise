import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/dataPage.jsx';
import { createVisitAPICall } from '../../redux/actions/createVisit';
import cssTexts from '../../../css/inlinetexts.css';
import cssButtons from '../../../css/buttons.css';
import { PickDate } from './datepicker.jsx';

export function parseDate(dateString) {
    const dateArr = dateString.split('/');
    if (dateArr.length === 3 && dateArr.filter(el => (Number.isInteger(el) && el > 0 ))) {
        return { day: parseInt(dateArr[0], 10), month: parseInt(dateArr[1], 10), year: parseInt(dateArr[2], 10) };
    } else {
        throw new Error('wrong date format');
    }
}

@connect(state => ({ patientId: state.patientProfile.data.patientId }), dispatch => ({ createVisit: body => dispatch(createVisitAPICall(body)) }))
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
            patientId: this.props.patientId,
            visitDate: { day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
        };
    }

    _handleSubmitClick() {
        const requestBody = this._formatRequestBody();
        this.props.createVisit(requestBody);
    }

    render() {
        return (<div>
            <BackButton to={`/patientProfile/${this.props.patientId}`}/>
            <h2>CREATE A NEW VISIT</h2>
            <span class={cssTexts.centeredBlock}>Please enter date on which the visit occurs / occured: <br/> <span className={cssTexts.centeredBlock}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange}/></span> </span>
            <div onClick={this._handleSubmitClick} className={cssButtons.createPatientButton} style={{ width: '30%' }}>Submit</div>
        </div>);
    }
}