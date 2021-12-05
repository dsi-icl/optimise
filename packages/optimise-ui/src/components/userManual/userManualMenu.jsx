import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import style from './userManual.module.css';
import markup from './userManualMenu.md';

export default class UserManual extends Component {

    constructor() {
        super();
        this.state = {
            hash: ''
        };
        this.defineActive = this.defineActive.bind(this);
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.defineActive, false);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.defineActive, false);
    }

    defineActive() {
        this.setState({
            hash: window.location.hash
        });
    }

    render() {
        const { hash } = this.state;
        return <>
            <div className={style.ariane}>
                <h2>Table of Content</h2>
            </div>
            <div className={`${style.panel} ${style.right}`}>
                <ReactMarkdown components={{
                    a: ({ href, children }) => <a href={href} className={hash === href ? style.active : ''}>{children}</a>
                }}>
                    {markup}
                </ReactMarkdown>
            </div>
        </>;
    }
}
