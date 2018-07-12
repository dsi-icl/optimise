import React, { Component } from 'react';
import cssButtons from '../../../css/buttons.module.css';
import cssInputs from '../../../css/inputfields.module.css';
import { connect } from 'react-redux';
import { getPatientProfileById } from '../../redux/actions/searchPatientById';
import { Link } from 'react-router-dom';

export class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = { searchString: '', searchResult: [] };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleKeyStroke(ev) {
        this.setState({ searchString: ev.target.value });
        if (ev.target.value !== '') {
            fetch(`/patients?id=${ev.target.value}`, {
                mode: 'cors',
                headers: { 'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }   //change later
            })
                .then(res => res.json())
                .then(json => { this.setState({ searchResult: json }); })
                .catch(() => { this.setState({ searchResult: [{ 'aliasId': 'not found' }] }); });   // what if the server fails
        } else {
            this.setState({ searchResult: [] });
        }
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    render() {
        return (
            <div style={{ backgroundColor: '#E7E5E6' }}>
                <h2>SEARCH FOR / CREATE A PATIENT</h2>
                <form className={cssInputs.searchBar}>
                    Enter Patient ID: <br /><input className={cssInputs.searchBarInput} style={{ backgroundColor: 'white' }} type='text' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey} />
                </form>
                <SearchResultForPatients listOfPatients={this.state.searchResult} searchString={this.state.searchString} />
            </div>
        );
    }
}
@connect(null, dispatch => ({ fetchPatientProfile: patientName => dispatch(getPatientProfileById(patientName)) }))
export class SearchResultForPatients extends Component {
    constructor() {
        super();
        this._handleClickWrapper = this._handleClickWrapper.bind(this);
    }

    _handleClickWrapper(patientName) {
        return () => {
            this.props.fetchPatientProfile(patientName);
        };
    }

    render() {
        return (
            <div>
                {this.props.listOfPatients.filter(el => el['aliasId'] === this.props.searchString).length === 0 && this.props.searchString !== '' ? <Link to={`/createPatient/${this.props.searchString}`} style={{ color: 'rgba(0,0,0,0)' }} className><div className={cssButtons.createPatientButton}>{`Create patient ${this.props.searchString}`}</div></Link> : null}
                {this.props.listOfPatients.map(el => {
                    const ind = el['aliasId'].indexOf(this.props.searchString);
                    const name = <span><b>{el['aliasId'].substring(0, ind)}<span className={cssButtons.matchedString}>{el['aliasId'].substring(ind, this.props.searchString.length + ind)}</span>{el['aliasId'].substring(this.props.searchString.length + ind, el['aliasId'].length)}</b></span>;
                    return (<Link to={`/patientProfile/${el['aliasId']}`} style={{ color: 'rgba(0,0,0,0)' }}>
                        <div onClick={this._handleClickWrapper(el['aliasId'])} className={cssButtons.patientBanner} key={el.patientId}>
                            {name} in {el.study}
                        </div>
                    </Link>);
                })}
            </div>
        );
    }
}