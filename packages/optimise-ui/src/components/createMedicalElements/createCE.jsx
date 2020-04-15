import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { PickDate } from './datepicker';
import { BackButton } from '../medicalData/utils';
import { createCEAPICall } from '../../redux/actions/clinicalEvents';
import { MeddraPicker } from '../medDRA/meddraPicker';
import style from './medicalEvent.module.css';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    visits: state.patientProfile.data.visits,
    types: state.availableFields.clinicalEventTypes
}), dispatch => ({
    createCE: body => dispatch(createCEAPICall(body))
}))
export class CreateCE extends Component {
    constructor() {
        super();
        this.state = {
            noEndDate: true,
            endDate: moment(),
            startDate: moment(),
            meddra: undefined,
            ceType: 'unselected',
        };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleTypeChange = this._handleTypeChange.bind(this);
        this._handleEndDateChange = this._handleEndDateChange.bind(this);
        this._handleToggleEndDate = this._handleToggleEndDate.bind(this);
        this._handleMedDRAChange = this._handleMedDRAChange.bind(this);
    }

    _handleToggleEndDate(ev) {
        this.setState({
            noEndDate: ev.target.checked,
            error: undefined
        });
    }

    _handleMedDRAChange(value) {
        this.setState({
            meddra: value,
            error: undefined
        });
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: undefined
        });
    }

    _handleEndDateChange(date) {
        this.setState({
            endDate: date,
            error: undefined
        });
    }

    _handleTypeChange(ev) {
        this.setState({
            ceType: ev.target.value,
            error: undefined
        });
    }

    _formatRequestBody() {
        const date = this.state.startDate;
        return {
            patientId: this.props.match.params.patientId,
            data: {
                patientId: this.props.patientId,
                dateStartDate: date.toISOString(),
                endDate: !this.state.noEndDate ? this.state.endDate.toISOString() : undefined,
                type: this.props.fixedCeTypes && this.props.fixedCeTypes.length === 1 ? this.props.fixedCeTypes[0] : (this.state.ceType !== 'unselected' && !isNaN(parseInt(this.state.ceType)) ? parseInt(this.state.ceType) : undefined),
                meddra: this.state.meddra
            }
        };
    }


    _handleSubmitClick(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        if (!this.state.startDate || !this.state.startDate.isValid()) {
            return this.setState({
                error: 'Please indicate the start date of the event'
            });
        }
        if (!this.state.noEndDate && (!this.state.endDate || !this.state.endDate.isValid())) {
            return this.setState({
                error: 'Please indicate the resolution date of the event'
            });
        }

        if (this.state.ceType === 'unselected') {
            if (this.props.fixedCeTypes === undefined || this.props.fixedCeTypes.length !== 1) {
                this.setState({
                    error: 'Please indicate the type of the event'
                });
                return;
            }
        }
        const requestBody = this._formatRequestBody();
        const { patientId, visitId, currentPage } = this.props.match.params;
        requestBody.toFormat = this.props.renderedInFrontPage ? (ceId) => `/patientProfile/${patientId}/visitFrontPage/${visitId}/page/${currentPage}/data/${ceId}${this.props.location.search}` : () => `/patientProfile/${this.props.match.params.patientId}`;

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            this.props.createCE(requestBody);
        });
    }

    render() {
        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        if (this.props.visits) {
            const params = this.props.match.params;
            const { fixedCeTypes } = this.props;
            return (
                <>
                    <div className={_style.ariane}>
                        <h2>Creating a New Event</h2>
                        <BackButton to={`/patientProfile/${params.patientId}`} />
                    </div>
                    <div className={_style.panel}>
                        <label htmlFor=''>Date of occurence:</label><br /><PickDate startDate={this.state.startDate} handleChange={this._handleDateChange} /><br />
                        <label htmlFor='noEndDate'>The event is ongoing: </label><input type='checkbox' name='noEndDate' onChange={this._handleToggleEndDate} checked={this.state.noEndDate} /><br />
                        {this.state.noEndDate ? null : (<><label htmlFor='endDate'>End date: </label><PickDate startDate={this.state.endDate ? this.state.endDate : moment()} handleChange={this._handleEndDateChange} /><br /></>)}<br />
                        <label className={ fixedCeTypes && fixedCeTypes.length === 1 ? _style.test_type_hidden : ''} htmlFor='event'>What type of event is it?</label><br />
                        <select className={ fixedCeTypes && fixedCeTypes.length === 1 ? _style.test_type_hidden : ''} name='event' value={this.state.ceType} onChange={this._handleTypeChange} autoComplete='off'>
                            { fixedCeTypes && fixedCeTypes.length === 1 ? null : <option value='unselected'></option> }
                            { !fixedCeTypes
                                ?
                                <>{this.props.types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</>
                                :
                                <>{this.props.types.filter(type => fixedCeTypes.includes(parseInt(type.id))).map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</>
                            }
                        </select> <br /><br />
                        <label htmlFor='meddra'>MedDRA:</label><br />
                        <MeddraPicker key={params.patientId} value={this.state.meddra} onChange={this._handleMedDRAChange} /><br /><br />
                        {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                        <button onClick={this._handleSubmitClick}>Submit</button>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }
}