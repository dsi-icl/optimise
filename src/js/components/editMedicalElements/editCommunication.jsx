import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { BackButton } from '../medicalData/dataPage';
import style from './editMedicalElements.module.css';
import store from '../../redux/store';



export default class EditCommunication extends Component {
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
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
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

    render() {
        return (
            <>
            Composition helpers:
            <div className={style.commentButtonsGroup}>
                <div>
                    <button>Vital signs</button>
                    <button>Signs {'&'} Symptoms</button>
                    <button>Tests</button>
                </div>
                <div>
                    <button>Treatments</button>
                    <button>Clinical Events</button>
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
            <button>Save</button>
            <br/><br/>
            </>
        );
    }
}