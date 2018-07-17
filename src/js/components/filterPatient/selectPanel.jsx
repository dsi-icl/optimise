import React, { Component } from 'react';

function dragover_handler(ev) {
    ev.preventDefault();
}

function drop_handler(ev) {
    ev.preventDefault();
    if (ev.target.className === 'selectbox') {
        const data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data).cloneNode(true));
    };
}

class DragBox extends Component {
    render() {
        return (
            <div className='selectbox' onDrop={drop_handler} onDragOver={dragover_handler}></div>
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