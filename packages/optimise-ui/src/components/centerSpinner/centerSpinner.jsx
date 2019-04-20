import React, { Component } from 'react';
import style from './centerSpinner.module.css';

class CenterSpinner extends Component {

    // Custom name for container
    static displayName = 'CenterSpinner';

    render() {

        return (
            <div className={style.centered}>
                <div className={style.top}></div>
                <div className={style.bottom}></div>
            </div>
        );
    }
}

export default CenterSpinner;

