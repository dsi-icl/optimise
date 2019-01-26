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
        window.open('/api/export');
    }

    _handleExport(e) {
        e.preventDefault();
        const { data: { currentSearchType, currentSearchString } } = this.props;
        window.open(`/api/export?field=${currentSearchType}&value=${currentSearchString}`);
    }

    render() {
        const { data: { result } } = this.props;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Data Export</h2>
                </div>
                <form className={style.panel}>
                    <span>You can export all or a subset of your data to a CDISC SDTM (Clinical Data Interchange Standards Consortium Study Data Tabulation Model) format by using the buttons below. To export a subset, just enter your criteria on the left hand side.</span><br /><br />
                    <span><i>CDISC SDTM is an open, multidisciplinary, neutral standard designed to facilitate the regulatory-compliant acquisition, archive and interchange of metadata and data for clinical research studies.</i></span><br /><br />
                    <button onClick={this._handleExportAll}>Export all available data as CDISC SDTM</button><br /><br />
                    {result.length > 0 ? (
                        <button onClick={this._handleExport}>Export your search subset as CDISC SDTM</button>
                    ) : null}
                </form>
            </>
        );
    }
}
