import React, {Component} from 'react';
import css from '../../css/searchPatientsById.css.js';
import {Button} from './sharedComponents.jsx'; 
import Radium from 'radium';

export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = {searchString: '', searchResult: []};
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleKeyStroke(ev){
        this.setState({searchString: ev.target.value});
        if (ev.target.value !== ''){
            fetch(`/api/patients?id=${ev.target.value}`, {
                mode: 'cors',
                headers: {'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb'}   //change later
                })
                .then(res => res.json())
                .then(json => {this.setState({searchResult: json})})
                .catch(e => console.log(e))
        } else {
            this.setState({searchResult: []});
        }
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    render(){
        return(
            <div>
                <h2>SEARCH FOR / CREATE A PATIENT</h2>
                <form  style={css.searchBar}>
                    Enter Patient ID: <input type='text' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey}/>
                </form>
                <SearchResultForPatients listOfPatients={this.state.searchResult} searchString={this.state.searchString}/>
            </div>
        );
    }
}

class SearchResultForPatients extends Component {
    render() {
        return (
            <div>
            {this.props.listOfPatients.filter(el => el['alias_id'] === this.props.searchString).length === 0 && this.props.searchString !== '' ? <Button text={`Create patient ${this.props.searchString}`} style={css.createPatientButton}/> : null}
            {this.props.listOfPatients.map(el => {
                const ind = el['alias_id'].indexOf(this.props.searchString);
                const name = <span>{el['alias_id'].substring(0, ind)}<b>{el['alias_id'].substring(ind, this.props.searchString.length+ind)}</b>{el['alias_id'].substring(this.props.searchString.length+ind, el['alias_id'].length)}</span>;
                return <div style={css.patientBanner} key={el.patientId}>ID: {name} Study: {el.study} <br/> DOB: {el.DOB ? el.DOB : 'N/A'}  Gender: {el.gender ? el.DOB : 'N/A'}</div>
                })}
            </div>
        );
    }
}

SearchResultForPatients = Radium(SearchResultForPatients);
