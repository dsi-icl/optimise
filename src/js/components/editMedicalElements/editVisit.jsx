import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import { updateVisitAPICall } from '../../redux/actions/createVisit';
import { PickDate } from '../createMedicalElements/datepicker';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({
    patientId: state.patientProfile.data.id,
    visits: state.patientProfile.data.visits
}), dispatch => ({
    updateVisit: body => dispatch(updateVisitAPICall(body))
}))
export default class EditVisit extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleKeyChange = this._handleKeyChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.visits || nextProps.match.params.visitId === prevState.visitId)
            return prevState;
        const visitData = nextProps.visits.filter(el => el.id === parseInt(nextProps.match.params.visitId))[0];
        const reason = visitData.data.filter(el => el.field === 0);
        return {
            ...prevState,
            visitId: nextProps.match.params.visitId,
            reasonForVisit: reason ? reason[0].value : 'unselected',
            startDate: moment(visitData.visitDate, 'x')
        };
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    _handleKeyChange(ev) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    _formatRequestBody() {
        const { params } = this.props.match;
        const { startDate, reasonForVisit } = this.state;

        if (reasonForVisit === 'unselected') {
            return 'the reason for the visit';
        }

        if (!startDate || !startDate.isValid() || startDate === '') {
            return 'the date of the visit';
        }

        return {
            visitData: {
                id: parseInt(params.visitId),
                visitDate: startDate.toISOString()
            },
            VSData: {
                visitId: params.visitId,
                update: {
                    0: this.state.reasonForVisit
                }
            },
            type: 'visit',
            patientId: this.props.match.params.patientId
        };
    }

    _handleSubmitClick(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        let error = this._formatRequestBody();
        if (typeof error === 'string') {
            this.setState({ error: `Please enter ${error}` });
            return;
        }

        const body = this._formatRequestBody();

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            this.props.updateVisit(body);
        });
    }

    render() {
        const { startDate, reasonForVisit, error } = this.state;
        const { match: { params }, visits } = this.props;

        if (!visits)
            return null;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Edit visit</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <label>Please enter date on which the visit occured:</label><br /><PickDate startDate={startDate} handleChange={this._handleDateChange} /><br />
                    <label htmlFor='academicConcerns'>Reason for the visit:</label><br />
                    <select name='reasonForVisit'
                        onChange={this._handleKeyChange}
                        value={reasonForVisit}
                        autoComplete='off'
                    >
                        <option value='unselected'></option>
                        <option value='Routine'>Routine</option>
                        <option value='Drug Monitoring'>Drug Monitoring</option>
                        <option value='Relapse Assessment'>Relapse Assessment</option>
                        <option value='Urgent'>Urgent</option>
                    </select><br /><br />
                    {error ? <><div className={style.error}>{error}</div><br /></> : null}
                    <button onClick={this._handleSubmitClick} >Submit</button>
                </form>
            </>
        );
    }
}