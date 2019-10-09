import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackButton } from '../medicalData/utils';
import store from '../../redux/store';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { ICD11Picker } from '../comorbidityPicker/icd11Picker';
import { createComorbidityAPICall, deleteComorbidityAPICall, editComorbidityAPICall } from '../../redux/actions/comorbidities';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import style from '../createMedicalElements/medicalEvent.module.css';

@connect(state => ({
    patientProfile: state.patientProfile,
    fields: state.availableFields
}))
export default class EditComorbidity extends Component {
    constructor() {
        super();
        this.state = {
            addMore: false,
            error: false,
            comorbidity: undefined
        };
        this._handleClickingAdd = this._handleClickingAdd.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleValueChange = this._handleValueChange.bind(this);
    }

    _handleClickingAdd() {
        this.setState(prevState => ({ addMore: !prevState.addMore, error: false }));
    }

    _handleValueChange(value) {
        this.setState({ comorbidity: parseInt(value) });
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.comorbidity) {
            this.setState({
                error: 'Please select an ICD11 term'
            });
            return;
        }
        const data = this.props.patientProfile.data;
        const body = {
            patientId: data.patientId,
            data: {
                visitId: parseInt(this.props.match.params.visitId),
                comorbidity: parseInt(this.state.comorbidity)
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(createComorbidityAPICall(body));
            this.setState({ addMore: false });
        });
    }

    render() {
        const { patientProfile, fields } = this.props;
        const { icd11_Hash } = fields;
        if (!patientProfile.fetching) {
            return (
                <>
                    <div className={style.ariane}>
                        <h2>Comorbidities</h2>
                        <BackButton to={`/patientProfile/${this.props.match.params.patientId}`} />
                    </div>
                    <form className={style.panel}>
                        {patientProfile.data.comorbidities
                            .filter((el) => parseInt(el.visit) === parseInt(this.props.match.params.visitId))
                            .sort((a, b) => {
                                if (icd11_Hash && icd11_Hash[0] && icd11_Hash[0][a.comorbidity] && icd11_Hash[0][a.comorbidity].name)
                                    return icd11_Hash[0][a.comorbidity].name.localeCompare(icd11_Hash[0][b.comorbidity].name);
                                else
                                    return 0;
                            })
                            .map((el) =>
                                <OneComorbidity
                                    key={Math.random()}
                                    data={el}
                                    icd11_Hash={icd11_Hash}
                                    _handleClickDelete={this._handleClickDelete}
                                    patientId={patientProfile.data.patientId}
                                />
                            )}
                        {!this.state.addMore ?
                            <>
                                <br />
                                <button onClick={this._handleClickingAdd}>Add comorbidities</button>
                            </>
                            :
                            <>
                                <div className={style.newInterruption}>
                                    <label>ICD11: </label><ICD11Picker value={this.state.comorbidity} onChange={this._handleValueChange} />
                                </div>
                                {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                                <button onClick={this._handleSubmit}>Submit</button><br /><br />
                                <button onClick={this._handleClickingAdd}>Cancel</button><br />
                            </>
                        }
                    </form>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}


class OneComorbidity extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            error: false,
            comorbidity: data.comorbidity,
            comorbidity_original: data.comorbidity,
        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleValueChange = this._handleValueChange.bind(this);
    }

    _handleClickDelete = () => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this comorbidity record?', handler: this._deleteFunction(this.props.data.id) }));
    }

    _deleteFunction = id => {
        const that = this;
        return () => {
            const { patientId } = that.props;
            const body = {
                patientId: patientId,
                data: {
                    comorbidityId: id
                }
            };
            store.dispatch(deleteComorbidityAPICall(body));
        };
    }

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.comorbidity) {
            this.setState({
                error: 'Please select an ICD11 term'
            });
            return;
        }
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                id: parseInt(data.id, 10),
                comorbidity: parseInt(this.state.comorbidity, 10)
            }
        };
        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editComorbidityAPICall(body));
            this.setState({ editing: false });
        });
    }

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing,
            error: false
        }));
    }

    _handleValueChange = value => {
        this.setState({
            comorbidity: parseInt(value),
            error: false
        });
    }

    render() {
        const { editing, comorbidity, comorbidity_original } = this.state;
        const { data, icd11_Hash } = this.props;
        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <div className={style.editInterruption}>
                                <label>ICD11: </label><ICD11Picker value={comorbidity} onChange={this._handleValueChange} />
                            </div>
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                            {comorbidity_original ? <><label alt={icd11_Hash[0][comorbidity_original].name}>ICD11: </label> {icd11_Hash[0][comorbidity_original].name} <br /></> : null}
                            <DeleteButton clickhandler={() => this._handleClickDelete(data)} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}