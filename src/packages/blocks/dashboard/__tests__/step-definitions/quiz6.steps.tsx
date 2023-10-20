import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz6 from "../../src/quizzes/Quiz6";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { View } from "react-native";

const navigation = require("react-navigation");
navigation.replace = jest.fn();
const mockNavigation = {
  state: {
    params: {
      Quizid: "136"
    }
  },
  replace: jest.fn()
};
const screenProps = {
  navigation: mockNavigation,
  id: "Quiz6"
};
const feature = loadFeature("./__tests__/features/quiz6-scenario.feature");

const quiz6QuestionDataMock = {
  id: "136",
  type: "quiz",
  attributes: {
    theme: "black",
    quiz_type: "Quiz-6",
    questions: [
      {
        id: "184",
        type: "question",
        attributes: {
          question_type: "title",
          title:
            "Which water animal has the strongest smelling ability? (Answer and win 30 Rs Amazon voucher)",
          question_image: null,
          options: [
            {
              id: "644",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Shark",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "645",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Whale",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "646",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Octopus",
                is_correct: false,
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

  test("User navigates to quiz6", ({ given, when, then }) => {
    let quiz6Wrapper: ShallowWrapper;
    let instance: Quiz6;
    given("I am a User loading quiz6", () => {
      quiz6Wrapper = shallow(<Quiz6 {...screenProps} />);
      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz6", () => {
      instance = quiz6Wrapper.instance() as Quiz6;
      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });
    then("quiz6 will load with out errors", () => {
      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });

    then("Quiz6 will display messages", () => {
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
            type: "quiz6",
            attributes: {
              id: 1,
              title: "Quiz6_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz6",
            attributes: {
              id: 2,
              title: "Quiz6 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });
    then("Quiz6 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });
    then("Quiz6 will display notifcation if API failure", () => {
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

      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz6Wrapper).toBeTruthy();
      expect(quiz6Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz6;

    given("I am a User attempting to quiz", () => {
      quizWrapper = shallow(<Quiz6 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz", () => {
      instance = quizWrapper.instance() as Quiz6;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });

  test("test for you win quiz6", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz6;

    given("I am a User navigate to quiz6 win", () => {
      quizWrapper1 = shallow(<Quiz6 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz6 win", () => {
      instance = quizWrapper1.instance() as Quiz6;
      instance.setState({
        quizQuestionData: quiz6QuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz6", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz6", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz6;

    given("I am a User navigate to quiz6 loss", () => {
      quizWrapper1 = shallow(<Quiz6 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz6 loss", () => {
      instance = quizWrapper1.instance() as Quiz6;
      instance.setState({
        index: 0
      });
    });

    then("I loss the quiz6", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz6 options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz6;

    given("I can see quiz6 options", () => {
      quizWrapper1 = shallow(<Quiz6 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one oaption of quiz6", () => {
      instance = quizWrapper1.instance() as Quiz6;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quiz6QuestionDataMock
      });
      instance.handelOnComplete();
    });

    then("I  clicked wrong  answer", () => {
      instance.handelOptionPress(
        quiz6QuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quiz6QuestionDataMock.attributes.questions[0].attributes.options[1],
        -2
      );
    });

    then("I can clicked right answer 2", () => {
      instance.handelOptionPress(
        quiz6QuestionDataMock.attributes.questions[0].attributes.options[2],
        -2
      );
    });
  });
});
