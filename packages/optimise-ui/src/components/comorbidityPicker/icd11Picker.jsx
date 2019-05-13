import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreePicker from '../treePicker';

@connect(state => ({
    hash: state.availableFields.icd11_Hash[0],
    tree: state.availableFields.icd11_Tree
}))
export class ICD11Picker extends Component {

    render() {
        return (
            <TreePicker {...this.props} formatter={(node) => <><b>{node.code[0] === 'B' ? '' : node.code}&nbsp;</b>{node.name}</>} />
        );
    }
}
