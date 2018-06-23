import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({ fields: state.availableFields }))
export class Fields extends Component {
    render() {
        const { visitFields } = this.props.fields;
        const style = {
            width: '80%',
            borderRadius: 10,
            marginLeft: 'auto',
            marginRight: 'auto'
        };
        return (
            <div>
                {visitFields.map(el => <div key={el.id} className='patientBanner' style={style}>{el.definition}</div>)}
            </div>
        )
    }
}