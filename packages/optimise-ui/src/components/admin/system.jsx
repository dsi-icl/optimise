import React, { PureComponent } from 'react';
// import corePackageInfo from '../../../../optimise-core/package.json';
import uiPackageInfo from '../../../package.json';
import style from './admin.module.css';

export class SystemInfo extends PureComponent {
    render() {
        return (
            <>
                This system relies on <pre className={style.packageName}>optimise-core</pre> v and <pre className={style.packageName}>optimise-ui</pre> v{uiPackageInfo.version}
            </>
        );
    }
}