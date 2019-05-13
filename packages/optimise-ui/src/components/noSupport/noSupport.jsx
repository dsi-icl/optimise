import 'core-js/es6/';
import 'es6-promise/auto';
import 'es6-object-assign';
import React, { Component } from 'react';
import style from './noSupport.module.css';
import firefoxImg from './firefox.png';
import chromeImg from './chrome.png';
import edgeImg from './ms-edge.png';

export default class NoSupport extends Component {
    render() {
        return (
            <div className={style.inlay}>
                <span className={style.helper}></span>
                <div className={style.backing}>
                    <span>Oops, Optimise MS only supports modern browsers !</span><br />
                    <span>Please contact your IT administrator for more information.</span><br /><br /><br />
                    <div>
                        <img src={chromeImg} alt="Chrome" /><br /><br /><br />
                        <em>Chrome &gt; 60</em>
                    </div>
                    <div className={style.pad}></div>
                    <div>
                        <img src={edgeImg} alt="Edge" /><br /><br /><br />
                        <em>Edge &gt; 30</em>
                    </div>
                    <div className={style.pad}></div>
                    <div>
                        <img src={firefoxImg} alt="Firefox" /><br /><br /><br />
                        <em>Firefox &gt; 40</em>
                    </div>
                </div>
            </div>
        );
    }
}