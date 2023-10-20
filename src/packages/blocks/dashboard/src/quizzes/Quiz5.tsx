// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  BackHandler,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import DashboardController from "../DashboardController";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { RFValue as rs } from "react-native-responsive-fontsize";

const { height } = Dimensions.get("screen");
let tempArray = [];

const DEFAULT_STATES = {
  count: 0,
  timer: 5,
  answerRight: "#f5f5f5",
  index: 0,
  win: true,
  visible: false,
  answered: false,
  key: 0
};
export default class Quiz5 extends DashboardController {
  constructor(props) {
    super(props);
    this.state = { ...DEFAULT_STATES };
  }

  componentWillMount() {
    let Quizid = this.props.navigation.state.params.quizId;
    if (Quizid) {
      this.setState({
        Quizid: Quizid,
        QuizTheme: this.props.navigation.state.params.theme
      });
      this.fetchQuizeData(Quizid);
    }
  }
  qID = this.props.navigation.state.params.quizId;
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
    if (
      this.state.index + 1 >=
      this.state.quizQuestionData.attributes.questions.length
    ) {
      let temp = { ...this.state.quizQuestionData };
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
    const colorMap = {
      white: "#000",
      black: "#fff"
    };

    const csColorQuiz5 = colorMap[this.state.QuizTheme] || "grey";
    if (!this.state.quizQuestionLoaded) {
      return (
        <View style={styles.wrapperQuizFive}>
          <Image
            source={require("../../assets/mainlogo.png")}
            style={styles.mainLogoQuizFive}
          />
          <ActivityIndicator size={"large"} color="#fff" />
        </View>
      );
    }
    return (
      <View testID="showQuiz" style={styles.showQuizFive}>
        <Image
          source={require("../../assets/mainlogo.png")}
          style={styles.showQuizIconFive}
        />
        <Modal
          style={{}}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalWrapperOneQuizFive}>
            <View style={styles.modalWrapperTwoQuizFive}>
              <Image
                source={require("../../assets/networkloss.png")}
                style={styles.lostIconQuizFive}
              />
              <Text style={styles.quizFiveLostTextOne}>Oh No!!</Text>
              <View style={{ padding: rs(10) }}>
                <Text style={styles.quizFiveLostTextTwo}>
                  Looks like you lost, Better Luck Next Time.
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        <View
          style={{
            width: rs(250),
            height: height / 1.25,
            backgroundColor: this.state.QuizTheme
              ? this.state.QuizTheme
              : "#f5f5f5",
            borderRadius: rs(10),
            alignItems: "center",
            padding: rs(10)
          }}
        >
          <View
            style={{
              width: rs(40),
              height: rs(40),
              borderRadius: rs(20),
              backgroundColor: "orange",
              alignSelf: "flex-end"
            }}
          >
            <CountdownCircleTimer
              key={this.state.key}
              strokeWidth={5}
              trailColor={"#fff"}
              size={rs(40)}
              rotation={"counterclockwise"}
              isPlaying
              duration={
                this.props.navigation.state.params.question_Time
                  ? this.props.navigation.state.params.question_Time
                  : 5
              }
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              onComplete={this.handelOnComplete}
            >
              {({ remainingTime }) => (
                <Text style={{ color: "#fff", fontSize: rs(14) }}>
                  {remainingTime < 10 ? "0" : null}
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
          </View>
          <Text
            style={{
              color: csColorQuiz5,
              fontSize: rs(13),
              marginBottom: rs(5),
              padding: rs(5),
              fontFamily: "Montserrat-SemiBold"
            }}
          >
            {
              this.state.quizQuestionData.attributes.questions[this.state.index]
                .attributes.title
            }
          </Text>
          <View style={{ marginTop: -rs(10) }}>
            {this.state.quizQuestionData.attributes.questions[
              this.state.index
            ].attributes.options.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => this.handelOptionPress(item, index)}
                  style={{
                    backgroundColor: item && item.bg ? item.bg : "#f5f5f5",
                    padding: rs(10),
                    elevation: rs(5),
                    marginTop: rs(10),
                    borderRadius: rs(5),
                    width: rs(120),
                    height: height / 6,
                    alignItems: "center"
                  }}
                  disabled={
                    this.state.quizQuestionData.attributes.questions[
                      this.state.index
                    ].Answered
                  }
                >
                  <Image
                    source={{ uri: item.attributes.option_image }}
                    style={{
                      width: rs(50),
                      height: height / 10,
                      resizeMode: "contain"
                    }}
                  />
                  <Text
                    style={{
                      fontSize: rs(12),
                      textAlign: "center",
                      fontFamily: "Montserrat-Medium"
                    }}
                  >
                    {item.attributes.option_title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperQuizFive: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center"
  },
  mainLogoQuizFive: {
    width: rs(100),
    height: rs(100),
    resizeMode: "contain"
  },
  showQuizFive: {
    flex: 1,
    backgroundColor: "#1c1616",
    justifyContent: "center",
    alignItems: "center"
  },
  showQuizIconFive: {
    width: rs(100),
    height: rs(100),
    resizeMode: "contain",
    position: "absolute",
    left: 15,
    top: -25
  },
  modalWrapperOneQuizFive: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%"
  },
  modalWrapperTwoQuizFive: {
    backgroundColor: "#fff",
    width: wp(40),
    height: rs(150),
    borderRadius: rs(10)
  },
  lostIconQuizFive: {
    width: rs(70),
    height: rs(70),
    position: "absolute",
    alignSelf: "center",
    top: rs(-50)
  },
  quizFiveLostTextOne: {
    fontSize: rs(22),
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
    marginTop: rs(30)
  },
  quizFiveLostTextTwo: {
    fontSize: rs(16),
    fontFamily: "Montserrat-Medium",
    textAlign: "center"
  }
});
