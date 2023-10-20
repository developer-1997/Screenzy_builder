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
import { RFValue as rs } from "react-native-responsive-fontsize";

let timer;

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

export default class Quiz2 extends DashboardController {
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
    timer = setInterval(() => {
      /* istanbul ignore next */
      if (this.state.questionAsk) {
        if (this.state.timer >= 0) {
          this.setState({
            timer: --this.state.timer
          });
          if (this.state.timer == -1) {
            this.setState({ timer: 5 });
          }
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
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
        clearInterval(timer);
        this.props.navigation.replace("Win", {
          id: this.props.navigation.state.params.quizId
        });
      } else {
        this.quizLost();
        clearInterval(timer);
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
      this.setState({ question: false });
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

    const csColorQuiz2 = colorMap[this.state.QuizTheme] || "grey";
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
            width: rs(380),

            backgroundColor: this.state.QuizTheme
              ? this.state.QuizTheme
              : "#f5f5f5",
            borderRadius: rs(5),
            alignItems: "center",
            padding: rs(10)
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 5 ? "grey" : "#8F00FF",
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 4 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 3 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 2 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 1 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(40),
                height: rs(40),
                borderRadius: rs(20),
                backgroundColor: "orange",
                marginHorizontal: rs(8),
                marginBottom: rs(15)
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
                colors={["#8F00FF", "#8F00FF", "#8F00FF", "#8F00FF"]}
                colorsTime={[5, 2, 0]}
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
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 1 ? "grey" : "#8F00FF",
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 2 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 3 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 4 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
            <View
              style={{
                width: rs(20),
                height: rs(20),
                borderRadius: rs(10),
                backgroundColor: this.state.timer < 5 ? "grey" : "#8F00FF",
                marginLeft: rs(10),
                borderWidth: rs(0.5),
                borderColor: "orange"
              }}
            />
          </View>
          <Text
            style={{
              color: csColorQuiz2,
              fontSize: rs(16),
              marginTop: rs(5),
              fontFamily: "Montserrat-SemiBold"
            }}
          >
            {
              this.state.quizQuestionData.attributes.questions[this.state.index]
                .attributes.title
            }
          </Text>
          <FlatList
            numColumns={2}
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
                    borderRadius: rs(5),
                    width: rs(165),
                    alignItems: "center",
                    marginLeft: rs(10)
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
