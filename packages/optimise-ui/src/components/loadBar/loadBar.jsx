import { PureComponent } from 'react';
import style from './loadBar.module.css';

class LoadBar extends PureComponent {
    render() {
        return (
            <div className={style.loader}></div>
        );
    }
}

export default LoadBar;
