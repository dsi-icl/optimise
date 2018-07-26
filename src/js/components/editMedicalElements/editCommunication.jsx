import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { formatTests, visitTitle, formatEvents, formatTreatments, formatSymptomsAndSigns } from './communicationTemplates';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';


/* container; fetches all the data and format it into CONTENTSTATE and pass them to the children */ 
@connect(state => ({ fetching: state.patientProfile.fetching, data: state.patientProfile.data, availableFields: state.availableFields }))
export default class EditCommunication extends Component {
    render() {
        const { fetching, data, match } = this.props;
        if (fetching) {
            return null;
        }
        console.log(this.props)
        const { params } = match;
        const { testTypes_Hash, clinicalEventTypes_Hash, drugs_Hash, VSFields_Hash, visitFields_Hash } = this.props.availableFields;
        let { visits, tests, treatments, clinicalEvents } = data;
        visits = visits.filter(el => el.id === parseInt(params.visitId));
        if (visits.length === 0) {
            return <div>Cannot find your visit!</div>;
        }
        tests = tests.filter(el => el.orderedDuringVisit === parseInt(params.visitId));
        treatments = treatments.filter(el => el.orderedDuringVisit === parseInt(params.visitId));
        clinicalEvents = clinicalEvents.filter(el => el.recordedDuringVisit === parseInt(params.visitId));
        console.log('LIST', tests, treatments, clinicalEvents, drugs_Hash[0]);
        const testBlock = formatTests(tests, testTypes_Hash[0]);
        const ceBlock = formatEvents(clinicalEvents, clinicalEventTypes_Hash[0]);
        const medBlock = formatTreatments(treatments, drugs_Hash[0]);
        const VSBlock = formatSymptomsAndSigns(visits[0].data || [], VSFields_Hash[0]);
        const symptomBlock = formatSymptomsAndSigns(visits[0].data || [], visitFields_Hash[0]);
        const precomposed = { testBlock, ceBlock, medBlock, symptomBlock, VSBlock };
        return <Communication match={match} precomposed={precomposed}/>;
    }
}



class Communication extends Component {
    render() {
        const { precomposed, match } = this.props;
        const { params } = match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Communication</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <p>This is the communication for visit ///// </p> <br/><br/>
                    <CommunicationEditor precomposed={precomposed}/>
                </form>
            </>
        );
    }
}


/* receive precomposed props which contains functions that generate blocks */
class CommunicationEditor extends Component {
    constructor() {
        super();
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this._onBoldClick = this._onBoldClick.bind(this);
        this._onItalicClick = this._onItalicClick.bind(this);
        this._onUnderlineClick = this._onUnderlineClick.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _onClick(ev) {
        ev.preventDefault();
        const { precomposed } = this.props;
        const whichButton = ev.target.name;
        const blockgen = precomposed[whichButton];
        this.setState(prevState => {
            if (blockgen) {
                const raw = convertToRaw(prevState.editorState.getCurrentContent());
                const newBlocks = blockgen();
                newBlocks.forEach(el => { raw.blocks.push(el); });
                const newEditorState = EditorState.createWithContent(convertFromRaw(raw));
                return { editorState: newEditorState };
            } else {
                return prevState;
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
        console.log(this.state.editorState.getCurrentContent());
    }

    render() {
        return (
            <>
            {/* <pre>{JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()), null, 4)}</pre> */}
            You can append these pre-composed paragraphs:
            <div className={style.commentButtonsGroup}>
                <div>
                    <button name='VSBlock' onClick={this._onClick}>Vital signs</button>
                    <button name='symptomBlock' onClick={this._onClick}>Signs {'&'} Symptoms</button>
                    <button name='testBlock' onClick={this._onClick}>Tests</button>
                </div>
                <div>
                    <button name='medBlock' onClick={this._onClick}>Treatments</button>
                    <button name='ceBlock' onClick={this._onClick}>Clinical Events</button>
                    <button onClick={this._onClick}>Performance</button>
                </div>
                <div>
                    <button onClick={this._onClick}>All of above</button>
                </div>
            </div>
            <br/>
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
            <br/>
            <button onClick={this._onSubmit}>Save</button>
            <br/><br/>
            </>
        );
    }
}