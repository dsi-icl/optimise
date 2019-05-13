import React, { PureComponent } from 'react';

export class PatientMappings extends PureComponent {

    constructor(props) {
        super(props);
        this._handleExportPatientMappings = this._handleExportPatientMappings.bind(this);
    }

    _handleExportPatientMappings(e) {
        e.preventDefault();

        let opener = window.ipcOpen || window.open;
        opener('/api/export?patientMappings');
    }

    render() {
        return (
            <>
                As an administrator you have the possibility of exporting the Patient ID to Optimise ID mapping file in bulk by clicking on the button below.
                It is not recommended to share this information once downloaded. Please refer to the relevant guidelines on data compliance and management.
                <br/><br/>
                <button onClick={this._handleExportPatientMappings}>Download ID mapping file</button>
            </>
        );
    }
}