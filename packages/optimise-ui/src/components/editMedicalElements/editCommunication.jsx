import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { formatTests, formatEvents, formatTreatments, formatSymptomsAndSigns, formatVS, formatEdss } from './communicationTemplates';
import { BackButton } from '../medicalData/utils';
import { updateVisitAPICall } from '../../redux/actions/createVisit';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';
import { saveAs } from 'file-saver';


/* container; fetches all the data and format it into CONTENTSTATE and pass them to the children */
@connect(state => ({
    fetching: state.patientProfile.fetching,
    data: state.patientProfile.data,
    availableFields: state.availableFields
    }))
export default class EditCommunication extends Component {
    render() {
        const { fetching, data, match, location } = this.props;
        if (fetching) {
            return null;
        }

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        const { params } = match;
        const { VSFields_Hash, visitFields } = this.props.availableFields;
        let { visits } = data;
        const symptomsFields = visitFields.filter(el => el.section === 2);
        const symptomsFieldsHash = symptomsFields.reduce((a, el) => { a[el.id] = el; return a; }, {});
        const signsFields = visitFields.filter(el => el.section === 3);
        const signsFieldsHash = signsFields.reduce((a, el) => { a[el.id] = el; return a; }, {});
        visits = visits.filter(el => el.id === parseInt(params.visitId));
        if (visits.length !== 1) {
            return <>
                <div className={_style.ariane}>
                    <h2>Communication</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={_style.panel}>
                    <div>
                        <i>We could not find the communication you are looking for.</i>
                    </div>
                </form>
            </>;
        }
        const edssHash = visitFields.filter(el => /^edss:(.*)/.test(el.idname)).reduce((a, el) => { a[el.id] = el; return a; }, {});
        const VSBlock = formatVS(visits[0].data || [], VSFields_Hash[0]);
        const symptomBlock = formatSymptomsAndSigns(visits[0].data || [], symptomsFieldsHash, signsFieldsHash);
        const perfBlock = formatEdss(visits[0].data || [], edssHash);
        const precomposed = { symptomBlock, VSBlock, perfBlock };
        const originalEditorState = visits[0].communication ? EditorState.createWithContent(convertFromRaw(JSON.parse(visits[0].communication))) : EditorState.createEmpty();
        return <Communication match={match} precomposed={precomposed} originalEditorState={originalEditorState} location={location} data={data} availableFields={this.props.availableFields} override_style={this.props.override_style} />;
    }
}

class Communication extends Component {
    render() {
        const { precomposed, match, originalEditorState, location, data, availableFields } = this.props;
        const { params } = match;
        if (data.visits === undefined)
            return null;

        let _style = style;
        if (this.props.override_style) {
            _style = { ...style, ...this.props.override_style };
        }

        return (
            <>
                <div className={_style.ariane}>
                    <h2>Communication</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={_style.panel}>

                    <CommunicationEditor precomposed={precomposed} match={match} originalEditorState={originalEditorState} location={location} data={data} availableFields={availableFields} />
                </form>
            </>
        );
    }
}

/* receive precomposed props which contains functions that generate blocks */
class CommunicationEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: props.originalEditorState,
            visitId: props.match.params.visitId,
            patientId: props.match.params.patientId,
            nextType: null,
            intervalValue: 1
        };
        this.onChange = (editorState) => this.setState({ editorState });
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this._onBoldClick = this._onBoldClick.bind(this);
        this._onItalicClick = this._onItalicClick.bind(this);
        this._onUnderlineClick = this._onUnderlineClick.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onClick = this._onClick.bind(this);
        this._exportPlainText = this._exportPlainText.bind(this);
        this._queryInterval = this._queryInterval.bind(this);
        this._cancelHop = this._cancelHop.bind(this);
        this._handleIntervalChange = this._handleIntervalChange.bind(this);
        this._filterOverDuration = this._filterOverDuration.bind(this);
    }

    static getDerivedStateFromProps(props, currentState) {
        const stateString = convertToRaw(currentState.editorState.getCurrentContent());
        const initialString = convertToRaw(props.originalEditorState.getCurrentContent());
        if (stateString !== initialString && currentState.visitId === props.match.params.visitId) {
            return currentState;
        } else {
            return { editorState: props.originalEditorState, visitId: props.match.params.visitId, patientId: props.match.params.patientId };
        }
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _exportPlainText(ev) {
        ev.preventDefault();
        const { visitId, patientId } = this.state;
        let { visits } = this.props.data;
        const text = this.state.editorState.getCurrentContent().getPlainText().replace(/\n/g, '\r\n');
        const visit = visits.filter(el => el.id === parseInt(visitId));
        const visitDate = visit.length > 0 ? new Date(parseInt(visit[0].visitDate)) : new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const final = `Communication for patient ${patientId}.\r\nClinical visit of the ${visitDate.toLocaleDateString('en-GB', dateOptions)}.\r\n\r\n\r\n${text}`;
        const file = new Blob([final], { type: 'text/plain' });
        saveAs(file, `visit_${visitId}_communication_${new Date().toDateString().replace(/ /g, '_')}`); // eslint-disable-line
    }

    _queryInterval(ev) {
        ev.preventDefault();
        this.setState({
            nextType: ev.target.name
        });
    }

    _cancelHop(ev) {
        ev.preventDefault();
        this.setState({
            nextType: null
        });
    }

    _filterOverDuration(duration) {

        let { tests, treatments, clinicalEvents } = this.props.data;
        const { testTypes_Hash, testFields_Hash, clinicalEventTypes_Hash, drugs_Hash } = this.props.availableFields;

        tests = tests.filter(el => moment(el.expectedOccurDate, 'x').valueOf() > moment().subtract(duration, 'months') || moment(el.actualOccurredDate, 'x').valueOf() > moment().subtract(duration, 'months'));
        treatments = treatments.filter(el => moment(el.startDate, 'x').valueOf() > moment().subtract(duration, 'months') || moment(el.terminatedDate, 'x').valueOf() > moment().subtract(duration, 'months'));
        clinicalEvents = clinicalEvents.filter(el => moment(el.dateStartDate, 'x').valueOf() > moment().subtract(duration, 'months') || moment(el.endDate, 'x').valueOf() > moment().subtract(duration, 'months'));

        const testBlock = formatTests(tests, [testTypes_Hash[0], testFields_Hash[0]], duration);
        const ceBlock = formatEvents(clinicalEvents, clinicalEventTypes_Hash[0], duration);
        const medBlock = formatTreatments(treatments, drugs_Hash[0], duration);

        return { testBlock, ceBlock, medBlock };
    }

    _onClick(ev) {
        ev.preventDefault();
        let { precomposed } = this.props;
        const whichButton = ev.target.name;
        if (this.state.nextType === whichButton)
            precomposed = { ...precomposed, ...this._filterOverDuration(this.state.intervalValue) };
        const blockgen = precomposed[whichButton];
        this.setState(prevState => {
            if (blockgen) {
                const raw = convertToRaw(prevState.editorState.getCurrentContent());
                const newBlocks = blockgen();
                newBlocks.forEach(el => { raw.blocks.push(el); });
                const newEditorState = EditorState.createWithContent(convertFromRaw(raw));
                return {
                    editorState: newEditorState,
                    nextType: null
                };
            } else {
                return {
                    ...prevState,
                    nextType: null
                };
            }
        });
    }

    _onBoldClick(ev) {
        ev.preventDefault();
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    _onItalicClick(ev) {
        ev.preventDefault();
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    _onUnderlineClick(ev) {
        ev.preventDefault();
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    _onSubmit(ev) {
        ev.preventDefault();
        if (this.state.lastSubmit && (new Date()).getTime() - this.state.lastSubmit < 500 ? true : false)
            return;
        const { params } = this.props.match;
        const communication = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
        const body = { patientId: params.patientId, visitData: { id: parseInt(params.visitId), communication: communication } };
        this.setState({
            lastSubmit: (new Date()).getTime()
        }, () => {
            store.dispatch(updateVisitAPICall(body));
        });
    }

    _handleIntervalChange(ev) {
        this.setState({
            intervalValue: parseInt(ev.target.value, 10)
        });
    }

    render() {
        return (
            <>
                You can append these pre-composed paragraphs:<br /><br />
                <div className={style.commentButtonsGroup}>
                    <div>
                        <button name='ceBlock' onClick={this._queryInterval} title='Clinical Events' className={this.state.nextType === 'ceBlock' ? style.selectedHop : ''}>Clinical Events</button>
                        <button name='VSBlock' onClick={this._onClick} title='Patient Data'>Patient Data</button>
                        <button name='symptomBlock' onClick={this._onClick} title={`Symptoms ${'&'} Signs`}>Symptoms{'&'}Signs</button>
                    </div>
                    <div>
                        <button name='perfBlock' onClick={this._onClick} title='Performance'>Performance</button>
                        <button name='testBlock' onClick={this._queryInterval} title='Tests' className={this.state.nextType === 'testBlock' ? style.selectedHop : ''}>Tests</button>
                        <button name='medBlock' onClick={this._queryInterval} title='Treatments' className={this.state.nextType === 'medBlock' ? style.selectedHop : ''}>Treatments</button>
                    </div>
                </div>
                <br />
                <div className={`${style.comIntervalBox} ${this.state.nextType ? style.showInterval : ''}`}>
                    <label htmlFor='interval'>Collect {this.state.nextType === 'ceBlock' ? 'clinical events' : this.state.nextType === 'testBlock' ? 'tests' : 'treatments'} across:</label><br />
                    <select value={this.state.intervalValue} name='interval' onChange={this._handleIntervalChange}>
                        <option value='1'>The past month</option>
                        <option value='2'>The past two months</option>
                        <option value='3'>The past three months</option>
                        <option value='6'>The past six months</option>
                        <option value='12'>The past year</option>
                        <option value='24'>The past two years</option>
                        <option value='36'>The past three years</option>
                        <option value='60'>The past five years</option>
                        <option value='120'>The past ten years</option>
                        <option value='2000'>The entire patient history</option>
                    </select>
                    <br /><br />
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <button type='button' name={this.state.nextType} onClick={this._onClick}>Add</button>
                                </td>
                                <td>
                                    <button type='button' onClick={this._cancelHop}>Cancel</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br /><br />
                </div>
                <div className={style.editorButtonsGroup}>
                    <button onClick={this._onBoldClick}><b>Bold</b></button>
                    <button onClick={this._onItalicClick}><i>Italic</i></button>
                    <button onClick={this._onUnderlineClick}><u>Under</u></button>
                </div>
                <div className={style.editorWrapper}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        handleKeyCommand={this.handleKeyCommand}
                    />
                </div>
                <br />
                <button onClick={this._onSubmit}>Save</button>
                <br /><br />
                <button onClick={this._exportPlainText}>Export as plain text (without styling)</button>
                <br /><br />
            </>
        );
    }
}