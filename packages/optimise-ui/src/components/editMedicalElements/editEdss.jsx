import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BackButton } from '../medicalData/utils';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import store from '../../redux/store';
import style from './editMedicalElements.module.css';


@connect(state => ({
    visitFields: state.availableFields.visitFields,
    patientProfile: state.patientProfile.data,
    }))
class EditPerformanceMesaure extends Component {

    constructor() {
        super();
        this.state = {};
        this.freeinputref = React.createRef();
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {};
        const { visitFields, patientProfile, match } = props;
        const { params } = match;
        const EDSSFields = visitFields.filter(el => /^edss:(.*)/.test(el.idname));
        newState.EDSSFields_Hash_reverse = EDSSFields.reduce((a, el) => { a[el.idname] = el.id; return a; }, {});
        const edssFieldsId = EDSSFields.map(el => el.id);
        if (patientProfile.visits === undefined)
            return state;
        const visitsFiltered = patientProfile.visits.filter(el => el.id === parseInt(params.visitId));
        if (visitsFiltered.length !== 1) {
            newState.originalValues = {};
        } else {
            const data = visitsFiltered[0].data;
            if (data) {
                newState.originalValues = data.filter(el => edssFieldsId.includes(el.field)).reduce((a, el) => { a[el.field] = parseFloat(el.value); return a; }, {});
            } else {
                newState.originalValues = {};
            }
        }
        return { ...state, ...newState };
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const add = {};
        const update = {};
        const freeInputOrigVal = this.state.originalValues[this.state.EDSSFields_Hash_reverse['edss:expanded disability status scale - estimated total']];
        if (freeInputOrigVal !== undefined) {
            if (this.freeinputref.current.value !== freeInputOrigVal) {
                update[this.state.EDSSFields_Hash_reverse['edss:expanded disability status scale - estimated total']] = this.freeinputref.current.value;
            }
        } else {
            if (this.freeinputref.current.value !== '') {
                add[this.state.EDSSFields_Hash_reverse['edss:expanded disability status scale - estimated total']] = this.freeinputref.current.value;
            }
        }

        const body = { data: { add, update, visitId: this.props.match.params.visitId }, patientId: this.props.match.params.patientId, type: 'visit' };

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(alterDataCall(body, () => {
                this.setState({
                    originalValues: Object.assign({}, this.state.originalValues, add)
                });
            }));
        });
    }

    render() {
        const { match: { params }, patientProfile: { visits } } = this.props;
        if (visits === undefined)
            return null;
        const visitFiltered = visits.filter(el => parseInt(params.visitId) === el.id);
        if (!this.state.originalValues || !this.state.EDSSFields_Hash_reverse)
            return null;
        const { EDSSFields_Hash_reverse, originalValues } = this.state;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Performance Measure</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel} onSubmit={this._handleSubmit}>
                    {visitFiltered.length === 1 ?
                        <>
                            <span><i>This is for the visit of the {(new Date(parseInt(visitFiltered[0].visitDate))).toDateString()}</i></span><br /><br />
                            <div>
                                You can enter your EDSS score estimation in the following field.<br /><br />
                                <label htmlFor='edss:expanded disability status scale - estimated total'>Estimated total score (by the clinician): </label><input key={Math.random()} type='text' ref={this.freeinputref} name='edss:expanded disability status scale - estimated total' defaultValue={originalValues[EDSSFields_Hash_reverse['edss:expanded disability status scale - estimated total']] ? originalValues[EDSSFields_Hash_reverse['edss:expanded disability status scale - estimated total']] : ''} />
                                <br /><br />
                                <button type='submit'>Save</button><br /><br />
                                Or alternatively use the EDSS calculator as a guide by clicking on the following button.<br /><br />
                                <NavLink to={`/patientProfile/${params.patientId}/edit/msPerfMeas/${params.visitId}/edss`}><span className={style.openCalculator}>Open EDSS Calculator</span></NavLink>
                            </div>
                        </>
                        :
                        <div>
                            <i>We could not find the EDSS scores you are looking for.</i>
                        </div>
                    }
                </form>
            </>
        );
    }
}

export default EditPerformanceMesaure;