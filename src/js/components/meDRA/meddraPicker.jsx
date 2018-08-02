import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { treeDataForAntd } from './meddraArrForAntd';
import style from './meddra.module.css';


/* Usage: <MeddraPicker key={key} defaultValue={defaultValue} onChange={onchange}/>;
key must be present and unique (and generated from url id) so component remounts when url changes;
also need to pass an onChange handler from parent to change the parent's state */
export class MeddraPicker extends Component {
    constructor(props){
        super();
        this.state = { value: props.defaultValue || undefined };
    }

    onChange = (value) => {
        console.log(value);
        this.setState({ value });
        this.props.onChange(/* */);
    }

    render() {
        return (
            <div className={style.wrapper}>  {/* this div must be here for the positioning of the drop down menu with scrolling */}
                <TreeSelect
                    style={{ width: 300 }}
                    value={this.state.value}
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                    treeData={treeDataForAntd}
                    placeholder="Please select"
                    onChange={this.onChange}
                    getPopupContainer={ev => ev.parentElement}
                />
            </div>
        );
    }
}