import { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { BackButton } from '../medicalData/utils';
import { deleteVisitAPICall, updateVisitAPICall } from '../../redux/actions/createVisit';
import { PickDate } from '../createMedicalElements/datepicker';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { addAlert } from '../../redux/actions/alert';
import { PregnancyEntry } from '../pregnancyForms/pregnancyEntry';

@connect(state => ({
    data: state.patientProfile.data,
    patientId: state.patientProfile.data.id,
    visits: state.patientProfile.data.visits
}), dispatch => ({
    updateVisit: body => dispatch(updateVisitAPICall(body))
}))
class EditVisit extends Component {
    constructor(props) {
        super(props);
        this.state = { wannaUpdate: false };
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleSubmitClick = this._handleSubmitClick.bind(this);
        this._handleKeyChange = this._handleKeyChange.bind(this);
        this._formatRequestBody = this._formatRequestBody.bind(this);
        this._handleWannaUpdateClick = this._handleWannaUpdateClick.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.visits || nextProps.match.params.visitId === prevState.visitId)
            return prevState;
        const visitData = nextProps.visits.filter(el => el.id === parseInt(nextProps.match.params.visitId))[0];
        const reason = visitData.data.filter(el => el.field === 0);
        return {
            ...prevState,
            wannaUpdate: false,
            visitId: nextProps.match.params.visitId,
            reasonForVisit: reason ? reason[0].value : 'unselected',
            startDate: moment(visitData.visitDate, 'x'),
            error: undefined
        };
    }

    _handleWannaUpdateClick(ev) {
        ev.preventDefault();
        this.setState(oldState => ({
            wannaUpdate: !oldState.wannaUpdate,
            error: undefined
        }));
    }

    _handleDateChange(date) {
        this.setState({
            startDate: date,
            error: undefined
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
            lastSubmit: (new Date()).getTime(),
            error: undefined
        }, () => {
            this.props.updateVisit(body);
        });
    }

    _handleClick(ev) {
        ev.preventDefault();
        store.dispatch(addAlert({ alert: 'Are you sure you want to delete this visit record?', handler: this._deleteFunction }));
    }

    _deleteFunction() {
        const { params } = this.props.match;
        const { data } = this.props;

        const body = { patientId: params.patientId, data: { visitId: params.visitId }, to: `/patientProfile/${params.patientId}` };

        const visitPregnancyEntry = data.pregnancyEntries.filter(el => el.recordedDuringVisit === parseInt(params.visitId));

        if (visitPregnancyEntry.length > 0) {
            // find all entries associated with the same pregnancy
            const allPregnancyEntries = data.pregnancyEntries.filter(el => el.pregnancyId === visitPregnancyEntry[0].pregnancyId);

            const entryOrder = PregnancyEntry._checkEntryOrder(visitPregnancyEntry[0], this.props.data);
            const pregnancy = this.props.data.pregnancy.filter(el => el.id === visitPregnancyEntry[0].pregnancyId);
            const entryIsTerm = (entryOrder === 'latest' || entryOrder === 'sole entry') && typeof pregnancy[0].outcome === 'number' && pregnancy[0].outcomeDate !== null;

            // final entry associated with a pregnancy is deleted, so also delete the pregnancy
            if (allPregnancyEntries.length === 1 && allPregnancyEntries[0].id === visitPregnancyEntry[0].id) {
                body.deletePregnancy = { id: visitPregnancyEntry[0].pregnancyId };
            }
            else if (entryIsTerm) {
                // set pregnancy outcome to null if term entry is deleted
                body.alterPregnancy = { id: visitPregnancyEntry[0].pregnancyId, outcome: null, outcomeDate: null };
            }
        }

        store.dispatch(deleteVisitAPICall(body));
    }

    render() {
        const { startDate, reasonForVisit, error, wannaUpdate } = this.state;
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
                    {wannaUpdate
                        ? (
                            <>
                                <label>Please enter date on which the visit occured:</label>
                                <br />
                                <PickDate startDate={startDate} handleChange={this._handleDateChange} />
                                <br />
                                <br />
                                <label htmlFor="reasonForVisit">Reason for the visit:</label>
                                <br />
                                <select
                                    name="reasonForVisit"
                                    onChange={this._handleKeyChange}
                                    value={reasonForVisit}
                                    autoComplete="off"
                                >
                                    <option value="unselected"></option>
                                    <option value="Routine">Routine</option>
                                    <option value="Drug Monitoring">Drug Monitoring</option>
                                    <option value="Relapse Assessment">Relapse Assessment</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                                <br />
                                <br />
                                {error
                                    ? (
                                        <>
                                            <div className={style.error}>{error}</div>
                                            <br />
                                        </>
                                    )
                                    : null}
                                <button onClick={this._handleSubmitClick}>Submit</button>
                                <br />
                                <br />
                            </>
                        )
                        : null}
                    {wannaUpdate
                        ? (
                            <>
                                <button onClick={this._handleWannaUpdateClick}>Cancel</button>
                                <br />
                                <br />
                            </>
                        )
                        : (
                            <>
                                <button onClick={this._handleWannaUpdateClick}>Change visit properties</button>
                                <br />
                                <br />
                            </>
                        )}
                    <button onClick={this._handleClick} className={style.deleteButton}>Delete this visit</button>
                </form>
            </>
        );
    }
}

export default EditVisit;
