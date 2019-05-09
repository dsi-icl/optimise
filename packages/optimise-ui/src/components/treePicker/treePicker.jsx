import React, { Component } from 'react';
import Tree, { renderers } from 'react-virtualized-tree';
import wideStyle from './treePicker.module.css';

const { Expandable } = renderers;

const filterNodes = (filter, nodes) =>
    nodes.reduce((filtered, n) => {
        const { nodes: filteredChildren } = n.children
            ? filterNodes(filter, n.children)
            : { nodes: [] };

        return !(filter(n) || filteredChildren.length)
            ? filtered
            : {
                nodes: [
                    ...filtered.nodes,
                    {
                        ...n,
                        children: filteredChildren,
                    },
                ]
            };
    }, { nodes: [] });

const nameMatchesSearchTerm = searchTerm => ({ name }) => {
    const upperCaseName = name.toUpperCase();
    const upperCaseSearchTerm = searchTerm.toUpperCase();

    return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1;
};
export default class TreePicker extends Component {

    constructor(props) {
        super(props);
        const state = {
            currentTermName: '',
            filterText: '',
            filterTerm: '',
            opened: false
        };
        const { value, hash, tree } = props;
        if (value === undefined || value === null) {
            this.state = ({
                ...state,
                nodes: tree
            });
        } else if (hash[value] === undefined || hash[value].deleted === '1') {
            this.state = ({
                ...state,
                nodes: tree,
                currentTermName: `${hash[value].name} (from previous codings)`
            });
        } else {
            let node = hash[value];
            let path = [];
            path.push(node.id);
            while (node.parent !== null) {
                path.push(node.parent);
                node = hash[node.parent];
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
            let origin = crawl(tree);
            this.state = ({
                ...state,
                nodesOrigin: origin,
                nodes: origin,
                currentTermName: hash[value].name
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
            currentTermName: updatedNode.name,
        });
        return nodes;
    }

    handleInput(event) {
        this.setState({ currentTermName: event.target.value });
    }

    setFilterTerm() {
        this.setState(ps => ({ filterTerm: ps.filterText }));
    }

    handleFilterTextChange = e => {
        const filterText = e.target.value;
        this.setState({ filterText });
        this.setFilterTerm();
    };

    render() {
        const { currentTermName, filterTerm, filterText, opened, nodes } = this.state;
        const { nodes: filteredNodes } = filterTerm ? filterNodes(nameMatchesSearchTerm(filterTerm), nodes) : { nodes };

        return (
            <>
                <input type="text" key={currentTermName} defaultValue={currentTermName} onClick={this.handleInputFocus} onKeyDown={e => e.preventDefault()}></input>
                <div className={`${wideStyle.wrapper} ${opened ? '' : wideStyle.hidePicker}`} onMouseLeave={this.handleMouseLeave}>
                    <div className={wideStyle.lookup}>
                        <input value={filterText} onChange={this.handleFilterTextChange} placeholder="Search..." />
                    </div>
                    <div style={{ height: '40vh' }} className={wideStyle.tree}>
                        <Tree nodes={filteredNodes}
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
