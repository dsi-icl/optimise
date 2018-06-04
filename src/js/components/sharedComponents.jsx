import React, {Component} from 'react';

export class Button extends Component {
    constructor() {
        super();
    }

    render() {
        return <div style={this.props.style}>{this.props.text}</div>
    }
}