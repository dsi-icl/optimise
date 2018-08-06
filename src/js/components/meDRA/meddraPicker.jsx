import React, { Component } from 'react';
import { connect } from 'react-router-dom';
import { TreeSelect, TreeNode } from 'antd';
import { treeDataForAntd } from './meddraArrForAntd';
import style from './meddra.module.css';


/* Usage: <MeddraPicker key={key} value={value} onChange={onchange}/>;
key must be present and unique (and generated from url id) so component remounts when url changes;
also need to pass an onChange handler from parent to change the parent's state */
@connect(state => ({meddra: state.availableFields.allMeddra}))
export class MeddraPicker extends Component {
    state = {
        treeData: undefined
    }

    componentDidMount() {
        const { meddra } = this.props;
        const { topLevelNodes } = meddra.filter(el => el.parent === null);
        this.setState({ treeData: topLevelNodes });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });
    }

    onChange = () => {
        this.props.onChange(/* */);
    }

    onLoadData = treeNode => {
        return;
    }

    render() {
        return (
            <div className={style.wrapper}>  {/* this div must be here for the positioning of the drop down menu with scrolling */}
                <TreeSelect
                    style={{ width: 300 }}
                    value={this.props.value}
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                    treeData={treeDataForAntd}
                    placeholder="Please select"
                    onChange={this.onChange}
                    getPopupContainer={ev => ev.parentElement}
                />
            </div>
        );
    }
}