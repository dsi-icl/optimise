import React, { Component } from 'react';
import Tree, { renderers, FilteringContainer } from 'react-virtualized-tree';
import { connect } from 'react-redux';
import wideStyle from './icd11Picker.module.css';

const { Expandable } = renderers;

let ids = {};

const getUniqueId = () => {
    const candidateId = Math.round(Math.random() * 1000000000);

    if (ids[candidateId]) {
        return getUniqueId();
    }

    ids[candidateId] = true;

    return candidateId;
};

const constructTree = (maxDeepness, maxNumberOfChildren, minNumOfNodes, deepness = 1) => new Array(minNumOfNodes).fill(deepness).map(() => {
    const id = getUniqueId();
    const numberOfChildren = deepness === maxDeepness ? 0 : Math.round(Math.random() * maxNumberOfChildren);

    return {
        id,
        name: `Leaf ${id}`,
        children: numberOfChildren ? constructTree(maxDeepness, maxNumberOfChildren, numberOfChildren, deepness + 1) : [],
        state: {
            expanded: numberOfChildren ? Boolean(Math.round(Math.random())) : false,
            favorite: Boolean(Math.round(Math.random())),
            deletable: Boolean(Math.round(Math.random())),
        },
    };
});
@connect(state => ({
    icd11: state.availableFields.icd11,
    icd11_Hash: state.availableFields.icd11_Hash[0],
    icd11_Tree: state.availableFields.icd11_Tree
}))
export class ICD11Picker extends Component {

    // state = {
    //     nodes: constructTree(5, 10, 1)
    // };

    constructor(props) {
        super(props);
        const { icd11, icd11_Hash } = props;
        let { value } = props;
        if (value === undefined || value === null) {
            const topLevelNodes = icd11.filter(el => el.parent === null && el.deleted === '-');
            this.state = ({ treeData: topLevelNodes, expandedKeys: [], nodes: this.props.icd11_Tree });
            console.log(topLevelNodes, this.state);
        } else if (icd11_Hash[value] === undefined || icd11_Hash[value].deleted === '1') {
            const topLevelNodes = [{ ...icd11_Hash[value], isLeaf: 1, name: `${icd11_Hash[value].name} (from previous MedDRA codings)` }, ...icd11.filter(el => el.parent === null && el.deleted === '-')];

            this.state = ({ treeData: topLevelNodes, expandedKeys: [], nodes: constructTree(3, 3, 1) });
        } else {
            const { icd11_Hash } = this.props;
            const selectedNode = icd11_Hash[value];
            let n = selectedNode;
            let p = n;
            let c; //children
            const findChildrenOf = id => el => el.parent === parseInt(id);
            const findNodeNot = id => el => el.id !== parseInt(id);
            const expandedKeys = [];
            while (n.parent !== null) {
                p = { ...icd11_Hash[n.parent] };   //until n is top level node
                expandedKeys.push(String(p.id));
                c = icd11.filter(findChildrenOf(p.id)).filter(findNodeNot(n.id));
                p.children = [...c, n].sort((a, b) => a.id - b.id);
                n = p;
            }
            const topLevelNodes = icd11.filter(el => el.parent === null && el.deleted === '-' && el.id !== p.id);
            this.state = ({
                expandedKeys,
                treeData: [...topLevelNodes, p].sort((a, b) => a.id - b.id),
                nodes: constructTree(3, 3, 1)
            });
        }
    }

    handleChange = nodes => {
        this.setState({ nodes });
    };

    render() {
        return (
            <div className={wideStyle.wrapper}>
                <FilteringContainer nodes={this.state.nodes}>
                    {({ nodes }) => (
                        <div style={{ height: 500 }} className={wideStyle.tree}>
                            <Tree nodes={nodes} onChange={this.handleChange}>
                                {({ style, node, ...rest }) => {
                                    style.width = undefined;
                                    return (
                                        <div style={style} className={wideStyle.item}>
                                            <Expandable node={node} {...rest} iconsClassNameMap={{
                                                expanded: wideStyle.expandedNode,
                                                collapsed: wideStyle.collapsedNode,
                                                lastChild: wideStyle.lastChildNode,
                                            }}>
                                                {node.code[0] !== 'B' ? <b>{node.code}&nbsp;</b> : null}{node.name}
                                            </Expandable>
                                        </div>
                                    );
                                }}
                            </Tree>
                        </div>
                    )}
                </FilteringContainer>
            </div>
        );
    }
}


// const TreeNode = Tree.TreeNode;

// /* Usage: <MeddraPicker key={key} value={value} onChange={onchange}/>;
// key must be present and unique (and generated from url id) so component remounts when url changes;
// also need to pass an onChange handler from parent to change the parent's state */
// @connect(state => ({
//     icd11: state.availableFields.icd11,
//     icd11_Hash: state.availableFields.icd11_Hash[0]
// }))
// export class ICD11Picker extends Component {
//     constructor(props) {
//         super(props);
//         const { icd11, icd11_Hash } = props;
//         let { value } = props;
//         if (value === undefined || value === null) {
//             const topLevelNodes = icd11.filter(el => el.parent === null && el.deleted === '-');
//             this.state = ({ treeData: topLevelNodes, expandedKeys: [] });
//         } else if (icd11_Hash[value] === undefined || icd11_Hash[value].deleted === '1') {
//             const topLevelNodes = [{ ...icd11_Hash[value], isLeaf: 1, name: `${icd11_Hash[value].name} (from previous MedDRA codings)` }, ...icd11.filter(el => el.parent === null && el.deleted === '-')];

//             this.state = ({ treeData: topLevelNodes, expandedKeys: [] });
//         } else {
//             const { icd11_Hash } = this.props;
//             const selectedNode = icd11_Hash[value];
//             let n = selectedNode;
//             let p = n;
//             let c; //children
//             const findChildrenOf = id => el => el.parent === parseInt(id);
//             const findNodeNot = id => el => el.id !== parseInt(id);
//             const expandedKeys = [];
//             while (n.parent !== null) {
//                 p = { ...icd11_Hash[n.parent] };   //until n is top level node
//                 expandedKeys.push(String(p.id));
//                 c = icd11.filter(findChildrenOf(p.id)).filter(findNodeNot(n.id));
//                 p.children = [...c, n].sort((a, b) => a.id - b.id);
//                 n = p;
//             }
//             const topLevelNodes = icd11.filter(el => el.parent === null && el.deleted === '-' && el.id !== p.id);
//             this.state = ({ expandedKeys, treeData: [...topLevelNodes, p].sort((a, b) => a.id - b.id) });
//         }
//     }


//     onLoadData = treeNode => {
//         const nodeId = treeNode.props.value;
//         const { icd11 } = this.props;
//         const childrenNodes = icd11.filter(el => el.parent === parseInt(nodeId) && el.deleted === '-');
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
//         if (this.props.icd11.length === 0) return <p>No ICD11 code available.</p>;
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