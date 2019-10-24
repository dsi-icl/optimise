import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
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
export class CeData extends Component {
    constructor() {
        super();
        this.state = {};
        this.references = null;
        this.originalValues = {};
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.ceId === state.ceId)
            return state;
        return {
            ...state,
            ceId: props.match.params.ceId,
            refreshReferences: true
        };
    }

    componentDidUpdate() {
        if (this.state.refreshReferences === true) {
            this.references = null;
            this.setState({
                refreshReferences: false
            });
        }
    }

    _handleSubmit(ev) {

        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;

        const { references, originalValues } = this;

        if (references === null)
            return;

        const update = {};
        const add = {};
        Object.entries(references).forEach(el => {
            const fieldId = el[0];
            const reference = el[1].ref;
            const type = el[1].type;
            if (type === 'C' && (originalValues[fieldId] !== undefined || reference.current.value !== 'unselected')) {
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== reference.current.value)
                        update[fieldId] = reference.current.value;
                } else if (reference.current.value !== 'unselected') {
                    add[fieldId] = reference.current.value;
                }
            }
            if (['I', 'F', 'T'].includes(type) && (originalValues[fieldId] !== undefined || reference.current.value !== '' || reference.current.value !== undefined)) {
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== reference.current.value)
                        update[fieldId] = reference.current.value;
                } else if (reference.current.value !== '') {
                    add[fieldId] = reference.current.value;
                }
            }
            if (type === 'B') {
                const bool = reference.current.checked ? '1' : '0';
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== bool)
                        update[fieldId] = bool;
                } else if (bool !== '0') {
                    add[fieldId] = bool;
                }
            }
            if (type === 'D') {
                const value = reference.current.value;
                if (originalValues[fieldId] !== undefined) {
                    if (originalValues[fieldId] !== value)
                        update[fieldId] = value;
                } else if (value !== '') {
                    add[fieldId] = value;
                }
            }
        });
        const { params } = this.props.match;
        if (checkIfObjIsEmpty(update, add)) {
            return;
        }
        const body = { data: { clinicalEventId: params.ceId, update, add }, type: 'clinicalEvent', patientId: params.patientId };

        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(alterDataCall(body, () => {
                this.originalValues = Object.assign({}, this.originalValues, add);
            }));
        });
    }

    render() {
        const { patientProfile, match } = this.props;
        const { params } = match;
        if (!patientProfile.fetching) {
            const visitsMatched = patientProfile.data.clinicalEvents.filter(visit => visit.id === parseInt(params.ceId, 10));
            if (visitsMatched.length !== 1) {
                return <>
                    <div className={scaffold_style.ariane}>
                        <h2>CLINICAL EVENT RESULTS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={scaffold_style.panel}>
                        <i>We could not find the event that you are looking for.</i>
                    </div>
                </>;
            }
            const { fields } = this.props;
            const relevantFields = fields.clinicalEventFields.filter(el => (el.referenceType === visitsMatched[0].type));
            const fieldTree = createLevelObj(relevantFields);
            const inputTypeHash = fields.inputTypes.reduce((a, el) => { a[el.id] = el.value; return a; }, {});
            this.originalValues = visitsMatched[0].data.reduce((a, el) => { a[el.field] = el.value; return a; }, {});
            if (this.references !== null && this.state.refreshReferences === true)
                return null;
            if (this.references === null)
                this.references = relevantFields.reduce((a, el) => { a[el.id] = { ref: React.createRef(), type: inputTypeHash[el.type] }; return a; }, {});
            return (
                <>
                    <div className={scaffold_style.ariane}>
                        <h2>CLINICAL EVENT RESULTS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    {Object.entries(fieldTree).length > 0 ?
                        <div className={`${scaffold_style.panel} ${style.topLevelPanel}`}>
                            <form onSubmit={this._handleSubmit} className={style.form}>
                                <div className={style.levelBody}>
                                    {Object.entries(fieldTree).map(mappingFields(inputTypeHash, this.references, this.originalValues))}
                                </div><br />
                                <button type='submit'>Save</button>
                            </form>
                        </div>
                        :
                        <div className={scaffold_style.panel}>
                            <i>There are no contextual data to record for this type of event. Please use the central panel to edit related symptoms and signs.</i>
                        </div>
                    }
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}