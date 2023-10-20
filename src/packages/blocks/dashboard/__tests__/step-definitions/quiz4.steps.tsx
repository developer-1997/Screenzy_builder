import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Quiz4 from "../../src/quizzes/Quiz4";
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
      Quizid: "134"
    }
  },
  replace: jest.fn()
};

const screenProps = {
  navigation: mockNavigation,
  id: "Quiz4"
};
const feature = loadFeature("./__tests__/features/quiz4-scenario.feature");

const quiz4QuestionDataMock = {
  id: "134",
  type: "quiz",
  attributes: {
    theme: "black",
    quiz_type: "Quiz-4",
    questions: [
      {
        id: "167",
        type: "question",
        attributes: {
          question_type: "title",
          title: "What do you do with your e-waste?",
          question_image:
            "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcmdEIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--f78327a9b81ef5fc6b5521601296397d90e323db/Hulladek%20Img.png",
          options: [
            {
              id: "585",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Hoard it",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "586",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Sell it",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "587",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "Recycle it with Hulladek",
                is_correct: true,
                option_image: null
              }
            }
          ]
        }
      },
      {
        id: "168",
        type: "question",
        attributes: {
          question_type: "title",
          title: "How much e-waste does India generate?",
          question_image:
            "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcmtEIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7142f99c6225b17b328debeb16abc12c9e207ed1/Hulladek%20Img.png",
          options: [
            {
              id: "588",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "3.23 million tonnes per year",
                is_correct: true,
                option_image: null
              }
            },
            {
              id: "589",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "2.62 million tonnes per year",
                is_correct: false,
                option_image: null
              }
            },
            {
              id: "590",
              type: "option",
              attributes: {
                option_type: "title",
                option_title: "4.18 million tonnes per year",
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

  test("User navigates to quiz4", ({ given, when, then }) => {
    let quiz4Wrapper: ShallowWrapper;
    let instance: Quiz4;
    given("I am a User loading quiz4", () => {
      quiz4Wrapper = shallow(<Quiz4 {...screenProps} />);
      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });

    when("I navigate to the quiz4", () => {
      instance = quiz4Wrapper.instance() as Quiz4;
      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });
    then("quiz4 will load with out errors", () => {
      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });

    then("Quiz4 will display messages", () => {
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
            type: "quiz4",
            attributes: {
              id: 1,
              title: "Quiz4_title_1",
              value: 1,
              created_at: "2023-04-02T17:10:08.139Z",
              updated_at: "2023-04-02T17:10:08.139Z"
            }
          },
          {
            id: 2,
            type: "quiz4",
            attributes: {
              id: 2,
              title: "Quiz4 5",
              value: 5,
              created_at: "2023-04-02T17:10:36.867Z",
              updated_at: "2023-04-02T17:10:36.867Z"
            }
          }
        ]
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });
    then("Quiz4 will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });
    then("Quiz4 will display notifcation if API failure", () => {
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

      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(quiz4Wrapper).toBeTruthy();
      expect(quiz4Wrapper).toMatchSnapshot();
    });
  });

  test("test for show quiz modal", ({ given, when, then }) => {
    let quizWrapper: ShallowWrapper;
    let instance: Quiz4;

    given("I am a User attempting to quiz", () => {
      quizWrapper = shallow(<Quiz4 {...screenProps} />);
      expect(quizWrapper).toBeTruthy();
    });

    when("I am user try to attempting quiz", () => {
      instance = quizWrapper.instance() as Quiz4;
      instance.setState({ quizQuestionLoaded: true });
    });

    then("I can attempt the quiz", () => {
      expect(quizWrapper.contains(<View testID="showQuiz" />)).toBe(false);
    });
  });
  test("test for you win quiz4", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz4;

    given("I am a User navigate to quiz4 win", () => {
      quizWrapper1 = shallow(<Quiz4 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz4 win", () => {
      instance = quizWrapper1.instance() as Quiz4;
      instance.setState({
        quizQuestionData: quiz4QuestionDataMock,
        index: 0
      });
    });

    then("I win the quiz4", () => {
      instance.handelOnComplete();
    });
  });

  test("test for you loss quiz4", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz4;

    given("I am a User navigate to quiz4 loss", () => {
      quizWrapper1 = shallow(<Quiz4 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to load quiz4 loss", () => {
      instance = quizWrapper1.instance() as Quiz4;
      instance.setState({
        index: 0
      });
    });

    then("I loss the quiz4", () => {
      instance.handelOnComplete();
    });
  });

  test("test for clicked quiz4 options", ({ given, when, then }) => {
    let quizWrapper1: ShallowWrapper;
    let instance: Quiz4;

    given("I can see quiz4 options", () => {
      quizWrapper1 = shallow(<Quiz4 {...screenProps} />);
      expect(quizWrapper1).toBeTruthy();
    });

    when("I am user try to click one option of quiz4", () => {
      instance = quizWrapper1.instance() as Quiz4;
      instance.setState({
        index: 0,
        timerClock: 15,
        quizQuestionData: quiz4QuestionDataMock
      });
      instance.handelOnComplete();
    });

    then("I  clicked wrong  answer", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[0].attributes.options[1],
        1
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked right answer", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[0].attributes.options[0],
        0
      );
    });

    then("I can clicked right answer 2", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[0].attributes.options[2],
        2
      );
    });

    then("I clicked q2 wrong  answer", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[1].attributes.options[0],
        0
      );
      expect(quizWrapper1).toBeTruthy();
    });

    then("I can clicked q2 right answer", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[1].attributes.options[1],
        0
      );
    });

    then("I can clicked q2 right answer 2", () => {
      instance.handelOptionPress(
        quiz4QuestionDataMock.attributes.questions[1].attributes.options[2],
        0
      );
    });
  });
});
