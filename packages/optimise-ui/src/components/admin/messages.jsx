import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({
    log: state.log
}))
export class Messages extends Component {
    render() {
        return (
            <>
                There is a <b>new update</b> available for download!<br />
                You should update now to get the latest features and bug fixes.
                    <br /><br />
                <button>Update NOW</button>
            </>
        );
    }
}