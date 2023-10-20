import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz5 from "../../src/quizzes/Quiz5";
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
      Quizid: "131"
    }
  },
  replace: jest.fn()
};

const screenProps = {
  navigation: mockNavigation,
  id: "Quiz5"
};
const feature = loadFeature("./__tests__/features/quiz5-scenario.feature");

const quiz5QuestionDataMock = {
  id: "131",
  type: "quiz",
  attributes: {
    theme: "white",
    quiz_type: "Quiz-5",
    questions: [
      {
        id: "181",
        type: "question",
        attributes: {
          question_type: "title",
          title:
            "Who wrote Bande Mataram? (Answer and win 20 Rs Amazon voucher)",
          question_image: null,
          options: [
            {
              id: "633",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Rabindranath Tagore",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "634",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Bankimchandra Chatterjee",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "635",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Sharat chandra chattopadhyay",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "636",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Michael Madhusudan Dutt",
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

  test("User navigates to quiz5", ({ given, when, then }) => {
    let quiz5Wrapper: ShallowWrapper;
    let instance: Quiz5;
    given("I am a User loading quiz5", () => {
      quiz5Wrapper = shallow(<Quiz5 {...screenProps} />);
      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz5", () => {
      instance = quiz5Wrapper.instance() as Quiz5;
      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });
    then("quiz5 will load with out errors", () => {
      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });

    then("Quiz5 will display messages", () => {
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
            type: "quiz5",
            attributes: {
              id: 1,
              title: "Quiz5_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz5",
            attributes: {
              id: 2,
              title: "Quiz5 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });
    then("Quiz5 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });
    then("Quiz5 will display notifcation if API failure", () => {
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

      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz5Wrapper).toBeTruthy();
      expect(quiz5Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz5;

    given("I am a User attempting to quiz", () => {
      quizWrapper = shallow(<Quiz5 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz", () => {
      instance = quizWrapper.instance() as Quiz5;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });

  test("test for you win quiz5", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz5;

    given("I am a User navigate to quiz5 win", () => {
      quizWrapper1 = shallow(<Quiz5 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz5 win", () => {
      instance = quizWrapper1.instance() as Quiz5;
      instance.setState({
        quizQuestionData: quiz5QuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz5", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz5", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz5;

    given("I am a User navigate to quiz5 loss", () => {
      quizWrapper1 = shallow(<Quiz5 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz5 loss", () => {
      instance = quizWrapper1.instance() as Quiz5;
      instance.setState({
        index: 0
      });
    });

    then("I loss the quiz5", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz5 options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz5;

    given("I can see quiz5 options", () => {
      quizWrapper1 = shallow(<Quiz5 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one oaption of quiz5", () => {
      instance = quizWrapper1.instance() as Quiz5;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quiz5QuestionDataMock
      });
      instance.handelOnComplete();
    });

    then("I  clicked wrong  answer", () => {
      instance.handelOptionPress(
        quiz5QuestionDataMock.attributes.questions[0].attributes.options[1],
        1
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quiz5QuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
    });

    then("I can clicked right answer 2", () => {
      instance.handelOptionPress(
        quiz5QuestionDataMock.attributes.questions[0].attributes.options[2],
        2
      );
    });
    then("I can clicked option 4", () => {
      instance.handelOptionPress(
        quiz5QuestionDataMock.attributes.questions[0].attributes.options[3],
        0
      );
    });

    // then('I clicked q2 wrong  answer', () => {
    //   instance.handelOptionPress(quiz5QuestionDataMock.attributes.questions[1].attributes.options[0], 0);
    // });
    // then('I can clicked q2 right answer', () => {
    //   instance.handelOptionPress(quiz5QuestionDataMock.attributes.questions[1].attributes.options[1], 0);
    // });
    // then('I can clicked q2 right answer 2', () => {
    //   instance.handelOptionPress(quiz4QuestionDataMock.attributes.questions[1].attributes.options[2], 1);
    //   expect(quizWrapper1).toBeTruthy();
    // });
    // then('I can clicked q2 option 4', () => {
    //   instance.handelOptionPress(quiz5QuestionDataMock.attributes.questions[1].attributes.options[3], 0);
    // });
  });
});
