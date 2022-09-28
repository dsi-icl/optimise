import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({
    fields: state.availableFields
    }))
export class Fields extends Component {

    constructor() {
        super();
        this._drag = this._drag.bind(this);
    }

    _drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    render() {
        const { visitFields } = this.props.fields;
        return (
            <div>
                {visitFields.map(el => <div id={`field${el.id}`} draggable='true' onDragStart={this.drag} key={el.id}>{el.definition}</div>)}
            </div>
        );
    }
}