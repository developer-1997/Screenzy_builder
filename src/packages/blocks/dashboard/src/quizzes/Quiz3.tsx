// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  BackHandler,
  ActivityIndicator
} from "react-native";
import DashboardController from "../DashboardController";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { globalQuizStyles } from "./quizStyles.js";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { RFValue as rs } from "react-native-responsive-fontsize";

let tempArray = [];
const DEFAULT_STATES = {
  count: 0,
  // Questions: [...Data],
  answerRight: "#f5f5f5",
  index: 0,
  timer: 5,
  questionAsk: true,
  win: true,
  visible: false,
  answered: false,
  key: 0
};

export default class Quiz3 extends DashboardController {
  constructor(props) {
    super(props);
    this.state = { ...DEFAULT_STATES };
  }

  componentWillMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    let Quizid = this.props.navigation.state.params.quizId;
    if (Quizid) {
      this.setState({
        Quizid: Quizid,
        QuizTheme: this.props.navigation.state.params.theme
      });
      this.fetchQuizeData(Quizid);
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);

    this.setState({ ...DEFAULT_STATES });
    let Quizid = this.props.navigation.state.params.quizId;
    this.saveUserQuizAnswers(Quizid, tempArray);

    setTimeout(() => {
      tempArray.length = 0;
    }, 500);
  }

  MoveToNextQuestion = nextIndex => {
    this.setState({ index: nextIndex });
  };

  quizLost = () => {
    this.setState({ visible: true });

    setTimeout(() => {
      this.setState({ visible: false, win: true });
      this.props.navigation.navigate("Home");
    }, 3000);
    this.setState({ videoPlay: false });
  };
  handleBackButton() {
    return true;
  }

  handelOnComplete = () => {
    let temp = { ...this.state.quizQuestionData };
    /* istanbul ignore next */
    if (
      this.state.index + 1 >=
      this.state.quizQuestionData.attributes.questions.length
    ) {
      if (temp.attributes.questions[this.state.index].Answered == undefined) {
        let tempobj = {
          question_id: temp.attributes.questions[this.state.index].id,
          option_id: null
        };
        tempArray.push(tempobj);
      }

      if (
        temp.attributes.questions[this.state.index].Answered &&
        this.state.win
      ) {
        this.props.navigation.replace("Win", {
          id: this.props.navigation.state.params.quizId
        });
      } else {
        this.quizLost();
      }
    } else {
      let temp = { ...this.state.quizQuestionData };
      if (temp.attributes.questions[this.state.index].Answered == undefined) {
        this.setState({ win: false });

        let tempobj = {
          question_id: temp.attributes.questions[this.state.index].id,
          option_id: null
        };
        tempArray.push(tempobj);
      }

      this.setState({
        quizQuestionData: temp
      });
      console.log(temp);
      this.MoveToNextQuestion(this.state.index + 1);
      return { shouldRepeat: true, delay: 1 };
    }
  };

  handelOptionPress = (item, index) => {
    let temp = { ...this.state.quizQuestionData };

    for (
      let i = 0;
      i < temp.attributes.questions[this.state.index].attributes.options.length;
      i++
    ) {
      let CurrentOption =
        temp.attributes.questions[this.state.index].attributes.options[i];
      if (CurrentOption.id == item.id) {
        if (CurrentOption.attributes.is_correct) {
          CurrentOption.bg = "green";
          this.setState({
            count: this.state.count + 1,
            answered: true
          });
          if (
            this.state.index + 1 >=
            this.state.quizQuestionData.attributes.questions.length
          ) {
            if (this.state.win) {
              this.props.navigation.replace("Win", {
                id: this.props.navigation.state.params.quizId
              });
            } else {
              this.quizLost();
            }
          } else {
            this.MoveToNextQuestion(this.state.index + 1);
            this.setState({ key: this.state.key + 1 });
          }
        } else {
          this.setState({ win: false, answered: true });
          CurrentOption.bg = "red";
          if (
            this.state.index + 1 >=
            this.state.quizQuestionData.attributes.questions.length
          ) {
            this.quizLost();
          } else {
            this.MoveToNextQuestion(this.state.index + 1);
            this.setState({ key: this.state.key + 1 });
          }
        }
      } else {
        CurrentOption.bg = null;
      }
      temp.attributes.questions[this.state.index].attributes.options[
        i
      ] = CurrentOption;
    }
    temp.attributes.questions[this.state.index].Answered = true;

    this.setState({
      quizQuestionData: temp
    });
    let tempobj = {
      question_id: temp.attributes.questions[this.state.index].id,
      option_id:
        temp.attributes.questions[this.state.index].attributes.options[index].id
    };
    tempArray.push(tempobj);
  };

  render() {
    if (!this.state.quizQuestionLoaded) {
      return (
        <View style={globalQuizStyles.wrapperQuiz}>
          <Image
            source={require("../../assets/mainlogo.png")}
            style={globalQuizStyles.mainLogo}
          />
          <ActivityIndicator size={"large"} color="#fff" />
        </View>
      );
    }

    return (
      <View testID="showQuiz" style={globalQuizStyles.showQuiz}>
        <Image
          source={require("../../assets/mainlogo.png")}
          style={globalQuizStyles.showQuizIcon}
        />
        <Modal
          style={{}}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {}}
        >
          <View style={globalQuizStyles.modalWrapperOne}>
            <View style={globalQuizStyles.modalWrapperTwo}>
              <Image
                source={require("../../assets/networkloss.png")}
                style={globalQuizStyles.lostIcon}
              />
              <Text style={globalQuizStyles.lostTextOne}>Oh No!!</Text>
              <View style={{ padding: rs(10) }}>
                <Text style={globalQuizStyles.lostTextTwo}>
                  Looks like you lost, Better Luck Next Time.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            width: "100%",

            borderRadius: rs(5),
            alignItems: "center",
            padding: rs(10)
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: rs(14),

              backgroundColor: "#fff",
              padding: rs(10),
              borderRadius: rs(25),
              width: rs(400),
              textAlign: "center",
              fontFamily: "Montserrat-SemiBold"
            }}
          >
            {
              this.state.quizQuestionData.attributes.questions[this.state.index]
                .attributes.title
            }
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              top: 20,
              zIndex: -10,
              position: "absolute"
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "orange",
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <CountdownCircleTimer
                key={this.state.key}
                strokeWidth={5}
                trailColor={"#fff"}
                size={50}
                rotation={"counterclockwise"}
                isPlaying
                duration={
                  this.props.navigation.state.params.question_Time
                    ? this.props.navigation.state.params.question_Time
                    : 5
                }
                colors={["#8F00FF", "#8F00FF", "#8F00FF", "#8F00FF"]}
                colorsTime={[5, 2, 0]}
                onComplete={this.handelOnComplete}
              >
                {({ remainingTime }) => (
                  <Text style={{ color: "#fff" }}>
                    {remainingTime < 10 ? "0" : null}
                    {remainingTime}
                  </Text>
                )}
              </CountdownCircleTimer>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#fff",
              width: wp(15),
              position: "absolute",
              bottom: rs(35)
            }}
          />
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#fff",
              width: wp(15),
              position: "absolute",
              bottom: rs(90)
            }}
          />
          <FlatList
            numColumns={2}
            contentContainerStyle={{ marginTop: rs(10) }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            data={
              this.state.quizQuestionData.attributes.questions[this.state.index]
                .attributes.options
            }
            extraData={this.state.Questions}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              console.log(item.answer, "flatlist");
              return (
                <TouchableOpacity
                  onPress={() => this.handelOptionPress(item, index)}
                  style={{
                    backgroundColor: item && item.bg ? item.bg : "#f5f5f5",
                    padding: rs(10),
                    elevation: rs(5),
                    marginTop: rs(10),
                    borderRadius: rs(25),
                    width: rs(165),
                    alignItems: "center",
                    marginHorizontal: 60,
                    marginVertical: 10
                  }}
                  disabled={
                    this.state.quizQuestionData.attributes.questions[
                      this.state.index
                    ].Answered
                  }
                >
                  <Text
                    style={{
                      color: "#000",
                      fontSize: rs(14),

                      fontFamily: "Montserrat-Medium"
                    }}
                  >
                    {item.attributes.option_title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  }
}
