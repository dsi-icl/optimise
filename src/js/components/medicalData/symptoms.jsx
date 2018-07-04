import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingIcon } from '../../../statics/svg/icons.jsx';
import cssIcons from '../../../css/icons.css';
import cssButtons from '../../../css/buttons.css';

function mapStateToProps(state) {
    return {
        patientId: state.patientProfile.data.patientId,
        fetching: state.patientProfile.fetching,
        fields: state.availableFields.visitFields
    }
}

@connect(mapStateToProps)
export class SymptomPage extends Component {
    render() {
        return <div>
            {this.props.fields.slice(6).map(field => <span>{field.definition}</span>)}
        </div>;
    }
}