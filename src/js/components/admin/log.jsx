import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store.js';
import { getLogAPICall } from '../../redux/actions/admin.js';
import { LoadingIcon } from '../../../statics/svg/icons';
import cssIcons from '../../../css/icons.module.css';

@connect(state => ({ log: state.log }))
export class Log extends Component {
    componentDidMount() {
        store.dispatch(getLogAPICall());
    }

    render() {
        const { fetching, error, result } = this.props.log;
        if (fetching) {
            return <div className={cssIcons.spinner}><LoadingIcon /></div>;
        } else {
            if (error) {
                return <div> Cannot fetch.. </div>;
            } else {
                const logs = result.slice(Math.max(0, result.length - 100));
                logs.reverse();
                return <div>{logs.map(el => <LogEntry key={el.id} entry={el} />)}</div>;
            }
        }
    }
}

/**
 * @prop {Object} this.props.entry
 */
export class LogEntry extends Component {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <div >
                <b>Action Id: </b> {el.id} <br />
                <b>Action: </b> {`${el.method} ${el.router}`} <br />
                <b>User: </b> {el.user}<br />
                <b>Body: </b>{el.body} <br />
            </div>
        );
    }
}