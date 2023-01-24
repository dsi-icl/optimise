import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '../icon';
import Helmet from '../scaffold/helmet';
import { getPatientProfileById, searchPatientAPICall, searchPatientClear } from '../../redux/actions/searchPatient';
import store from '../../redux/store';
import style from './searchPatient.module.css';

@connect(state => ({
    data: state.searchPatient,
    adminPriv: state.login.adminPriv
    }))
class SearchPatientsById extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: props.data.currentSearchType || '',
            searchString: props.data.currentSearchString || ''
        };
        this._handleSelectChange = this._handleSelectChange.bind(this);
        this._handleKeyStroke = this._handleKeyStroke.bind(this);
        this._handleEnterKey = this._handleEnterKey.bind(this);
    }

    componentDidMount() {
        if (this.props.data.currentSearchString !== undefined && this.props.data.currentSearchString !== null && this.props.data.currentSearchString !== '') {
            store.dispatch(searchPatientAPICall({
                field: this.props.data.currentSearchType,
                value: this.props.data.currentSearchString
            }));
        }
    }

    componentWillUnmount() {
        store.dispatch(searchPatientClear());
    }

    _handleKeyStroke(ev) {
        this.setState({ searchString: ev.target.value }, () => {
            if (this.state.searchString.trim() !== '') {
                store.dispatch(searchPatientAPICall({
                    field: this.state.searchType,
                    value: this.state.searchString.trim()
                }));
            } else {
                store.dispatch(searchPatientClear());
            }
        });
    }

    _handleSelectChange(ev) {
        this.setState({ searchType: ev.target.value });
        store.dispatch(searchPatientAPICall({
            field: ev.target.value,
            value: this.state.searchString
        }));
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
                    <Helmet title='Patient Search' />
                    <h2>Patient Search</h2>
                    <div className={style.profileActions}>
                        <Link title='New visit' to={'/createPatient'} ><Icon symbol='user' /><span>Add a new patient</span></Link>
                    </div>
                </div>
                <div className={style.panel}>
                    <span>Search your dataset by entering your criteria in the box below.</span><br /><br />
                    <form>
                        <label htmlFor='searchType'>Search by:</label><br />
                        <select name='searchType' value={this.state.searchType} onChange={this._handleSelectChange} autoComplete='off'>
                            <option value='USUBJID'>Patient ID</option>
                            {this.props.adminPriv === 1 ? <option value='OPTIMISEID'>Optimise ID</option> : null}
                            <option value='SEX'>Sex</option>
                            <option value='EXTRT'>Treatment</option>
                            <option value='ETHNIC'>Ethnic Background</option>
                            <option value='COUNTRY'>Country of origin</option>
                            <option value='DOMINANT'>Dominant Hand</option>
                            <option value='MHTERM'>Diagnosis</option>
                        </select><br /><br />
                        <label htmlFor='searchType'>Containing:</label><br />
                        <input type='text' name='searchTerm' value={this.state.searchString} onChange={this._handleKeyStroke} onKeyPress={this._handleEnterKey} autoComplete='off' />
                    </form><br />
                    <SearchResultForPatients listOfPatients={this.props.data.result} searchType={this.state.searchType} searchString={this.state.searchString.trim()} />
                </div>
            </>
        );
    }
}

export default SearchPatientsById;

@connect(null, dispatch => ({
    fetchPatientProfile: patientName => dispatch(getPatientProfileById(patientName))
    }))
class SearchResultForPatients extends Component {
    render() {
        const { searchString, searchType, listOfPatients } = this.props;
        return (
            <div className={style.searchResultWrapper}>
                {listOfPatients !== undefined && listOfPatients.filter(el => el['aliasId'].toLowerCase() === searchString.toLowerCase()).length === 0 && searchString !== '' && (searchType === 'USUBJID' || searchType === '') ?
                    <Link to={`/createPatient/${searchString}`} className={style.searchItem}>
                        <div>
                            <span className={style.createPatientSign}>&#43;</span><br />
                            <span className={style.createPatientText}>Create patient<br />{`${searchString}`}</span>
                        </div>
                    </Link>
                    : null}
                {listOfPatients !== undefined && listOfPatients.map(el => <PatientButton key={el.patientId} data={el} searchString={searchString} />)}
            </div>
        );
    }
}

export { SearchResultForPatients };

/*  receives prop 'data' as one patient; and seachString*/
class PatientButton extends PureComponent {
    render() {
        const { data, searchString } = this.props;
        const ind = data.aliasId.toLowerCase().indexOf(searchString.toLowerCase());
        const styledName = (
            <span>
                <b>
                    {ind >= 0 ?
                        (
                            <>
                                {data.aliasId.substring(0, ind)}
                                <span className={style.matchedString}>
                                    {data.aliasId.substring(ind, searchString.length + ind)}
                                </span>
                                {data.aliasId.substring(searchString.length + ind, data.aliasId.length)}
                            </>
                        ) :
                        (
                            <> {data.aliasId}</>
                        )
                    }
                </b>
            </span>
        );
        return (
            <Link key={data.aliasId} to={`/patientProfile/${data.aliasId}`} className={style.searchItem} >
                <div>
                    {styledName} <br /><br />
                    <span>
                        study: {data.study} <br />
                        consent: {data.consent === true ? 'yes' : 'no'}
                    </span>
                </div>
            </Link >
        );
    }
}