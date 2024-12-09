// eslint-disable-next-line no-unused-vars
import { PureComponent } from 'react';
import browserBehaviour from '../../utilities/browserBehaviour';
import 'react-datepicker/dist/react-datepicker.css';
import 'draft-js/dist/Draft.css';
import './body.css';
import './datepicker.css';
import './tree.css';

export default class Body extends PureComponent {

    // Custom name for container
    static displayName = 'Body';

    componentDidMount() {
        browserBehaviour.apply();
    }

    render() {
        const { children } = this.props;
        return children ? children : null;
    }
}
