import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditComorbidity from '../../../editMedicalElements/editComorbidity';

export class ComorbidityWrapper extends Component {
    render() {
        return <EditComorbidity match={this.props.match} location={this.props.location} override_style={override_style}/>;
    }
}