import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export class PickDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.startDate ? props.startDate.toDate() : undefined
        };
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _handleDateChange(date) {
        let time = date ? moment(date) : undefined;
        time = time && time.isValid() ? time : undefined;
        this.setState({
            selected: time ? time.toDate() : undefined
        }, () => {
            if (this.props.handleChange)
                this.props.handleChange(moment(this.state.selected));
        });
    }

    render() {
        return (
            <>
                <DatePicker
                    selected={this.state.selected}
                    onChange={this._handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    style={{ width: '100%' }} />
                {this.props.handleChange === undefined ? <input style={{ display: 'block' }} type='test' value={this.state.selected ? this.state.selected.toISOString() : ''} ref={this.props.reference} readOnly /> : null}
            </>
        );
    }
}