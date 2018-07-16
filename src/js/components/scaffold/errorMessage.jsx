import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SearchPatient } from '../searchPatient';
import { FilterPanel } from '../filterPatient/selectPanel';
import style from './scaffold.module.css';

export default class ErrorMessage extends Component {
    render() {
        return (
            <div className={style.errorMessage}>
            </div>
        );
    }
}
