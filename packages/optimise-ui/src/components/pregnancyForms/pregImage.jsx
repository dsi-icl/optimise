import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import store from '../../redux/store';
import { PickDate } from '../createMedicalElements/datepicker';
import moment from 'moment';
import style from '../patientProfile/patientProfile.module.css';
import pregnancy_style from './pregnancy.module.css';
import { DeleteButton } from '../patientProfile/sharedComponents';
import { MeddraPicker } from '../medDRA/meddraPicker';
import { addAlert } from '../../redux/actions/alert';
import Icon from '../icon';
import { createPregnancyImageAPICall, deletePregnancyImageAPICall, editPregnancyImageAPICall } from '../../redux/actions/demographicData';

@withRouter
@connect(state => ({
    fields: state.availableFields,
    data: state.patientProfile.data,

}))
class PregnancyImageForm extends Component {
    constructor(props) {
        super();
        this.state = {
            showAddNewImageData: false,
            addNewImageData_counter: 1,
            date: moment(),
            mode: 'Other',
            result: 'Other',
            addNewImageData_cache: [],
        };

        this._handleSubmit = this._handleSubmit.bind(this);
        this._updateImageData = this._updateImageData.bind(this);
        this._handleResultChange = this._handleResultChange.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);


    }

    componentDidMount() {
        this._updateImageData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visitId !== this.props.visitId || prevProps.data.pregnancyImages !== this.props.data.pregnancyImages) {
            this._updateImageData();
        }
    }

    _updateImageData() {
        const matchedImages = this.props.data.pregnancyImages.filter(
            (el) => parseInt(el.visitId) === parseInt(this.props.visitId)
        );
        this.setState({ addNewImageData_cache: matchedImages });
    }



    _handleSubmit(ev) {
        ev.preventDefault();

        if (this.state.lastImageSubmit && (new Date()).getTime() - this.state.lastImageSubmit < 500 ? true : false)
            return;

        const body = {
            patientId: this.props.data.patientId,
            data: {
                date: this.state.date ? new Date(this.state.date).toISOString() : null,
                mode: this.state.mode,
                result: this.state.result,
                visitId: parseInt(this.props.visitId)
            }
        };

        this.setState({
            lastImageSubmit: (new Date()).getTime(),
            showAddNewImageData: false,
            error: false
        }, () => {
            store.dispatch(createPregnancyImageAPICall(body))
            //this.setState({ saved: true })
        });


    }

    _handleResultChange(ev) {
        this.setState({ result: ev.target.value, error: false });
    }

    _handleModeChange(ev) {
        this.setState({ mode: ev.target.value, error: false });
    }

    render() {
        return (
            <>
                <div className={pregnancy_style.pregnancy_image_div}><h4>Image data</h4> <br></br>
                    {
                        this.state.addNewImageData_cache && this.state.addNewImageData_cache.map(el =>
                            <div key={el.id} className={pregnancy_style.one_tentative_image}>

                                <OnePregnancyImage data={el} patientId={this.props.data.patientId}></OnePregnancyImage>
                            </div>)
                    }
                    {
                        this.state.showAddNewImageData ?
                            <div>
                                <label>Image date:<PickDate startDate={this.state.date} handleChange={this._handleDateChange} /></label><br /><br />
                                <label>Mode:
                                    <select defaultValue={this.state.mode} onChange={this._handleModeChange}>
                                        <option value='USS'>USS</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label><br /><br />
                                <label>Result:
                                    <select defaultValue={this.state.result} onChange={this._handleResultChange}>
                                        <option value='Result One'>One</option>
                                        <option value='Result Two'>Two</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label>

                                <button
                                    onClick={this._handleSubmit}
                                >
                                    Confirm
                                </button>
                                <button onClick={() => this.setState({ showAddNewImageData: false })}>Cancel</button>
                            </div>
                            :
                            <button onClick={() => this.setState({ showAddNewImageData: true })}>Add new image data</button>
                    }
                </div>
            </>
        )
    }
}

export default PregnancyImageForm;

class OnePregnancyImage extends Component {
    constructor(props) {
        super();
        const { data } = props;
        this.state = {
            editing: false,
            error: false,
            date: moment(new Date(parseInt(data.date))),
            result: data.result,
            mode: data.mode

        };
        this._handleClickDelete = this._handleClickDelete.bind(this);
        this._deleteFunction = this._deleteFunction.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleEditClick = this._handleEditClick.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleModeChange = this._handleModeChange.bind(this);
        this._handleResultChange = this._handleResultChange.bind(this);
    }

    _handleClickDelete = () => {
        store.dispatch(addAlert({ alert: 'Do you want to delete this pregnancy image?', handler: this._deleteFunction(this.props.data.id) }));
    };

    _deleteFunction = id => {

        return () => {
            const body = {
                patientId: this.props.patientId,
                data: {
                    id: id
                }
            };
            store.dispatch(deletePregnancyImageAPICall(body));
        };
    };

    _handleSubmit = ev => {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        if (!this.state.date) {
            this.setState({
                error: 'Please select an image date'
            });
            return;
        }
        if (!this.state.mode) {
            this.setState({
                error: 'Please select the image mode'
            });
            return;
        }
        if (!this.state.result) {
            this.setState({
                error: 'Please enter the imaging result'
            });
            return;
        }
        const { data, patientId } = this.props;
        const body = {
            patientId: patientId,
            data: {
                id: parseInt(data.id),
                date: this.state.date ? this.state.date.toISOString() : null,
                result: this.state.result,
                mode: this.state.mode

            }
        };

        this.setState({
            lastSubmit: (new Date()).getTime(),
            error: false
        }, () => {
            store.dispatch(editPregnancyImageAPICall(body));
            this.setState({ editing: false });
        });
    };

    _handleEditClick = ev => {
        ev.preventDefault();
        this.setState(prevState => ({
            editing: !prevState.editing,
            error: false
        }));
    };

    _handleDateChange = date => {
        this.setState({
            date: date,
            error: false
        });
    };

    _handleResultChange(ev) {
        this.setState({ result: ev.target.value, error: false });
    }

    _handleModeChange(ev) {
        this.setState({ mode: ev.target.value, error: false });
    }



    render() {
        const { editing, date, result, mode } = this.state;
        const { data } = this.props;
        return (
            <div className={style.interruption} style={{
                overflow: editing ? 'visible' : 'hidden'
            }}>
                {
                    editing ?
                        <>
                            <div className={style.editInterruption}>
                                <label>Date: </label><PickDate startDate={date} handleChange={this._handleDateChange} /><br />
                                <label>Mode:
                                    <select defaultValue={'other'} onChange={this._handleModeChange}>
                                        <option value='USS'>USS</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label><br /><br />

                                <label>Result:
                                    <select defaultValue={'other'} onChange={this._handleResultChange}>
                                        <option value='Result One'>One</option>
                                        <option value='Result Two'>Two</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label><br /><br />

                            </div>
                            {this.state.error ? <><div className={style.error}>{this.state.error}</div><br /></> : null}
                            <button onClick={this._handleSubmit}>Confirm change</button><br /><br />
                            <button onClick={this._handleEditClick}>Cancel</button>
                        </>
                        :
                        <>
                            <label>Date: </label> {date.toISOString().substring(0, 10)} <br />
                            <label>Mode: </label> {mode} <br />
                            <label>Result: </label> {result} <br />
                            <DeleteButton clickhandler={() => this._handleClickDelete()} />
                            <span title='Edit' onClick={this._handleEditClick} className={style.dataEdit}><Icon symbol='edit' /></span>
                        </>
                }
            </div>
        );
    }
}