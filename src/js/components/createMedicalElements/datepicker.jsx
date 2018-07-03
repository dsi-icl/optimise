import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';


export class PickDate extends Component {
    render() {
        return <DatePicker
            selected={this.props.startDate}
            onChange={this.props.handleChange}
        />;
    }
}