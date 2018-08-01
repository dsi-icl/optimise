import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export class PickDate extends Component {

    constructor() {
        super();
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleDateChange(date) {
        this.props.handleChange(moment(date));
    }

    render() {
        return <DatePicker
            selected={this.props.startDate}
            onChange={this._handleDateChange}
            dateFormat="DD/MM/YYYY"
            style={{ width: '100%' }} />;
    }
}