import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPatientProfileById, searchPatientAPICall, searchPatientRequest, searchPatientClear } from '../../redux/actions/searchPatient';
import store from '../../redux/store';
import style from './searchPatient.module.css';

@connect(state => ({ data: state.searchPatient }))
export default class SearchPatientsById extends Component {
    constructor(props) {
        super(props);
        this.state = { searchString: props.data.currentSearch || '' };
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    componentDidMount() {
        if (this.props.data.currentSearch !== undefined && this.props.data.currentSearch !== null && this.props.data.currentSearch !== '') {
            store.dispatch(searchPatientAPICall(this.props.data.currentSearch));
        }
    }

    componentWillUnmount() {
        store.dispatch(searchPatientClear());
    }

    _handleKeyStroke(ev) {
        this.setState({ searchString: ev.target.value });
        if (ev.target.value !== '') {
            store.dispatch(searchPatientAPICall(ev.target.value));
        } else {
            store.dispatch(searchPatientRequest(ev.target.value));
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
                    <span>Search you dataset by entering your criteria in the box below.</span><br /><br />
                    <form>
                        <label htmlFor='searchTerm'>By patient ID:</label><br />
                        <input type='text' name='searchTerm' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey} autoComplete="off" />
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
    render() {
        const { searchString, listOfPatients } = this.props;
        return (
            <div className={style.searchResultWrapper}>
                {listOfPatients.filter(el => el['aliasId'] === searchString).length === 0 && searchString !== '' ?
                    <Link to={`/createPatient/${searchString}`} className={style.searchItem}>
                        <div>
                            <span className={style.createPatientSign}>&#43;</span><br />
                            <span className={style.createPatientText}>{`Create patient ${searchString}`}</span>
                        </div>
                    </Link>
                    : null}
                {listOfPatients.map(el => <PatientButton key={el.patientId} data={el} searchString={searchString} />)}
            </div>
        );
    }
}

/*  receives prop 'data' as one patient; and seachString*/
class PatientButton extends PureComponent {
    render() {
        const { data, searchString } = this.props;
        const ind = data.aliasId.indexOf(searchString);
        const styledName = (
            <span>
                <b>
                    {data.aliasId.substring(0, ind)}
                    <span className={style.matchedString}>
                        {data.aliasId.substring(ind, searchString.length + ind)}
                    </span>
                    {data.aliasId.substring(searchString.length + ind, data.aliasId.length)}
                </b>
            </span>
        );
        return (
            <Link key={data.aliasId} to={`/patientProfile/${data.aliasId}`} className={style.searchItem} >
                <div>
                    {styledName} <br /><br />
                    study: {data.study} <br />
                    consent: {String(data.consent)}
                </div>
            </Link>
        );
    }
}