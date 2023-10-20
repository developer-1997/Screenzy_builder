import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Geofence from "../../src/Geofence"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Geofence"
  }

const feature = loadFeature('./__tests__/features/Geofence-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Geofence', ({ given, when, then }) => {
        let geofenceBlock:ShallowWrapper;
        let instance:Geofence; 

        given('I am a User loading Geofence', () => {
            geofenceBlock = shallow(<Geofence {...screenProps}/>);
        });

        when('I navigate to the Geofence', () => {
             instance = geofenceBlock.instance() as Geofence
        });

        then('Geofence will load with out errors', () => {
            expect(geofenceBlock).toBeTruthy();
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(geofenceBlock).toBeTruthy();
        });
    });


});
