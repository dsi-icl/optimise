import React, { Component } from 'react';
import { connect } from 'react-redux';
import cssButtons from '../../../css/buttons.module.css';

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}
@connect(state => ({ fields: state.availableFields }))
export class Fields extends Component {
    render() {
        const { visitFields } = this.props.fields;
        return (
            <div>
                {visitFields.map(el => <div id={`field${el.id}`} draggable='true' onDragStart={drag} key={el.id} className={cssButtons.patientBanner} >{el.definition}</div>)}
            </div>
        );
    }
}