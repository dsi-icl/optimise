import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './export.module.css';

//not yet finished the dispatch
@connect(state => ({
    data: state.searchPatient
}))
export class ExportSets extends Component {

    constructor() {
        super();
        this._handleExportAll = this._handleExportAll.bind(this);
        this._handleExport = this._handleExport.bind(this);
    }

    _handleExportAll(e) {
        e.preventDefault();

        let opener = window.ipcOpen || window.open;
        opener('/api/export');
    }

    _handleExport(e) {
        e.preventDefault();
        const { data: { currentSearchType, currentSearchString } } = this.props;
        let opener = window.ipcOpen || window.open;
        opener(`/api/export?field=${currentSearchType}&value=${currentSearchString}`);
    }

    _handleExportAllCDISC(e) {
        e.preventDefault();

        let opener = window.ipcOpen || window.open;
        opener('/api/export/?cdisc');
    }

    _handleExportCDISC(e) {
        e.preventDefault();
        const { data: { currentSearchType, currentSearchString } } = this.props;
        let opener = window.ipcOpen || window.open;
        opener(`/api/export?cdisc&field=${currentSearchType}&value=${currentSearchString}`);
    }

    render() {
        const { data: { result } } = this.props;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Data Export</h2>
                </div>
                <form className={style.panel}>
                    <span>You can data for all or a subset of your patients to a CDISC SDTM (Clinical Data Interchange Standards Consortium Study Data Tabulation Model) format by using the buttons below. To export for a subset, just enter your criteria on the left hand side.</span><br /><br />
                    <span><i>CDISC SDTM is an open, multidisciplinary, neutral standard designed to facilitate the regulatory-compliant acquisition, archive and interchange of metadata and data for clinical research studies.</i></span><br /><br />
                    <label>For all patient:</label>
                    <button onClick={this._handleExportAll}>Export summary</button><br /><br />
                    <button onClick={this._handleExportAllCDISC}>Export as CDISC SDTM</button><br /><br />
                    {result.length > 0 ? (
                        <>
                            <label>For your search subset:</label>
                            <button onClick={this._handleExport}>Export summary</button><br /><br />
                            <button onClick={this._handleExportCDISC}>Export as CDISC SDTM</button>
                        </>
                    ) : null}
                </form>
            </>
        );
    }
}
