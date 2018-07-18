import React, { PureComponent } from 'react';
import packageInfo from '../../../../package.json';
import style from './admin.module.css';

export class SystemInfo extends PureComponent {
    render() {
        return (
            <>
                This system relies on <pre className={style.packageName}>optimise-core</pre> v{packageInfo.dependencies['optimise-core']}
            </>
        )
    }
}