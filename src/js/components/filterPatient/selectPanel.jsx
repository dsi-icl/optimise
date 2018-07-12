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
        const style = {
            backgroundColor: '#fcfcfc',
            width: '90%',
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 7,
            marginLeft: 'auto',
            marginRight: 'auto',
            minHeight: '8em'
        }
        return (
            <div className='selectbox' style={style} onDrop={drop_handler} onDragOver={dragover_handler}></div>
        )
    }
}

export class FilterPanel extends Component {
    render() {
        return (
            <div>
                <h2>FILTER PATIENTS</h2>
                <span style={{ display: 'block', width: '90%', margin: '0 auto' }}>Refine your criteria:</span>
                <DragBox />
                <DragBox />
            </div>
        )
    }
}