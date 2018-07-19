import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTestAPICall } from '../../redux/actions/tests';
import style from './export.module.css';

//not yet finished the dispatch
@connect(state => ({ data: state.searchPatient }))
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
        window.open('/api/export');
    }

    render() {
        const { data: { result } } = this.props;
        return (
            <>
                <div className={style.ariane}>
                    <h2>Data Export</h2>
                </div>
                <form className={style.panel}>
                    <span>You can export all of you data or a subset of it to a CDISC ODM format by using the buttons below. To export a subset, just enter your criteria on the left hand side.</span><br /><br />
                    <span><i>CDISC ODM (Clinical Data Interchange Standards Consortium Operational Data Model) is an open, multidisciplinary, neutral standard designed to facilitate the regulatory-compliant acquisition, archive and interchange of metadata and data for clinical research studies.</i></span><br /><br />
                    <button onClick={this._handleExportAll}>Export all data as CDISC</button><br /><br />
                    {result.length > 0 ? (
                        <button onClick={this._handleExport}>Export your search results as CDISC</button>
                    ) : null}
                </form>
            </>
        );
    }
}