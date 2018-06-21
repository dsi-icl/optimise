import React, { Component } from 'react';
import css from '../../../css/searchPatientsById.css.js';
import { Button } from '../sharedComponents.jsx'; 
import Radium from 'radium';
import { connect } from 'react-redux';
import { clickedCreatePatient } from '../../redux/actions/createPatient';
import { getPatientProfileById } from '../../redux/actions/searchPatientById';
import { Link } from 'react-router-dom';

export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = { searchString: '', searchResult: [] };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleKeyStroke(ev){
        this.setState({ searchString: ev.target.value });
        if (ev.target.value !== ''){
            fetch(`/api/patients?id=${ev.target.value}`, {
                mode: 'cors',
                headers: { 'token': 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb' }   //change later
            })
                .then(res => res.json())
                .then(json => { this.setState({ searchResult: json }) })
                .catch(e => { console.log(e); this.setState({ searchResult: [{ 'alias_id': 'not found' }] }) })   // what if the server fails
        } else {
            this.setState({ searchResult: [] });
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
                    Enter Patient ID: <br/><input style={css.searchBarInput} type='text' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey}/>
                </form>
                <SearchResultForPatients listOfPatients={this.state.searchResult} searchString={this.state.searchString}/>
            </div>
        );
    }
}

class SearchResultForPatients_toConnect extends Component {
    constructor() {
        super();
        this._handleClickWrapper = this._handleClickWrapper.bind(this);
        this._handleClickCreate = this._handleClickCreate.bind(this);
    }

    _handleClickWrapper(patientName) {
        return (ev) => {
            this.props.fetchPatientProfile(patientName);
        }
    }

    _handleClickCreate(patientName) {
        return (ev) => {
            this.props.clickedCreatePatient(patientName);
        }
    }

    render() {
        return (
            <div>
                {this.props.listOfPatients.filter(el => el['alias_id'] === this.props.searchString).length === 0 && this.props.searchString !== '' ? <Link to='/createPatient' style={{ color: 'rgba(0,0,0,0)' }}><Button text={`Create patient ${this.props.searchString}`} style={css.createPatientButton} clicked={this._handleClickCreate(this.props.searchString)}/></Link> : null}
                {this.props.listOfPatients.map(el => {
                    const ind = el['alias_id'].indexOf(this.props.searchString);
                    const name = <span>{el['alias_id'].substring(0, ind)}<b>{el['alias_id'].substring(ind, this.props.searchString.length+ind)}</b>{el['alias_id'].substring(this.props.searchString.length+ind, el['alias_id'].length)}</span>;
                    return (<Link to={`/patientProfile/${el['alias_id']}`} style={{ color: 'rgba(0,0,0,0)' }}>
                        <div onClick={this._handleClickWrapper(el['alias_id'])} style={css.patientBanner} key={el.patientId}>
                            {name} in {el.study} <br/>{el.DOB ? el.DOB : 'DOB unavailable'}  {el.gender ? el.DOB : 'Gender unavailable'}
                        </div>
                    </Link>);
                })}
            </div>
        );
    }
}

SearchResultForPatients_toConnect = Radium(SearchResultForPatients_toConnect);
const SearchResultForPatients = connect(null, dispatch => ({ fetchPatientProfile: patientName => dispatch(getPatientProfileById(patientName)), clickedCreatePatient: patientId => dispatch(clickedCreatePatient(patientId)) }))(SearchResultForPatients_toConnect);

