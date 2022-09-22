import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { uploadMeddraAPICall } from '../../redux/actions/admin';
import style from './admin.module.css';

@connect(state => ({
    error: state.uploadMeddra.error,
    success: state.uploadMeddra.success,
    requesting: state.uploadMeddra.requesting,
}))
export class Meddra extends Component {
    constructor() {
        super();
        this.state = {
            lltFileExists: '0',
            emptyFiles: false
        };
        this.lltRef = React.createRef();
        this.hierRef = React.createRef();
    }

    handleSelectChange = e => {
        this.setState({ lltFileExists: e.target.value, emptyFiles: false });
    };

    handleFileAdded = () => {
        this.setState({ emptyFiles: false });
    };

    handleSubmit = () => {
        if (!this.hierRef.current.files[0]) {
            this.setState({ emptyFiles: true });
            return;
        }

        const form = new FormData();
        form.append('mdhierfile', this.hierRef.current.files[0]);

        if (this.state.lltFileExists === '1') {
            if (!this.lltRef.current.files[0]) {
                this.setState({ emptyFiles: true });
                return;
            }
            form.append('lltfile', this.lltRef.current.files[0]);
        }
        store.dispatch(uploadMeddraAPICall(form));
    };

    render() {
        return (
            <>
                If you have a subscription for MedDRA coding, you can load it so that it can be chosen in adverse events.<br /><br />
                The coding is provided in multiple files. "mdhier.asc" contains the hierarchy for SOC, HLGT, HLT, and PT codings. "llt.asc" contains the coding for LLT. <br /><br /><br />

                {
                    this.props.requesting ? <p>Loading...<br />Please do not leave this page. This will take about 2 minutes.</p> :
                        <>
                            Please select applicable:
                            <select onChange={this.handleSelectChange} value={this.state.lltFileExists}>
                                <option value={'0'}>I only have mdhier.asc file</option>
                                <option value={'1'}>I have both mdhier.asc and llt.asc</option>
                            </select>

                            <br /><br />
                            <form>
                                Select <b>mdhier.asc</b> file:
                                <input type='file' name='mdhierfile' accept='.asc' ref={this.hierRef} onChange={this.handleFileAdded} />
                                {this.state.lltFileExists === '1' ? <><br /><br />Select <b>llt.asc</b> file<input type='file' name='lltfile' accept='.asc' ref={this.lltRef} onChange={this.handleFileAdded} /></> : null}
                                <br /><br />
                            </form>
                            {this.state.emptyFiles ? <><div className={style.error}>One or more files are empty!</div><br /></> : null}
                            {this.props.success ? <><div className={style.success}>Successfully uploaded!</div><br /></> : null}
                            <button onClick={this.handleSubmit}>Upload file{this.state.lltFileExists === '1' ? 's' : ''}</button>
                        </>
                }
            </>
        );
    }
}