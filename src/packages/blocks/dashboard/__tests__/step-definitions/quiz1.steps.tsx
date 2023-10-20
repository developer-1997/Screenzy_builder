import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz1 from "../../src/quizzes/Quiz1";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { View } from "react-native";

const mockNavigation = {
  state: {
    params: {
      Quizid: "135"
    }
  },
  replace: jest.fn()
};

const screenProps = {
  navigation: mockNavigation,
  id: "Quiz1"
};
const feature = loadFeature("./__tests__/features/quiz1-scenario.feature");

const quizQuestionDataMock = {
  id: "135",
  type: "quiz",
  attributes: {
    theme: "black",
    quiz_type: "Quiz-1",
    questions: [
      {
        id: "169",
        type: "question",
        attributes: {
          question_type: "title",
          title:
            "Do you like to get 20% discount on your Hoichoi subscription? ",
          question_image:
            "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdTBEIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--ee27116e36d3d2cd71f0266a6a233e8cdf723451/Hoichoi-Logos-3.png",
          options: [
            {
              id: "591",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Yes, 100%",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "592",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "No",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "593",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "I already have Subscription ",
                is_correct: true,
                option_image: null
              }
            }
          ]
        }
      }
    ]
  }
};
defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to quiz1", ({ given, when, then }) => {
    let quiz1Wrapper: ShallowWrapper;
    let instance: Quiz1;
    given("I am a User loading quiz1", () => {
      quiz1Wrapper = shallow(<Quiz1 {...screenProps} />);
      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz1", () => {
      instance = quiz1Wrapper.instance() as Quiz1;
      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });
    then("quiz1 will load with out errors", () => {
      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });

    then("Quiz1 will display messages", () => {
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
            type: "quiz1",
            attributes: {
              id: 1,
              title: "Quiz1_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz1",
            attributes: {
              id: 2,
              title: "Quiz1 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });
    then("Quiz1 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });
    then("Quiz1 will display notifcation if API failure", () => {
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

      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz1Wrapper).toBeTruthy();
      expect(quiz1Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz1 modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz1;

    given("I am a User attempting to quiz1", () => {
      quizWrapper = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz1", () => {
      instance = quizWrapper.instance() as Quiz1;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz1", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });

  test("test for you win quiz1", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz1;

    given("I am a User navigate to quiz1 win", () => {
      quizWrapper1 = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz1 win", () => {
      instance = quizWrapper1.instance() as Quiz1;
      instance.setState({
        quizQuestionData: quizQuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz1", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz1", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz1;

    given("I am a User navigate to quiz1 loss", () => {
      quizWrapper1 = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz1 loss", () => {
      instance = quizWrapper1.instance() as Quiz1;
      instance.setState({
        index: 0
      });
    });

    then("I loss the quiz1", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz1 right option", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz1;

    given("I can see quiz1 options", () => {
      quizWrapper1 = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one option of quiz1", () => {
      instance = quizWrapper1.instance() as Quiz1;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quizQuestionDataMock
      });
      instance.handelOnComplete();
    });
    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quizQuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
    });
  });

  test("test for clicked quiz1 wrong options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz1;

    given("I can see quiz1 options", () => {
      quizWrapper1 = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one option of quiz1", () => {
      instance = quizWrapper1.instance() as Quiz1;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quizQuestionDataMock
      });
      instance.handelOnComplete();
    });
    then("I can clicked wrong answer", () => {
      instance.handelOptionPress(
        quizQuestionDataMock.attributes.questions[0].attributes.options[1],
        0
      );
    });
  });

  test("test for clicked quiz1 right option 2", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz1;

    given("I can see quiz1 options", () => {
      quizWrapper1 = shallow(<Quiz1 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one option of quiz1", () => {
      instance = quizWrapper1.instance() as Quiz1;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quizQuestionDataMock
      });
      instance.handelOnComplete();
    });
    then("I  clicked right  answer 2", () => {
      instance.handelOptionPress(
        quizQuestionDataMock.attributes.questions[0].attributes.options[2],
        0
      );
    });
  });
});
