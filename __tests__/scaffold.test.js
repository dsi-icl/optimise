import React from 'react';
import { MenuBar, MiddlePanel, RightPanel, FarRightPanel, StatusBar, ErrorMessage  } from '../src/js/components/scaffold/index';
import { Navlink } from 'react-router-dom';

describe('Scaffold suite', () => {
    test('MenuBar shallow', () => {
        const e = shallow(<MenuBar/>);
        expect(e.find(Navlink)).to.have.length(3);
        expect(e.find('a').to.have.length(1));
    });

    // test('MiddlePanel shallow', () => {
    //     const wrapper = shallow(<MiddlePanel/>);
    // });

    // test('RightPanel shallow', () => {
    //     const wrapper = shallow(<RightPanel/>);
    // });

    // test('FarRightPanel shallow', () => {
    //     const wrapper = shallow(<FarRightPanel/>);
    // });

    // test('StatusBar shallow', () => {
    //     const wrapper = shallow(<StatusBar/>);
    // });
});