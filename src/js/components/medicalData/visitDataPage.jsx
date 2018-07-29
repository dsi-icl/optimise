import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import { addError } from '../../redux/actions/error';
import { createLevelObj, mappingFields, BackButton, checkIfObjIsEmpty } from './utils';
import Icon from '../icon';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './dataPage.module.css';
import store from '../../redux/store';

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile
    };
}


/**
 * @class DataTemplate
 * @description Renders the data page for test / visit / treatment / event data
 * @prop {String} this.props.elementType - 'test', 'visit', 'treatment', 'clinicalEvent'
 * @prop {Object} this.props.match - from router
 * @prop {Object} this.props.fields - from store
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 */

/* this component serves as a sieve for the data and pass the relevant one to the form as props*/
@withRouter
@connect(mapStateToProps)
export class VisitData extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
        this.references = {};
        this.originalValues = {};
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { references, originalValues } = this;
        const update = {};
        const add = {};
        Object.entries(references).forEach(el => {
            const fieldId = el[0];
            const reference = el[1].ref;
            const type = el[1].type;
            if (type === 'C' && (originalValues[fieldId] || reference.current.value !== 'unselected')) {
                if (originalValues[fieldId] && originalValues[fieldId] !== reference.current.value) {
                    update[fieldId] = reference.current.value;
                }
                if (!originalValues[fieldId]) {
                    add[fieldId] = reference.current.value;
                }
            }
            if (['I', 'F', 'T'].includes(type) && (originalValues[fieldId] || reference.current.value !== '' || reference.current.value !== undefined)) {
                if (originalValues[fieldId] && originalValues[fieldId] !== reference.current.value) {
                    update[fieldId] = reference.current.value;
                }
                if (!originalValues[fieldId] && reference.current.value !== '') {
                    add[fieldId] = reference.current.value;
                }
            }
            if (type === 'B') {
                const bool = reference.current.checked ? '1' : '0';
                if (originalValues[fieldId]) {
                    if (originalValues[fieldId] !== bool) {
                        update[fieldId] = bool;
                    }
                } else {
                    if (bool !== '0') {
                        add[fieldId] = bool;
                    }
                }
            }
        });
        const { params } = this.props.match;
        if (checkIfObjIsEmpty(update, add)) {
            store.dispatch(addError({ error: 'Clicking save does nothing because none of the data seems to have changed!' }));
            return;
        }
        const body = { data: { visitId: params.visitId, update, add }, type: 'visit', patientId: params.patientId };
        store.dispatch(alterDataCall(body));
    }

    render() {
        const { patientProfile, match } = this.props;
        const { params } = match;
        if (!patientProfile.fetching) {
            const visitsMatched = patientProfile.data.visits.filter(visit => visit.id === parseInt(params.visitId, 10));
            if (visitsMatched.length !== 1) {
                return <div>{'Cannot find your visit!'}</div>;
            }
            const { fields } = this.props;
            const relevantFields = fields.visitFields.filter(el => (el.referenceType === visitsMatched[0].type && [2, 3].includes(el.section)));
            const fieldTree = { symptoms: createLevelObj(relevantFields.filter(el => el.section === 2)), signs: createLevelObj(relevantFields.filter(el => el.section === 3)) };
            const inputTypeHash = fields.inputTypes.reduce((a, el) => { a[el.id] = el.value; return a; }, {});

            this.originalValues = visitsMatched[0].data.reduce((a, el) => { a[el.field] = el.value; return a; }, {});
            this.references = relevantFields.reduce((a, el) => { a[el.id] = { ref: React.createRef(), type: inputTypeHash[el.type] }; return a; }, {});
            return (
                <>
                    <div className={scaffold_style.ariane}>
                        <h2>SYMPTOMS AND SIGNS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={`${scaffold_style.panel} ${style.topLevelPanel}`}>
                        <form onSubmit={this._handleSubmit} className={style.form}>
                            {Object.entries(fieldTree).map(mappingFields(inputTypeHash, this.references, this.originalValues))}
                            <button type='submit'>Save</button>
                        </form>
                    </div>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}