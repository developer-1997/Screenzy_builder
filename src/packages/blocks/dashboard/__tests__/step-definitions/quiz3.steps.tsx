import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz3 from "../../src/quizzes/Quiz3";
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
  id: "Quiz3"
};
const feature = loadFeature("./__tests__/features/quiz3-scenario.feature");

const quiz3QuestionDataMock = {
  id: "132",
  type: "quiz",
  attributes: {
    theme: "black",
    quiz_type: "Quiz-3",
    questions: [
      {
        id: "183",
        type: "question",
        attributes: {
          question_type: "title",
          title: "Which bird is this? (Answer and win 30 Rs Amazon voucher)",
          question_image:
            "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcEFGIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8ff3dca0522348ac1543e6ac00d646bfdf8d219e/Macaw.jpg",
          options: [
            {
              id: "641",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Macaw",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "642",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Nightingale",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "643",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Kingfisher",
                is_correct: false,
                option_image: null
              }
            }
          ]
        }
      },
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

  test("User navigates to quiz3", ({ given, when, then }) => {
    let quiz3Wrapper: ShallowWrapper;
    let instance: Quiz3;
    given("I am a User loading quiz3", () => {
      quiz3Wrapper = shallow(<Quiz3 {...screenProps} />);
      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz3", () => {
      instance = quiz3Wrapper.instance() as Quiz3;
      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });
    then("quiz3 will load with out errors", () => {
      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });

    then("Quiz3 will display messages", () => {
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
            type: "quiz3",
            attributes: {
              id: 1,
              title: "Quiz3_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz3",
            attributes: {
              id: 2,
              title: "Quiz3 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });
    then("Quiz3 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });
    then("Quiz3 will display notifcation if API failure", () => {
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

      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz3Wrapper).toBeTruthy();
      expect(quiz3Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz3;

    given("I am a User attempting to quiz", () => {
      quizWrapper = shallow(<Quiz3 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz", () => {
      instance = quizWrapper.instance() as Quiz3;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });

  test("test for you win quiz3", ({ given, when, then }) => {
    let quiz3Wrapper: ShallowWrapper;
    let instance: Quiz3;

    given("I am a User navigate to quiz3 win", () => {
      quiz3Wrapper = shallow(<Quiz3 {...screenProps} />);
      expect(quiz3Wrapper).toBeTruthy();
    });

    when("I am user try to load quiz3 win", () => {
      instance = quiz3Wrapper.instance() as Quiz3;
      instance.setState({
        quizQuestionData: quiz3QuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz3", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz3", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz3;

    given("I am a User navigate to quiz3 loss", () => {
      quizWrapper1 = shallow(<Quiz3 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz3 loss", () => {
      instance = quizWrapper1.instance() as Quiz3;
      instance.setState({
        index: 0
      });
    });

    then("I loss the quiz3", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz3 options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz3;

    given("I can see quiz3 options", () => {
      quizWrapper1 = shallow(<Quiz3 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one oaption of quiz3", () => {
      instance = quizWrapper1.instance() as Quiz3;
      instance.setState({
        win: true,
        index: 0,
        timerClock: 15,
        quizQuestionData: quiz3QuestionDataMock
      });
      instance.handelOnComplete();
    });

    then("I  clicked wrong  answer", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[0].attributes.options[1],
        0
      );
    });

    then("I can clicked right answer 2", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[0].attributes.options[2],
        0
      );
    });

    then("I  clicked q2 wrong  answer", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[1].attributes.options[0],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked q2 right answer", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[1].attributes.options[1],
        0
      );
    });

    then("I can clicked q2 right answer 2", () => {
      instance.handelOptionPress(
        quiz3QuestionDataMock.attributes.questions[1].attributes.options[2],
        0
      );
    });
  });
});
