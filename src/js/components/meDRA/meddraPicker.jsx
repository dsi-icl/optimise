import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TreeSelect, Tree } from 'antd';
import 'antd/lib/tree-select/style/css';
import './override.css';
import style from './meddra.module.css';
const TreeNode = Tree.TreeNode;

/* Usage: <MeddraPicker key={key} value={value} onChange={onchange}/>;
key must be present and unique (and generated from url id) so component remounts when url changes;
also need to pass an onChange handler from parent to change the parent's state */
@connect(state => ({ meddra: state.availableFields.allMeddra }))
export class MeddraPicker extends Component {
    state = {
        treeData: [],
        originalValue: undefined
    }

    componentDidMount() {
        const { meddra, originalValue } = this.props;
        const topLevelNodes = meddra.filter(el => el.parent === null);
        this.setState({ treeData: topLevelNodes, originalValue });
    }


    onLoadData = treeNode => {
        const nodeId = treeNode.props.value;
        const { meddra } = this.props;
        const childrenNodes = meddra.filter(el => el.parent === parseInt(nodeId));
        return new Promise(resolve => {
            treeNode.props.dataRef.children = childrenNodes;
            const newState = [...this.state.treeData];
            this.setState({
                treeData: newState
            });
            resolve();
        });
    }

    renderTreeNodes = data => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} value={String(item.id)} dataRef={item} isLeaf={item.isLeaf === 0 ? false : true}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.id} value={String(item.id)} dataRef={item} isLeaf={item.isLeaf === 0 ? false : true}/>;
        });
    }

    onChange = value => {
        this.props.onChange(value);
    }

    render() {
        return (
            <div className={style.wrapper}>  {/* this div must be here for the positioning of the drop down menu with scrolling */}
                <TreeSelect
                    loadData={this.onLoadData}
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                    style={{ width: 300 }}
                    getPopupContainer={ev => ev.parentElement}
                    placeholder="Select MedDRA coding"
                    value={this.props.originalValue}
                    onChange={this.onChange}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </TreeSelect>
            </div>
        );
    }
}