import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
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
        let { visits, tests, treatments, clinicalEvents } = data;
        visits = visits.filter(el => el.id === parseInt(params.visitId));
        if (visits.length === 0) {
            return <div>Cannot find your visit!</div>;
        }
        tests = tests.filter(el => el.id === parseInt(params.visitId));
        treatments = treatments.filter(el => el.id === parseInt(params.visitId));
        clinicalEvents = clinicalEvents.filter(el => el.id === parseInt(params.visitId));
        const testsBlocks = {
            key: 'Math.random().toString(35).slice(2,10)',
            text: "",
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {}
        }
        return <Communication match={match}/>;
    }
}



class Communication extends Component {
    render() {
        const { params } = this.props.match;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Communication</h2>
                    <BackButton to={`/patientProfile/${params.patientId}`} />
                </div>
                <form className={style.panel}>
                    <p>This is the communication for visit ///// </p> <br/><br/>
                    <CommunicationEditor/>
                </form>
            </>
        );
    }
}


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
        console.log(this.state.editorState.getCurrentContent().getBlockMap());
    }

    render() {
        return (
            <>
            <pre>{JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()), null, 4)}</pre>
            You can append these pre-composed paragraphs:
            <div className={style.commentButtonsGroup}>
                <div>
                    <button onClick={this._onClick}>Vital signs</button>
                    <button onClick={this._onClick}>Signs {'&'} Symptoms</button>
                    <button onClick={this._onClick}>Tests</button>
                </div>
                <div>
                    <button onClick={this._onClick}>Treatments</button>
                    <button onClick={this._onClick}>Clinical Events</button>
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