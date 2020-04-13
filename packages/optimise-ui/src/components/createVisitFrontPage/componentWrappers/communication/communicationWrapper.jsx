import React, { Component } from 'react';
import override_style from '../overrideStyle.module.css';
import EditCommunication from '../../../editMedicalElements/editCommunication';

export class CommunicationWrapper extends Component {
    render() {
        return <EditCommunication match={this.props.match} location={this.props.location} override_style={override_style}/>;
    }
}