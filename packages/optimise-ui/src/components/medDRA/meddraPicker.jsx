import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreePicker from '../treePicker';

@connect(state => ({
    hash: state.availableFields.meddra_Hash[0],
    tree: state.availableFields.meddra_Tree
}))
export class MeddraPicker extends Component {

    render() {
        return (
            <TreePicker {...this.props} />
        );
    }
}