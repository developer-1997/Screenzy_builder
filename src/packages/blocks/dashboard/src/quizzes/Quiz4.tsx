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
  ActivityIndicator,
  StyleSheet
} from "react-native";
import DashboardController from "../DashboardController";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { RFValue as rs } from "react-native-responsive-fontsize";
import Triangle from "react-native-triangle";

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

export default class Quiz4 extends DashboardController {
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
        <View style={styles.wrapperQuizFour}>
          <Image
            source={require("../../assets/mainlogo.png")}
            style={styles.mainLogoQuizFour}
          />
          <ActivityIndicator size={"large"} color="#fff" />
        </View>
      );
    }

    return (
      <View testID="showQuiz" style={styles.showQuizFour}>
        <Image
          source={require("../../assets/mainlogo.png")}
          style={styles.showQuizIconFour}
        />
        <Modal
          style={{}}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalWrapperOneQuizFour}>
            <View style={styles.modalWrapperTwoQuizFour}>
              <Image
                source={require("../../assets/networkloss.png")}
                style={styles.lostIconQuizFour}
              />
              <Text style={styles.quizFourLostTextOne}>Oh No!!</Text>
              <View style={{ padding: rs(10) }}>
                <Text style={styles.quizFourLostTextTwo}>
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
            padding: rs(10),
            alignSelf: "center"
          }}
        >
          <View
            style={{
              width: wp(70),
              backgroundColor: "#f5f5f5",
              padding: rs(10)
            }}
          >
            <View
              style={{ position: "absolute", left: rs(-30), top: rs(-0.5) }}
            >
              <Triangle
                width={rs(30)}
                height={rs(40)}
                color={"#f5f5f5"}
                direction={"left"}
              />
            </View>
            <Text
              style={{
                color: "#000",
                fontSize: rs(14),

                textAlign: "center",
                fontFamily: "Montserrat-SemiBold"
              }}
            >
              {
                this.state.quizQuestionData.attributes.questions[
                  this.state.index
                ].attributes.title
              }
            </Text>
            <View
              style={{ position: "absolute", right: rs(-30), top: rs(-0.5) }}
            >
              <Triangle
                width={rs(30)}
                height={rs(40)}
                color={"#f5f5f5"}
                direction={"right"}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              top: 20,
              zIndex: -10
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
              bottom: rs(44)
            }}
          />
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#fff",
              width: wp(15),
              position: "absolute",
              bottom: rs(112)
            }}
          />

          <FlatList
            numColumns={2}
            contentContainerStyle={{
              marginTop: rs(10),
              alignSelf: "center"
            }}
            columnWrapperStyle={{}}
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

                    width: rs(180),
                    alignItems: "center",
                    marginHorizontal: rs(55),
                    marginVertical: rs(15)
                  }}
                  disabled={
                    this.state.quizQuestionData.attributes.questions[
                      this.state.index
                    ].Answered
                  }
                >
                  <View
                    style={{
                      position: "absolute",
                      left: rs(-30),
                      top: rs(-0.5)
                    }}
                  >
                    <Triangle
                      width={rs(30)}
                      height={rs(40)}
                      color={item && item.bg ? item.bg : "#f5f5f5"}
                      direction={"left"}
                    />
                  </View>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: rs(14),
                      fontFamily: "Montserrat-Medium"
                    }}
                  >
                    {item.attributes.option_title}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: rs(-30),
                      top: rs(-0.5)
                    }}
                  >
                    <Triangle
                      width={rs(30)}
                      height={rs(40)}
                      color={item && item.bg ? item.bg : "#f5f5f5"}
                      direction={"right"}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperQuizFour: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center"
  },
  mainLogoQuizFour: {
    width: rs(100),
    height: rs(100),
    resizeMode: "contain"
  },
  showQuizFour: {
    flex: 1,
    backgroundColor: "#1c1616",
    justifyContent: "center",
    alignItems: "center"
  },
  showQuizIconFour: {
    width: rs(100),
    height: rs(100),
    resizeMode: "contain",
    position: "absolute",
    left: 15,
    top: -25
  },
  modalWrapperOneQuizFour: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    height: "100%"
  },
  modalWrapperTwoQuizFour: {
    backgroundColor: "#fff",
    width: wp(40),
    height: rs(150),
    borderRadius: rs(10)
  },
  lostIconQuizFour: {
    width: rs(70),
    height: rs(70),
    position: "absolute",
    alignSelf: "center",
    top: rs(-50)
  },
  quizFourLostTextOne: {
    fontSize: rs(22),
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
    marginTop: rs(30)
  },
  quizFourLostTextTwo: {
    fontSize: rs(16),
    fontFamily: "Montserrat-Medium",
    textAlign: "center"
  }
});
