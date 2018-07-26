import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import Icon from '../icon';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './dataPage.module.css';


export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} title='Close' className={scaffold_style.backButton}>&#10006;</Link>
        );
    }
}

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
        console.log('REFS', this.state.selectorRef.current.value, this.state.boolRef.current.checked, this.state.inputRef.current.value);
    }

    render() {
        const { patientProfile, match } = this.props;
        if (!patientProfile.fetching) {
            const visitsMatched = patientProfile.data['visits'].filter(visit => visit.id === parseInt(match.params.visitId, 10));
            if (visitsMatched.length !== 1) {
                return <div>{'Cannot find your visit!'}</div>;
            }
            const { fields } = this.props;
            const relevantFields = fields.visitFields.filter(el => el.referenceType === visitsMatched[0].type);
            ////make the tree///
            return (
                <>
                    <div className={scaffold_style.ariane}>
                        <h2>Visit data</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={scaffold_style.panel}>
                        <form onSubmit={this._handleSubmit}>
                            <input type='submit' value='Save'/>
                        </form>
                    </div>
                </>
            );
        } else {
            return <div><Icon symbol='loading'/></div>;
        }
    }
}


class DataForm extends Component {
}
