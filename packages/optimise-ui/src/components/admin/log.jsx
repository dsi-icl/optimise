import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getLogAPICall } from '../../redux/actions/admin';
import Icon from '../icon';
import style from './admin.module.css';

const RETREIVAL_PER_CALL = 100;

@connect(state => ({
    log: state.log
    }))
class Log extends Component {

    constructor() {
        super();
        this.state = {
            offset: 0
        };
        this._loadMore = this._loadMore.bind(this);
    }

    componentDidMount() {
        this._loadMore();
    }

    _loadMore() {
        store.dispatch(getLogAPICall({
            limit: RETREIVAL_PER_CALL,
            offset: this.state.offset
        }));
        this.setState(prevState => ({
            ...prevState,
            offset: prevState.offset + RETREIVAL_PER_CALL + 1
        }));
    }

    render() {
        const { fetching, error, result } = this.props.log;
        if (fetching) {
            return <div><Icon symbol='loading' /></div>;
        } else {
            if (error) {
                return <div> Cannot fetch... </div>;
            } else {
                return (
                    <>
                        {result.map(el => <LogEntry key={`${el.id}_${Math.random().toString(36).substr(2, 5)}`} entry={el} />)}
                        <div className={style.logLoadMore}>
                            <button onClick={this._loadMore}>Load More</button>
                        </div>
                    </>
                );
            }
        }
    }
}

export {Log};

/**
 * @prop {Object} this.props.entry
 */
export class LogEntry extends PureComponent {    /* consider mapping the endpoints to more descriptive english later  */
    render() {
        const el = this.props.entry;
        return (
            <div className={style.logCard}>
                <b>Id: </b> <pre className={style.actionOther}>{el.id}</pre> <br />
                <b>User: </b><pre className={style.actionOther}>{el.user}</pre><br />
                <b>Time: </b><pre className={style.actionOther}>{el.createdTime}</pre><br />
                <b>Action: </b> <pre className={style.actionOther}>{`${el.method} ${el.router}`}</pre><br />
                {Object.keys(JSON.parse(el.body)).length > 0 ?
                    <>
                        <b>Body: </b>
                        <pre className={style.actionBody}>{JSON.stringify(JSON.parse(el.body), null, 2)}</pre>
                    </>
                    : null}
            </div>
        );
    }
}