import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPatientProfileById, searchPatientByIdAPICall, searchPatientByIdRequest } from '../../redux/actions/searchPatientById';
import store from '../../redux/store';
import style from './searchPatient.module.css';

@connect(state => ({ data: state.searchPatientById }))
export default class SearchPatientsById extends Component {
    constructor() {
        super();
        this.state = { searchString: '' };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    _handleKeyStroke(ev) {
        this.setState({ searchString: ev.target.value });
        if (ev.target.value !== '') {
            store.dispatch(searchPatientByIdRequest(ev.target.value));
            store.dispatch(searchPatientByIdAPICall(ev.target.value));
        } else {
            store.dispatch(searchPatientByIdRequest(ev.target.value));
        }
    }

    _handleEnterKey(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
        }
    }

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <h2>Patient Search</h2>
                </div>
                <div className={style.panel}>
                    <form>
                        <label htmlFor='searchTerm'>Enter Patient ID:</label><br />
                        <input type='text' name='searchTerm' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey} />
                    </form><br />
                    <SearchResultForPatients listOfPatients={this.props.data.result} searchString={this.state.searchString} />
                </div>
            </>
        );
    }
}
@connect(null, dispatch => ({
    fetchPatientProfile: patientName => dispatch(getPatientProfileById(patientName))
}))
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
                {this.props.listOfPatients.filter(el => el['aliasId'] === this.props.searchString).length === 0 && this.props.searchString !== '' ?
                    <Link to={`/createPatient/${this.props.searchString}`} >
                        <button>
                            {`Create patient ${this.props.searchString}`}
                        </button>
                    </Link>
                    : null}
                {this.props.listOfPatients.map(el => {
                    const ind = el['aliasId'].indexOf(this.props.searchString);
                    const name = (
                        <span>
                            <b>
                                {el['aliasId'].substring(0, ind)}
                                <span className={style.matchedString}>
                                    {el['aliasId'].substring(ind, this.props.searchString.length + ind)}
                                </span>
                                {el['aliasId'].substring(this.props.searchString.length + ind, el['aliasId'].length)}
                            </b>
                        </span>
                    );
                    return (
                        <Link key={el['aliasId']} to={`/patientProfile/${el['aliasId']}`} >
                            <div onClick={this._handleClickWrapper(el['aliasId'])} className={style.patientBanner} key={el.patientId}>
                                {name} in {el.study}
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }
}