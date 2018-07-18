import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getLogAPICall } from '../../redux/actions/admin';
import Icon from '../icon';
import style from './admin.module.css';

@connect(state => ({ log: state.log }))
export class Log extends Component {
    componentDidMount() {
        store.dispatch(getLogAPICall());
    }

    render() {
        const { fetching, error, result } = this.props.log;
        if (fetching) {
            return <div><Icon symbol='loading' /></div>;
        } else {
            if (error) {
                return <div> Cannot fetch.. </div>;
            } else {
                const logs = result.slice(Math.max(0, result.length - 200));
                logs.reverse();
                return <>{logs.map(el => <LogEntry key={el.id} entry={el} />)}</>;
            }
        }
    }
}

/**
 * @prop {Object} this.props.entry
 */
export class LogEntry extends PureComponent {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <div>
                <b>Action Id: </b> <pre className={style.actionOther}>{el.id}</pre> <br />
                <b>Action: </b> <pre className={style.actionOther}>{`${el.method} ${el.router}`}</pre><br />
                <b>User: </b><pre className={style.actionOther}>{el.user}</pre><br />
                <b>Body: </b><pre className={style.actionBody}>{JSON.stringify(JSON.parse(el.body), null, 2)}</pre>
            </div>
        );
    }
}