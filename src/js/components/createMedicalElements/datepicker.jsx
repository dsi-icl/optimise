import React, { Component } from 'react';
import DatePicker from 'react-datepicker';


export class PickDate extends Component {
    render() {
        return <DatePicker
            selected={this.props.startDate}
            onChange={this.props.handleChange}
        />;
    }
}