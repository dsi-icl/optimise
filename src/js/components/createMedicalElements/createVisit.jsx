import React, {Component} from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import css from '../../../css/patientProfile.css.js';
import {BackButton} from '../dataPage.jsx';
import {createVisitAPICall} from '../../redux/actions/createVisit';


class PickDate extends Component {
    render() {
      return <DatePicker
          selected={this.props.startDate}
          onChange={this.props.handleChange}
      />;
    }
}

function parseDate(dateString) {
    const dateArr = dateString.split('/');
    if (dateArr.length === 3 && dateArr.filter(el => (Number.isInteger(el) && el > 0 ))) {
        return {day: parseInt(dateArr[0]), month: parseInt(dateArr[1]), year: parseInt(dateArr[2])};
    } else {
        throw 'wrong date format';
    }
}


class CreateVisit_toConnect extends Component {
    constructor() {
        super();
        this.state = {
            startDate: moment()
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
    }

    _handleDateChange(date) {
        this.setState({
          startDate: date
        });
    }

    _handleSubmitClick() {
        const date = this.state.startDate._d;
        const requestBody = {patientId: this.props.patientId, visitDate: {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()}};
        console.log(requestBody);
        this.props.createVisit(requestBody);
    }

    render() {
        return (<div>
                <BackButton to={`/patientProfile/${this.props.patientId}`}/>
                <h2>CREATE A NEW VISIT</h2>
                <span style={{display: 'block', width: '60%', margin:'0 auto'}}>Please enter date on which the visit occurs / occured: <br/> <span style={{display: 'block', width: '50%', margin:'0 auto'}}><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange}/></span> </span>
                <div onClick={this._handleSubmitClick} style={{cursor: 'pointer', textAlign: 'center', backgroundColor: 'lightgrey', borderRadius: 20, width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: 15}}>Submit</div>
            </div>);
    }
}

export const CreateVisit = connect(state => ({patientId: state.patientProfile.data.patientId}), dispatch => ({createVisit: body => dispatch(createVisitAPICall(body))}))(CreateVisit_toConnect);