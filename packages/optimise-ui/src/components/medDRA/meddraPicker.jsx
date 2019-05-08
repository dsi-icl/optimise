import React, { Component } from 'react';
import Tree, { renderers, FilteringContainer } from 'react-virtualized-tree';
import { connect } from 'react-redux';
import wideStyle from '../scaffold/pickers.module.css';

const { Expandable } = renderers;

@connect(state => ({
    meddra: state.availableFields.allMeddra,
    meddraHash: state.availableFields.meddra_Hash[0],
    meddraTree: state.availableFields.meddraTree
}))
export class MeddraPicker extends Component {

    constructor(props) {
        super(props);
        const { meddraHash } = props;
        let { value } = props;
        if (value === undefined || value === null) {
            this.state = ({
                nodes: this.props.meddraTree,
                opened: false
            });
        } else if (meddraHash[value] === undefined || meddraHash[value].deleted === '1') {
            this.state = ({
                nodes: this.props.meddraTree,
                currentTerm: value,
                currentTermName: `${meddraHash[value].name} (from previous MedDRA codings)`,
                opened: false
            });
        } else {
            let tree = this.props.meddraTree;
            let node = meddraHash[value];
            let path = [];
            path.push(node.id);
            while (node.parent !== null) {
                path.push(node.parent);
                node = meddraHash[node.parent];
            }
            const crawl = (nodeArray) => {
                let target = path.pop();
                return nodeArray.map(el => {
                    if (el.id !== target)
                        return el;
                    return {
                        ...el,
                        children: el.children ? crawl(el.children) : undefined,
                        state: {
                            ...el.state,
                            expanded: true
                        }
                    };
                });
            };
            this.state = ({
                nodes: crawl(tree),
                currentTerm: value,
                currentTermName: meddraHash[value].name,
                opened: false
            });
        }
    }

    handleChange = nodes => {
        this.setState({ nodes });
    };

    handleInputFocus = __unused__ev => {
        this.setState({
            opened: true
        });
    }

    handleMouseLeave = __unused__ev => {
        this.setState({
            opened: false
        });
    }

    nodeSelectionHandler = (nodes, updatedNode) => {
        this.props.onChange(updatedNode.id === undefined ? null : updatedNode.id);
        this.setState({
            opened: false,
            currentTerm: updatedNode.id,
            currentTermName: updatedNode.name,
        });
        return nodes;
    }

    handleInput(event) {
        this.setState({ currentTermName: event.target.value });
    }

    render() {
        const { currentTermName, opened, nodes } = this.state;
        return (
            <>
                <input type="text" key={currentTermName} defaultValue={currentTermName} onClick={this.handleInputFocus} onKeyDown={e => e.preventDefault()}></input>
                <div className={`${wideStyle.wrapper} ${opened ? '' : wideStyle.hidePicker}`} onMouseLeave={this.handleMouseLeave}>
                    <FilteringContainer nodes={nodes}>
                        {({ nodes }) => (
                            <div style={{ height: '40vh' }} className={wideStyle.tree}>
                                <Tree nodes={nodes}
                                    extensions={{
                                        updateTypeHandlers: {
                                            'SELECT': this.nodeSelectionHandler,
                                        },
                                    }}
                                    onChange={this.handleChange}>
                                    {({ style, node, ...rest }) => {
                                        style.width = undefined;
                                        return (
                                            <div style={style} className={wideStyle.item}>
                                                <Expandable node={node} {...rest} iconsClassNameMap={{
                                                    expanded: wideStyle.expandedNode,
                                                    collapsed: wideStyle.collapsedNode,
                                                    lastChild: wideStyle.lastChildNode,
                                                }}>
                                                    <Selection node={node} {...rest}>
                                                        <b>{node.code}&nbsp;</b>{node.name}
                                                    </Selection>
                                                </Expandable>
                                            </div>
                                        );
                                    }}
                                </Tree>
                            </div>
                        )}
                    </FilteringContainer>
                </div>
                <br />
            </>
        );
    }
}

const Selection = ({ node, children, onChange }) => (
    <span className={wideStyle.noPadding} onClick={() => {
        onChange({
            node,
            type: 'SELECT',
        });
    }} >
        {children}
    </span >
);
