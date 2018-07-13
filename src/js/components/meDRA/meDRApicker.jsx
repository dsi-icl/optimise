import React, { Component } from 'react';
import { searchMedDRAAPICall } from '../../redux/actions/MedDRA.js';
import { connect } from 'react-redux';
import store from '../../redux/store.js';

/**
 * @class SuggestionInput
 * @prop {Array} this.props.result - from store
 * @prop {REF} this.props.myRef
 */

@connect(state => ({ result: state.meddra.result }))
export class SuggestionInput extends Component {
    constructor() {
        super();
        this.state = { value: '' };
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    _handleKeyPress(ev) {
        store.dispatch(searchMedDRAAPICall(ev.target.value));
        this.setState({
            value: ev.target.value
        });
    }

    render() {
        return (
            <div>
                <input type='text' ref={this.props.reference} onChange={this._handleKeyPress} value={this.state.value} list='datalist' />
                <datalist id='datalist'>
                    {this.props.result.map(el => <option key={el.id} value={el.name} />)}
                </datalist>
            </div>
        );
    }
}