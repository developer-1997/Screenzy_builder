import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import Geofence  from "../../src/Geofence.web";
import GeofenceList from "../../../../components/src/GeofenceList.web";
import Radar from 'radar-sdk-js';
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "Geofence",
};

jest.mock('radar-sdk-js', () => ({
  initialize: jest.fn(),
  getLocation: jest.fn(),
}));

const mockGetLocation = jest.spyOn(Radar, 'getLocation');

const screenGeofenceListProps = {
  title:"" ,
  geofenceList : [
    {
      created_at: "2023-04-03T16:56:03.149+05:30" ,
      disabled: false , 
      id: 313,
  ​​​    identifier: "D-Girgaon Chowpatty-BOM",
      latitude: 18.953725 ,
      longitude: 72.8145683,
      notify_on_entry: false,
  ​    notify_on_exit: false,
  ​    radius: 500,
      updated_at: "2023-07-05T18:48:48.865+05:30"
    } ,

  ] ,
  handleEditClick:jest.fn()
};


const feature = loadFeature(
  "./__tests__/features/Geofence-scenario.web.feature"
);

jest.mock("../../src/geofence.css",() => {})

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to Geofence", ({ given, when, then }) => {
    let geofenceBlock: ShallowWrapper;
    let instance: Geofence;

    given("I am a User loading Geofence", () => {
      geofenceBlock = shallow(<Geofence {...screenProps} />);
    });

    when("I navigate to the Geofence", () => {
      instance = geofenceBlock.instance() as Geofence;
      instance.componentDidMount()

    });

    then("Geofence will load with out errors", () => {
      expect(geofenceBlock).toBeTruthy();
    });

    then("I can render with VIEW without errors", () => {
      let geofenceBlockCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'addButtonId');
      let geofenceAddCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'geofenceListId');
      geofenceAddCom.renderProp("handleEditClick")(screenGeofenceListProps.geofenceList[0]);
      geofenceBlockCom.renderProp("createGeofenceHandler")(screenGeofenceListProps.geofenceList[0]);
    });


    then("open editor without errors", () => {
      let geofenceAddCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'geofenceEditor');
      geofenceAddCom.renderProp("handlerIdfChange")("VIEW");
      geofenceAddCom.renderProp("handlerRadChange")(200);
      geofenceAddCom.renderProp("handlerLatChange")("VIEW");
      geofenceAddCom.renderProp("handlerLngChange")("VIEW");
      geofenceAddCom.renderProp("HandleSubmit")();
    });

    then("open editor without value", () => {
      let geofenceAddCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'geofenceEditor');
      geofenceAddCom.renderProp("handlerIdfChange")("");
      geofenceAddCom.renderProp("handlerRadChange")(200);
      geofenceAddCom.renderProp("handlerLatChange")("");
      geofenceAddCom.renderProp("handlerLngChange")("");
      geofenceAddCom.renderProp("HandleSubmit")();
    });

    then("I can click backButton without errors", () => {
      let geofenceAddCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'backButtonId');
      geofenceAddCom.renderProp("handleBackClick")("VIEW");
    });

    then("open editor and update", () => {
      let geofenceEditCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'geofenceListId');
      geofenceEditCom.renderProp("handleEditClick")(screenGeofenceListProps.geofenceList[0]);
      let geofenceAddCom = geofenceBlock.findWhere((node) => node.prop('data-test-id') === 'geofenceEditor');
      geofenceAddCom.renderProp("HandleSubmit")();
      geofenceAddCom.renderProp("HandleDelete")(313);

    });

    then("geofenceDataApiCallId api will return success", () => {
      const msgLogInSucessRestAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgLogInSucessRestAPI.messageId
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            data:  screenGeofenceListProps.geofenceList , 
          }
      );  
      instance.geofenceDataApiCallId = msgLogInSucessRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI);
    })

    then("geofenceUpdateApiCallId api will return success", () => {
      const msgLogInSucessRestAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgLogInSucessRestAPI.messageId
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            data:  {
              id:123
            } , 
          }
      );
      instance.geofenceUpdateApiCallId = msgLogInSucessRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI);
    })

    then("geofenceDeleteApiCallId api will return success", () => {
      const msgLogInSucessRestAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgLogInSucessRestAPI.messageId
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            data:  {
              message:"Deleted"
            }, 
          }
      );
      instance.geofenceDeleteApiCallId = msgLogInSucessRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI);
    })

 
    then("geofenceCreateApiCallId api will return success", () => {
      const msgLogInSucessRestAPI = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          msgLogInSucessRestAPI.messageId
      );
      msgLogInSucessRestAPI.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          {
            data:  {
              id:123
            }, 
          }
      );
      instance.geofenceCreateApiCallId = msgLogInSucessRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI);
    })

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(geofenceBlock).toBeTruthy();
    });
  });
});
