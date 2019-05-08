import React, { Component } from 'react';
import Tree, { renderers, FilteringContainer } from 'react-virtualized-tree';
import { connect } from 'react-redux';
import wideStyle from './icd11Picker.module.css';

const { Expandable } = renderers;

@connect(state => ({
    icd11: state.availableFields.icd11,
    icd11_Hash: state.availableFields.icd11_Hash[0],
    icd11_Tree: state.availableFields.icd11_Tree
}))
export class ICD11Picker extends Component {

    constructor(props) {
        super(props);
        const { icd11_Hash } = props;
        let { value } = props;
        if (value === undefined || value === null) {
            this.state = ({
                nodes: this.props.icd11_Tree,
                opened: false
            });
        } else if (icd11_Hash[value] === undefined || icd11_Hash[value].deleted === '1') {
            this.state = ({
                nodes: this.props.icd11_Tree,
                currentTerm: value,
                currentTermName: `${icd11_Hash[value].name} (from previous ICD codings)`,
                opened: false
            });
        } else {
            let tree = this.props.icd11_Tree;
            let node = icd11_Hash[value];
            let path = [];
            path.push(node.id);
            while (node.parent !== null) {
                path.push(node.parent);
                node = icd11_Hash[node.parent];
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
                currentTermName: icd11_Hash[value].name,
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