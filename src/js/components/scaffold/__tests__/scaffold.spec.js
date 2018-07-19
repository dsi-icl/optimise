import React from 'react';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar, ErrorMessage  } from '../index';
import { Navlink } from 'react-router-dom';
import { shallow } from 'enzyme';

describe('Scaffold suite', () => {
    test('MenuBar shallow', () => {
        const e = shallow(<MenuBar/>);
        expect(e).toMatchSnapshot();
    });

    test('MiddlePanel shallow', () => {
        const wrapper = shallow(<MiddlePanel/>);
    });

    test('RightPanel shallow', () => {
        const wrapper = shallow(<RightPanel/>);
    });

    test('FarRightPanel shallow', () => {
        const wrapper = shallow(<FarRightPanel/>);
    });

    test('StatusBar shallow', () => {
        const wrapper = shallow(<StatusBar/>);
    });
});