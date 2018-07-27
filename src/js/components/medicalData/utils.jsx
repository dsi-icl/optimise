import React, { Component, Fragment } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { DataTemplate } from './dataPage';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import merge from 'deepmerge';
import style from './dataPage.module.css';


export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} title='Close' className={scaffold_style.backButton}>&#10006;</Link>
        );
    }
}


/* receives ref and an array of choices  */
export class SelectField extends Component {
    render() {
        const { reference, choices, origVal } = this.props;
        return (
            <select ref={reference} defaultValue={origVal}>
                <option value='unselected'>unselected</option>
                {choices.map(el => <option key={el} value={el}>{el}</option>)}
            </select>
        );
    }
}

/* receives ref, name, default */
export class BooleanField extends Component {
    constructor(props){
        super();
        this.state = { checked: props.default };
        this._onClick = this._onClick.bind(this);
    }

    _onClick(ev) {
        ev.preventDefault();
        this.setState(prevState => ({ checked: !prevState.checked }));
    }

    render() {
        const { reference, key, name } = this.props;
        const { checked } = this.state;
        return (
            <Fragment key={key}>
                <input ref={reference} type='checkbox' style={{ display: 'none' }} checked={checked}/>
                <button
                    className={ checked ? [style.booleanButton, style.booleanButton_checked].join(' ') : style.booleanButton}
                    onClick={this._onClick}
                >{name}</button>
            </Fragment>
        );
    }
}

/* receives ref */
export class TextField extends Component {
    render() {
        const { reference, origVal } = this.props;
        return (
            <input defaultValue={origVal} ref={reference} type='text'/>
        );
    }
}


export function createLevelObj(fields) {
    let obj = [];

    fields.forEach(f => {
        obj.push(f.idname.split(':').reverse().reduce((a, c) => !a ? { [c]: f } : ({ [c]: a }), null));
    });
    return merge.all(obj);
}

export function mappingFields(typeHash, references, originalValues) {
    const curry = el => {
        const title = el[0];
        const content = el[1];
        if (content.hasOwnProperty('id')) {
            const origVal = originalValues[content.id];
            switch (typeHash[content.type]){
                case 'I':
                case 'F':
                case 'T':
                    return <Fragment key={content.id}>{`${content.definition} :`}<TextField origVal={origVal ? origVal : null} reference={references[content.id].ref}/><br/><br/></Fragment>;
                case 'B':
                    return <Fragment key={content.id}><BooleanField reference={references[content.id].ref} name={content.definition} default={origVal && origVal === '1' ? true : false}/><br/><br/></Fragment>;
                case 'C':
                    return <Fragment key={content.id}>{`${content.definition} :`}<SelectField origVal={origVal ? origVal : null} reference={references[content.id].ref} choices={content.permittedValues.split(',')}/><br/><br/></Fragment>;
                default:
                    return null;
            }
        } else {
            return <Fragment key={title}>{title}: <div>{Object.entries(content).map(curry)}</div></Fragment>;
        }
    };
    return curry;
};