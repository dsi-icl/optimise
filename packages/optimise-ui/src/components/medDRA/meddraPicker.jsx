import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './meddra.module.css';

export class MeddraPicker extends Component {
    render() {
        return <div>Pending rewrite</div>
    }
}

// const TreeNode = Tree.TreeNode;

// /* Usage: <MeddraPicker key={key} value={value} onChange={onchange}/>;
// key must be present and unique (and generated from url id) so component remounts when url changes;
// also need to pass an onChange handler from parent to change the parent's state */
// @connect(state => ({
//     meddra: state.availableFields.allMeddra,
//     meddraHash: state.availableFields.meddra_Hash[0]
// }))
// export class MeddraPicker extends Component {
//     constructor(props) {
//         super(props);
//         const { meddra, meddraHash } = props;
//         let { value } = props;
//         if (value === undefined || value === null) {
//             const topLevelNodes = meddra.filter(el => el.parent === null && el.deleted === '-');
//             this.state = ({ treeData: topLevelNodes, expandedKeys: [] });
//         } else if (meddraHash[value] === undefined || meddraHash[value].deleted === '1') {
//             const topLevelNodes = [{ ...meddraHash[value], isLeaf: 1, name: `${meddraHash[value].name} (from previous MedDRA codings)` }, ...meddra.filter(el => el.parent === null && el.deleted === '-')];

//             this.state = ({ treeData: topLevelNodes, expandedKeys: [] });
//         } else {
//             const { meddraHash } = this.props;
//             const selectedNode = meddraHash[value];
//             let n = selectedNode;
//             let p = n;
//             let c; //children
//             const findChildrenOf = id => el => el.parent === parseInt(id);
//             const findNodeNot = id => el => el.id !== parseInt(id);
//             const expandedKeys = [];
//             while (n.parent !== null) {
//                 p = { ...meddraHash[n.parent] };   //until n is top level node
//                 expandedKeys.push(String(p.id));
//                 c = meddra.filter(findChildrenOf(p.id)).filter(findNodeNot(n.id));
//                 p.children = [...c, n].sort((a, b) => a.id - b.id);
//                 n = p;
//             }
//             const topLevelNodes = meddra.filter(el => el.parent === null && el.deleted === '-' && el.id !== p.id);
//             this.state = ({ expandedKeys, treeData: [...topLevelNodes, p].sort((a, b) => a.id - b.id) });
//         }
//     }


//     onLoadData = treeNode => {
//         const nodeId = treeNode.props.value;
//         const { meddra } = this.props;
//         const childrenNodes = meddra.filter(el => el.parent === parseInt(nodeId) && el.deleted === '-');
//         return new Promise(resolve => {
//             treeNode.props.dataRef.children = childrenNodes;
//             const newState = [...this.state.treeData];
//             this.setState({
//                 treeData: newState
//             });
//             resolve();
//         });
//     }

//     renderTreeNodes = data => data.map((item) => {
//         if (item.children) {
//             return (
//                 <TreeNode title={item.name} key={String(item.id)} value={String(item.id)} dataRef={item} isLeaf={item.isLeaf === 0 ? false : true}>
//                     {this.renderTreeNodes(item.children)}
//                 </TreeNode>
//             );
//         }
//         return <TreeNode title={item.name} key={String(item.id)} value={String(item.id)} dataRef={item} isLeaf={item.isLeaf === 0 ? false : true} />;
//     })

//     onChange = value => {
//         this.props.onChange(value === undefined ? null : value);
//     }

//     render() {
//         if (this.props.meddra.length === 0) return <p>No MedDra coding available. Admin can upload codings in settings if there is a subscription.</p>;
//         let { value } = this.props;
//         value = value ? `${value}` : undefined;
//         return (
//             <div className={style.wrapper}>  {/* this div must be here for the positioning of the drop down menu with scrolling */}
//                 <TreeSelect
//                     allowClear
//                     defaultValue={undefined}
//                     showLine={true}
//                     loadData={this.onLoadData}
//                     dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
//                     style={{ width: '100%' }}
//                     getPopupContainer={ev => ev.parentElement}
//                     value={value}
//                     onChange={this.onChange}
//                     treeDefaultExpandedKeys={this.state.expandedKeys}
//                 >
//                     {this.renderTreeNodes(this.state.treeData)}
//                 </TreeSelect>
//             </div>
//         );
//     }
// }