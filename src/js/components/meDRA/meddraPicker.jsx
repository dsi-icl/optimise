import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { treeDataForAntd } from './meddraArrForAntd';

export class MeddraPicker extends Component {
    state = {
        value: undefined,
    }

    onChange = (value) => {
        console.log(value);
        this.setState({ value });
    }

    render() {
        return (
            <TreeSelect
                style={{ width: 300 }}
                value={this.state.value}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={treeDataForAntd}
                placeholder="Please select"
                onChange={this.onChange}
            />
        );
    }
}