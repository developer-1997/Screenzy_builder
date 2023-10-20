import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Win from "../../src/quizzes/Win";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";

const navigation = require("react-navigation");
const screenProps = {
  navigation: navigation,
  id: "Win"
};
const feature = loadFeature("./__tests__/features/win-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to win", ({ given, when, then }) => {
    let winWrapper: ShallowWrapper;
    let instance: Win;
    given("I am a User loading win", () => {
      winWrapper = shallow(<Win {...screenProps} />);
      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });

    when("I navigate to the win", () => {
      instance = winWrapper.instance() as Win;
      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });
    then("win will load with out errors", () => {
      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });

    then("Win will display messages", () => {
      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      );
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);

      const apiMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [
          {
            id: 1,
            type: "win",
            attributes: {
              id: 1,
              title: "Win_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "win",
            attributes: {
              id: 2,
              title: "Win 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });
    then("Win will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });
    then("Win will display notifcation if API failure", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      const apiErrorResponceMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiErrorResponceMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { errors: "Error" }
      );
      runEngine.sendMessage("Unit Test", apiErrorResponceMsg);

      const apiFailedErrorResponceMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      runEngine.sendMessage("Unit Test", apiFailedErrorResponceMsg);

      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(winWrapper).toBeTruthy();
      expect(winWrapper).toMatchSnapshot();
    });
  });

  test("test For Input field", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Win;

    given("I am a User Loading win screen", () => {
      quizWrapper = shallow(<Win {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to fill input field", () => {
      instance = quizWrapper.instance() as Win;
    });

    then("I can enter my Name with out errors", () => {
      let textInputComponent = quizWrapper.findWhere(
        node => node.prop("testID") === "myName"
      );
      textInputComponent.simulate("changeText", "helloIamXYZ");
      expect(instance.state.userName).toEqual("helloIamXYZ");
    });
    then("I can enter my Number with out errors", () => {
      let textInputComponent = quizWrapper.findWhere(
        node => node.prop("testID") === "myNumber"
      );
      textInputComponent.simulate("changeText", "1234567890");
      expect(instance.state.userMobile).toEqual("1234567890");
    });
    then("I can enter my Email with out errors", () => {
      let textInputComponent = quizWrapper.findWhere(
        node => node.prop("testID") === "myEmail"
      );
      textInputComponent.simulate("changeText", "hello@aol.com");
      expect(instance.state.userEmail).toEqual("hello@aol.com");
    });
    then("I win the quiz", () => {
      //instance.handelOnComplete();
    });
    then("I win the quiz press", () => {
      instance.handelOnPress();
    });
  });

  test("test for clicked quiz1 right option", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Win;

    given("I can see quiz1 options", () => {
      quizWrapper1 = shallow(<Win {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one option of quiz1", () => {
      instance = quizWrapper1.instance() as Win;
      //instance.handelOnComplete();
    });
    then("I can change my mobile number", () => {
      instance.handlePhoneNumberChange("1234567890");
    });
  });
});
