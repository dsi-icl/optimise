import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState } from 'draft-js';
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
    }
    render() {
        return (
            <Editor className={style.editor} editorState={this.state.editorState} onChange={this.onChange} />
        );
    }
}