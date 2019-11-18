import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import merge from 'deepmerge';
import moment from 'moment';
import { PickDate } from '../createMedicalElements/datepicker';
import Icon from '../icon';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './dataPage.module.css';


export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} title='Close' className={scaffold_style.backButton}><Icon symbol='close' /></Link>
        );
    }
}


export function checkIfObjIsEmpty(...objs) {
    for (let each of objs) {
        if (Object.keys(each).length !== 0) {
            return false;
        } else {
            continue;
        }
    }
    return true;
};


/* receives ref and an array of choices  */
export class SelectField extends Component {
    constructor() {
        super();
        this.leftButton = React.createRef();
        this.rightButton = React.createRef();
        this.bothButton = React.createRef();
        this.oneButton = React.createRef();
        this.twoButton = React.createRef();
        this.threeButton = React.createRef();
        this.fourButton = React.createRef();
        this.normalButton = React.createRef();
        this.abnormalButton = React.createRef();
        this._handleLeftRightClick = this._handleLeftRightClick.bind(this);
        this._handleOneTwoClick = this._handleOneTwoClick.bind(this);
        this._handleThreeFourClick = this._handleThreeFourClick.bind(this);
        this._handleNormalClick = this._handleNormalClick.bind(this);
    }

    _handleOneTwoClick(ev) {

        ev.preventDefault();

        let nullify = false;
        if (!ev.target.className.split(' ').includes(style.noActive))
            nullify = true;

        this.oneButton.current.classList.add(style.noActive);
        this.twoButton.current.classList.add(style.noActive);

        if (nullify) {
            this.props.reference.current.value = 'unselected';
            return;
        }
        if (this.oneButton.current === ev.target) {
            this.props.reference.current.value = '1';
            this.oneButton.current.classList.remove(style.noActive);
        }
        if (this.twoButton.current === ev.target) {
            this.props.reference.current.value = '2';
            this.twoButton.current.classList.remove(style.noActive);
        }
    }

    _handleThreeFourClick(ev) {

        ev.preventDefault();

        let nullify = false;
        if (!ev.target.className.split(' ').includes(style.noActive))
            nullify = true;

        this.threeButton.current.classList.add(style.noActive);
        this.fourButton.current.classList.add(style.noActive);

        if (nullify) {
            this.props.reference.current.value = 'unselected';
            return;
        }
        if (this.threeButton.current === ev.target) {
            this.props.reference.current.value = '3';
            this.threeButton.current.classList.remove(style.noActive);
        }
        if (this.fourButton.current === ev.target) {
            this.props.reference.current.value = '4';
            this.fourButton.current.classList.remove(style.noActive);
        }
    }

    _handleNormalClick(ev) {

        ev.preventDefault();

        let nullify = false;
        if (!ev.target.className.split(' ').includes(style.noActive))
            nullify = true;

        this.normalButton.current.classList.add(style.noActive);
        this.abnormalButton.current.classList.add(style.noActive);

        if (nullify) {
            this.props.reference.current.value = 'unselected';
            return;
        }
        if (this.normalButton.current === ev.target) {
            this.props.reference.current.value = 'NORMAL';
            this.normalButton.current.classList.remove(style.noActive);
        }
        if (this.abnormalButton.current === ev.target) {
            this.props.reference.current.value = 'ABNORMAL';
            this.abnormalButton.current.classList.remove(style.noActive);
        }
    }

    _handleLeftRightClick(ev) {

        ev.preventDefault();

        let nullify = false;
        if (!ev.target.className.split(' ').includes(style.noActive))
            nullify = true;

        this.leftButton.current.classList.add(style.noActive);
        this.rightButton.current.classList.add(style.noActive);
        this.bothButton.current.classList.add(style.noActive);

        if (nullify) {
            this.props.reference.current.value = 'unselected';
            return;
        }

        if (this.leftButton.current === ev.target) {
            this.props.reference.current.value = 'LEFT';
            this.leftButton.current.classList.remove(style.noActive);
        }
        if (this.rightButton.current === ev.target) {
            this.props.reference.current.value = 'RIGHT';
            this.rightButton.current.classList.remove(style.noActive);
        }
        if (this.bothButton.current === ev.target) {
            this.props.reference.current.value = 'BOTH';
            this.bothButton.current.classList.remove(style.noActive);
        }
    }

    render() {
        const { reference, choices, origVal } = this.props;
        if (choices.includes('LEFT'))
            return (
                <>
                    <table className={style.leftRightButton}>
                        <tbody>
                            <tr>
                                <td><button type='button' ref={this.leftButton} onClick={this._handleLeftRightClick} className={origVal !== 'LEFT' ? style.noActive : ''}>Left</button></td>
                                <td><button type='button' ref={this.rightButton} onClick={this._handleLeftRightClick} className={origVal !== 'RIGHT' ? style.noActive : ''}>Right</button></td>
                                <td><button type='button' ref={this.bothButton} onClick={this._handleLeftRightClick} className={origVal !== 'BOTH' ? style.noActive : ''}>Both</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <select ref={reference} defaultValue={origVal} className={style.leftRightSelect}>
                        <option value='unselected'></option>
                        {choices.map(el => <option key={el} value={el}>{el}</option>)}
                    </select>
                </>
            );
        if (choices.length === 3 && choices.includes('NORMAL'))
            return (
                <>
                    <table className={style.leftRightButton}>
                        <tbody>
                            <tr>
                                <td><button type='button' ref={this.normalButton} onClick={this._handleNormalClick} className={origVal !== 'NORMAL' ? style.noActive : ''}>Normal</button></td>
                                <td><button type='button' ref={this.abnormalButton} onClick={this._handleNormalClick} className={origVal !== 'ABNORMAL' ? style.noActive : ''}>Abnormal</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <select ref={reference} defaultValue={origVal} className={style.leftRightSelect}>
                        <option value='unselected'></option>
                        {choices.map(el => <option key={el} value={el}>{el}</option>)}
                    </select>
                </>
            );
        if (choices.length === 2 && choices.includes('1'))
            return (
                <>
                    <table className={style.otButton}>
                        <tbody>
                            <tr>
                                <td><button type='button' ref={this.oneButton} onClick={this._handleOneTwoClick} className={origVal !== '1' ? style.noActive : ''}>1</button></td>
                                <td><button type='button' ref={this.twoButton} onClick={this._handleOneTwoClick} className={origVal !== '2' ? style.noActive : ''}>2</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <select ref={reference} defaultValue={origVal} className={style.leftRightSelect}>
                        <option value='unselected'></option>
                        {choices.map(el => <option key={el} value={el}>{el}</option>)}
                    </select>
                </>
            );
        if (choices.length === 2 && choices.includes('3'))
            return (
                <>
                    <table className={style.otButton}>
                        <tbody>
                            <tr>
                                <td><button type='button' ref={this.threeButton} onClick={this._handleThreeFourClick} className={origVal !== '3' ? style.noActive : ''}>3</button></td>
                                <td><button type='button' ref={this.fourButton} onClick={this._handleThreeFourClick} className={origVal !== '4' ? style.noActive : ''}>4</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <select ref={reference} defaultValue={origVal} className={style.leftRightSelect}>
                        <option value='unselected'></option>
                        {choices.map(el => <option key={el} value={el}>{el}</option>)}
                    </select>
                </>
            );
        return (
            <select ref={reference} defaultValue={origVal}>
                <option value='unselected'></option>
                {choices.map(el => <option key={el} value={el}>{el}</option>)}
            </select>
        );
    }
}

/* receives ref, name, default */
export class BooleanField extends Component {
    constructor(props) {
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
                <input ref={reference} type='checkbox' style={{ display: 'none' }} checked={checked} onChange={() => null} />
                <button
                    className={checked ? '' : style.noActive}
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
            <input defaultValue={origVal} ref={reference} type='text' />
        );
    }
}

/* receives ref */
export class AntibodyField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBooleanValue: props.origVal === '-1',
            currentTextValue: props.origVal && props.origVal !== '-1' ? props.origVal : ''
        };
        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _onChange(ev) {
        const newValue = ev.target ? ev.target.value : undefined;
        this.setState(prevState => ({
            ...prevState,
            currentBooleanValue: false,
            currentTextValue: newValue !== undefined ? newValue : prevState.currentTextValue
        }), () => {
            this.props.reference.current.value = this.state.currentTextValue;
        });
    }

    _onClick(ev) {
        ev.preventDefault();
        this.setState(prevState => ({
            ...prevState,
            currentBooleanValue: !prevState.currentBooleanValue,
            currentTextValue: prevState.currentBooleanValue === false ? '' : prevState.currentTextValue
        }), () => {
            if (this.state.currentBooleanValue === true)
                this.props.reference.current.value = '-1';
            else
                this.props.reference.current.value = '';
        });
    }

    render() {
        const { origVal, reference } = this.props;
        const { currentTextValue, currentBooleanValue } = this.state;
        return (
            <div className={style.antibodyContainer}>
                <input defaultValue={origVal} ref={reference} type='hidden' />
                <button className={currentBooleanValue ? '' : style.noActive} onClick={this._onClick}>Not detected</button>
                <input value={currentTextValue} onChange={this._onChange} type='text' />
            </div>
        );
    }
}

export const createLevelObj = (fields) => {
    let obj = [];

    fields.forEach(f => {
        obj.push(f.idname.split(':').reverse().reduce((a, c) => !a ? { [c]: f } : ({ [c]: a }), null));
    });

    return merge.all(obj);
};

export const mappingFields = (typeHash, references, originalValues, transformer) => {
    const curry = el => {
        const title = el[0];
        let content = el[1];
        if (content.hasOwnProperty('id')) {
            if (transformer !== undefined)
                content = transformer(content);
            const origVal = originalValues[content.id];
            const commutator = content.typeOverride || typeHash[content.type];
            let dateSlot;
            switch (commutator) {
                case 'B':
                    return (
                        <div key={Math.random()} className={style.dataItem}>
                            <BooleanField reference={references[content.id].ref} name={content.definition} default={origVal && origVal === '1' ? true : false} /><br /><br />
                        </div>
                    );
                case 'C':
                    return (
                        <div key={Math.random()} className={style.dataItem}>
                            <label>{content.definition}</label>
                            <SelectField origVal={origVal ? origVal : null} reference={references[content.id].ref} choices={content.permittedValues.split(',')} /><br /><br />
                        </div>
                    );
                case 'D':
                    dateSlot = origVal ? moment(origVal, moment.ISO_8601) : undefined;
                    dateSlot = dateSlot && dateSlot.isValid() ? dateSlot : undefined;
                    return (
                        <div key={Math.random()} className={style.dataItem}>
                            <label>{content.definition}</label>
                            <PickDate startDate={dateSlot ? dateSlot : undefined} reference={references[content.id].ref} /><br />
                        </div>
                    );
                case 'FAB':
                    return (
                        <div key={Math.random()} className={style.dataItem}>
                            <label>{content.definition}{content.unit ? <em> in {content.unit}</em> : ''}</label>
                            <AntibodyField origVal={origVal ? origVal : null} reference={references[content.id].ref} /><br /><br />
                        </div>
                    );
                default:
                    return (
                        <div key={Math.random()} className={style.dataItem}>
                            <label>{content.definition}{content.unit ? <em> in {content.unit}</em> : ''}</label>
                            <TextField origVal={origVal ? origVal : null} reference={references[content.id].ref} /><br /><br />
                        </div>
                    );
            }
        } else {
            return (
                <div key={title} className={style.level}>
                    <div className={style.levelHeader}> {title}</div>
                    <div className={style.levelBody}>{Object.entries(content).map(curry)}</div>
                </div>
            );
        }
    };
    return curry;
};