import React, { Component } from 'react';

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
            minHeight: '10em',
            overflow: 'auto'
        }
        return (
            <div style={style}></div>
        )
    }
}

export class FilterPanel extends Component {
    render() {
        return (
            <div>
                <h2>FILTER PATIENTS</h2>
                <span style={{ display: 'block', width: '90%', margin: '0 auto' }}>Refine your criteria:</span>
                <DragBox/>
                <DragBox/>
            </div>
        )
    }
}