import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz2 from "../../src/quizzes/Quiz2";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { View } from "react-native";

const mockNavigation = {
  state: {
    params: {
      Quizid: "133"
    }
  },
  replace: jest.fn()
};
const screenProps = {
  navigation: mockNavigation,
  id: "Quiz2"
};

const quiz2QuestionDataMock = {
  id: "133",
  type: "quiz",
  attributes: {
    theme: "black",
    quiz_type: "Quiz-2",
    questions: [
      {
        id: "185",
        type: "question",
        attributes: {
          question_type: "title",
          title:
            "What is name of this heritage place? (Answer and win 50 Rs Amazon voucher)",
          question_image:
            "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcEVGIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--6e7703cf09697fce70cb639bf1dcdd46e40f1b3e/Princep%20ghat.jpg",
          options: [
            {
              id: "647",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Calcutta Town Hall",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "648",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Prinsep Ghat",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "649",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Birla Mandir",
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
const feature = loadFeature("./__tests__/features/quiz2-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to quiz2", ({ given, when, then }) => {
    let quiz2Wrapper: ShallowWrapper;
    let instance: Quiz2;
    given("I am a User loading quiz2", () => {
      quiz2Wrapper = shallow(<Quiz2 {...screenProps} />);
      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz2", () => {
      instance = quiz2Wrapper.instance() as Quiz2;
      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });
    then("quiz2 will load with out errors", () => {
      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });

    then("Quiz2 will display messages", () => {
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
            type: "quiz2",
            attributes: {
              id: 1,
              title: "Quiz2_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz2",
            attributes: {
              id: 2,
              title: "Quiz2 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });
    then("Quiz2 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });
    then("Quiz2 will display notifcation if API failure", () => {
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

      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz2Wrapper).toBeTruthy();
      expect(quiz2Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz2;

    given("I am a User attempting to quiz", () => {
      quizWrapper = shallow(<Quiz2 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz", () => {
      instance = quizWrapper.instance() as Quiz2;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });

  test("test for you win quiz2", ({ given, when, then }) => {
    let quiz2Wrapper: ShallowWrapper;
    let instance: Quiz2;

    given("I am a User navigate to quiz2 win", () => {
      quiz2Wrapper = shallow(<Quiz2 {...screenProps} />);
      expect(quiz2Wrapper).toBeTruthy();
    });

    when("I am user try to load quiz2 win", () => {
      instance = quiz2Wrapper.instance() as Quiz2;
      instance.setState({
        quizQuestionData: quiz2QuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz2", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz1", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz2;

    given("I am a User navigate to quiz1 loss", () => {
      quizWrapper1 = shallow(<Quiz2 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz1 loss", () => {
      instance = quizWrapper1.instance() as Quiz2;
      instance.setState({
        quizQuestionData: null,
        index: 0
      });
    });

    then("I loss the quiz1", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz1 options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz2;

    given("I can see quiz1 options", () => {
      quizWrapper1 = shallow(<Quiz2 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one oaption of quiz1", () => {
      instance = quizWrapper1.instance() as Quiz2;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quiz2QuestionDataMock
      });
      instance.handelOnComplete();
    });

    then("I  clicked wrong  answer", () => {
      instance.handelOptionPress(
        quiz2QuestionDataMock.attributes.questions[0].attributes.options[1],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quiz2QuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer 2", () => {
      instance.handelOptionPress(
        quiz2QuestionDataMock.attributes.questions[0].attributes.options[2],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });
  });
});
