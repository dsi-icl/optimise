import React, { Component } from 'react';

export class AdminActions extends Component {
    render() {
        return (
            <div>
                <h2> ADMIN MENU </h2>
                <div className='patientBanner'>
                    <b>Manage users </b>
                </div>
                <div className='patientBanner'>
                    <b>Export database for backup</b>
                </div>
                <div className='patientBanner'>
                    <b>View access log</b>
                </div>
            </div>
        )
    }
}