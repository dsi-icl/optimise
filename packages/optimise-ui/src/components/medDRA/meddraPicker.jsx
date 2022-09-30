import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreePicker from '../treePicker';

@connect(state => ({
    hash: state.availableFields.meddra_Hash[0],
    tree: state.availableFields.meddra_Tree
    }))
class MeddraPicker extends Component {

    render() {
        return (
            <TreePicker {...this.props} formatter={(node) => <><b>{node.code}&nbsp;</b>{node.name}</>} />
        );
    }
}

export {MeddraPicker};