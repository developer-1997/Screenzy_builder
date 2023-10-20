import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import CfTeamviewerDeviceControl3rdPartyInteg from "../../src/CfTeamviewerDeviceControl3rdPartyInteg.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "CfTeamviewerDeviceControl3rdPartyInteg",
};

const feature = loadFeature(
  "./__tests__/features/CfTeamviewerDeviceControl3rdPartyInteg-scenario.web.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to CfTeamviewerDeviceControl3rdPartyInteg", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: CfTeamviewerDeviceControl3rdPartyInteg;

    given("I am a User loading CfTeamviewerDeviceControl3rdPartyInteg", () => {
      exampleBlockA = shallow(<CfTeamviewerDeviceControl3rdPartyInteg {...screenProps} />);
    });

    when("I navigate to the CfTeamviewerDeviceControl3rdPartyInteg", () => {
      instance = exampleBlockA.instance() as CfTeamviewerDeviceControl3rdPartyInteg;
    });

    then("CfTeamviewerDeviceControl3rdPartyInteg will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can enter text with out errors", () => {
      let textInputComponent = exampleBlockA.findWhere(
        (node) => node.prop("data-test-id") === "txtInput"
      );
      const event = {
        preventDefault() {},
        target: { value: "hello@aol.com" },
      };
      textInputComponent.simulate("change", event);
    });

    then("I can select the button with with out errors", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("data-test-id") === "btnAddExample"
      );
      buttonComponent.simulate("press");
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
    });
  });
});
