import React, { Component } from 'react';

class DragBox extends Component {

    constructor() {
        super();
        this._dragover_handler = this._dragover_handler.bind(this);
        this._drop_handler = this._drop_handler.bind(this);
    }

    _dragover_handler(ev) {
        ev.preventDefault();
    }

    _drop_handler(ev) {
        ev.preventDefault();
        if (ev.target.className === 'selectbox') {
            const data = ev.dataTransfer.getData('text');
            ev.target.appendChild(document.getElementById(data).cloneNode(true));
        }
    }

    render() {
        return (
            <div className='selectbox' onDrop={this.drop_handler} onDragOver={this.dragover_handler}></div>
        );
    }
}

export class FilterPanel extends Component {
    render() {
        return (
            <div>
                <h2>FILTER PATIENTS</h2>
                <span >Refine your criteria:</span>
                <DragBox />
                <DragBox />
            </div>
        );
    }
}