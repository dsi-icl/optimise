import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Zoom from 'react-medium-image-zoom';
import Helmet from '../scaffold/helmet';
import style from './userManual.module.css';
import markup from './userManual.md';

export default class UserManual extends Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <>
                <div className={style.ariane}>
                    <Helmet title='User Manual' />
                    <h2>User Manual</h2>
                </div>
                <div className={style.panel}>
                    <ReactMarkdown source={markup} escapeHtml={false} renderers={{
                        paragraph: ({ children }) => <div className={style.paragraph} >{children}</div>,
                        image: ({ alt, src }) => <Zoom>
                            <img alt={alt} src={src} className={style.bordered} />
                        </Zoom>
                    }} />
                </div>
            </>
        );
    }
}
