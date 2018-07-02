import React, { Component } from 'react';

export class Button extends Component {
    render() {
        return <div className={this.props.className} onClick={this.props.clicked}>{this.props.text}</div>
    }
}