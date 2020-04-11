import React, { Component } from 'react';
import override_style from './overrideStyle.module.css';
import scaffold_style from './scaffoldStyle.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

@withRouter
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data
}))
export class CeWrapper extends Component {
    render() {
        return <div className={scaffold_style.wrapper}>
            <div className={scaffold_style.create_element_panel}>
            </div>
            <div className={scaffold_style.edit_element_panel}>
            </div>
            <div className={scaffold_style.list_element_panel}>
            </div>
        </div>;
    }
}
