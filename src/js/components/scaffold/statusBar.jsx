import React, { Component } from 'react';
import css from '../../../css/scaffold.module.css';
import { connect } from 'react-redux';

@connect(state => ({ username: state.login.username }))
export default class StatusBar extends Component {
    render() {
        return (
            <div className={css.StatusBar}>
                <span > You are logged in as {this.props.username}</span>
                <span > OptimiseMS v1.0.0</span>
            </div>
        );
    }
}