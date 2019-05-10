import React, { Component } from 'react';
import Tree, { renderers } from 'react-virtualized-tree';
import wideStyle from './treePicker.module.css';

const { Expandable } = renderers;

const filterNodes = (filter, nodes) =>
    nodes.reduce((filtered, n) => {
        const { nodes: filteredChildren } = n.children ? filterNodes(filter, n.children) : { nodes: [] };
        return !(filter(n) || filteredChildren.length) ? filtered : {
            nodes: [
                ...filtered.nodes,
                {
                    ...n,
                    children: filteredChildren,
                    state: {
                        ...n.state,
                        expanded: true
                    }
                },
            ]
        };
    }, { nodes: [] });

const nameMatchesSearchTerm = searchTerm => ({ name, code }) => {
    const upperCaseName = name.toUpperCase();
    const upperCaseCode = code.toUpperCase();
    const upperCaseSearchTerm = searchTerm.toUpperCase();

    return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1 || upperCaseCode.indexOf(upperCaseSearchTerm.trim()) > -1;
};

const debounce = (func, wait, immediate) => {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
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
                nodes: tree,
                nodesOrigin: tree,
            });
        } else if (hash[value] === undefined || hash[value].deleted === '1') {
            this.state = ({
                ...state,
                nodes: tree,
                nodesOrigin: tree,
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
                nodes: origin,
                nodesOrigin: origin,
                currentTermName: hash[value].name
            });
        }
        this.setFilterTerm = debounce(this.setFilterTerm, 500);
    }

    handleChange = nodes => {
        this.setState({ nodes });
    };

    handleInputFocus = ev => {
        ev.preventDefault();
        this.setState({
            opened: true
        }, () => {
            this.searchField.focus();
        });
    }

    handleMouseLeave = __unused__ev => {
        this.setState(ps => ({
            opened: false,
            nodes: ps.nodesOrigin,
            filterText: '',
        }));
        this.setFilterTerm();
    }

    nodeSelectionHandler = (__unused__nodes, updatedNode) => {
        this.props.onChange(updatedNode.id === undefined ? null : updatedNode.id);
        this.setState(ps => ({
            opened: false,
            nodes: ps.nodesOrigin,
            filterText: '',
            currentTermName: updatedNode.name,
        }));
        this.setFilterTerm();
        return this.state.nodesOrigin;
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

    searchHighlighter(htmlText) {
        const searchString = this.state.filterText;
        return React.Children.map(htmlText, (child) => {
            if (typeof child === 'string') {
                const ind = child.toLowerCase().indexOf(searchString.toLowerCase());
                if (ind >= 0)
                    return (
                        <>
                            {child.substring(0, ind)}
                            <span className={wideStyle.matchedString}>
                                {child.substring(ind, searchString.length + ind)}
                            </span>
                            {child.substring(searchString.length + ind, child.length)}
                        </>
                    );
                else
                    return child;
            } else
                return child.props && child.props.children ? React.cloneElement(child, {}, this.searchHighlighter(child.props.children)) : child;
        });
    }

    render() {
        const { formatter = (node) => node.name } = this.props;
        const { currentTermName, filterTerm, filterText, opened, nodes } = this.state;
        const { nodes: filteredNodes } = filterTerm !== '' ? filterNodes(nameMatchesSearchTerm(filterTerm), nodes) : { nodes };

        return (
            <>
                <input type="text" key={currentTermName} defaultValue={currentTermName} onClick={this.handleInputFocus} onKeyDown={e => e.preventDefault()}></input>
                <div className={`${wideStyle.wrapper} ${opened ? '' : wideStyle.hidePicker}`} onMouseLeave={this.handleMouseLeave}>
                    <div className={wideStyle.lookup}>
                        <input ref={(input) => { this.searchField = input; }} value={filterText} onChange={this.handleFilterTextChange} placeholder="Search..." />
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
                                                {this.searchHighlighter(formatter(node))}
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
