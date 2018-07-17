import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from './scaffold.module.css';

@connect(state => ({ username: state.login.username }))
export default class StatusBar extends Component {
    render() {
        return (
            <div className={style.statusBar}>
                <span> You are logged in as {this.props.username}</span>
                <span> OptimiseMS v1.0.0</span>
            </div>
        );
    }
}