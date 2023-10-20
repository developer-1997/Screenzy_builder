// @ts-nocheck
import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import DashboardController from "../DashboardController";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import Icon from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { RFValue as rs } from "react-native-responsive-fontsize";

export default class Win extends DashboardController {
  constructor(props) {
    super(props);
    this.state = {
      userMobile: "",
      errorMobile: false,
      userName: "",
      errorName: false,
      userEmail: ""
    };
    this.timeOut.current = null;
  }

  handelOnPress = () => {
    let id = this.props.navigation.state.params.id;
    this.sendUserData(id);
  };
  handleNameChange = userName => {
    if (userName.trim() === "") {
      this.setState({ userName, errorName: "Field cannot be empty" });
    } else {
      this.setState({ userName, errorName: "" });
    }
  };

  handlePhoneNumberChange = userMobile => {
    const phoneNumberRegex = /^(?!([0-9])\1{9})[6-9]\d{9}$/;
    if (phoneNumberRegex.test(userMobile)) {
      this.setState({ userMobile, errorMobile: "" });
    } else {
      this.setState({
        userMobile,
        errorMobile: "Please enter a valid phone number"
      });
    }
  };
  render() {
    const {
      userMobile,
      errorMobile,
      userName,
      errorName,
      userEmail
    } = this.state;
    const isFormValid = userName && userMobile && !errorMobile;
    const backgroundColor = isFormValid ? "orange" : "#dadada";
    const Color = isFormValid ? "white" : "black";
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1c1616",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: "42%",
            backgroundColor: "#f5f5f5",
            borderRadius: rs(10),
            alignItems: "center",
            padding: rs(10),
            marginTop: rs(20)
          }}
        >
          <View
            style={{
              position: "absolute",
              right: rs(-20),
              top: rs(-20),
              width: rs(40),
              height: rs(40),
              borderRadius: rs(20),
              backgroundColor: "orange"
            }}
          >
            <CountdownCircleTimer
              strokeWidth={5}
              trailColor={"#fff"}
              size={rs(40)}
              rotation={"counterclockwise"}
              isPlaying
              duration={60}
              colors={["green", "green", "red", "red"]}
              colorsTime={[45, 30, 15, 0]}
              onComplete={this.handelOnComplete}
            >
              {({ remainingTime }) => (
                <Text style={{ color: "#fff", fontSize: rs(16) }}>
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
          </View>
          <View style={{ position: "absolute", top: rs(-40) }}>
            <Image
              source={require("../../assets/winemoji.png")}
              style={{ width: rs(50), height: rs(60), resizeMode: "contain" }}
            />
          </View>

          <Text
            style={{
              fontSize: rs(18),
              fontFamily: "Montserrat-SemiBold",
              textAlign: "center",
              marginTop: rs(0)
            }}
          >
            Hip Hip Hurray!!
          </Text>

          <Text
            style={{
              fontSize: rs(12),
              textAlign: "center",
              marginTop: rs(5),
              fontFamily: "Montserrat-Medium"
            }}
          >
            Congrats on Winning the Voucher!
          </Text>

          <Text
            style={{
              fontSize: rs(10),

              textAlign: "center",
              marginTop: rs(5),
              marginBottom: rs(5),
              fontFamily: "Montserrat-Regular"
            }}
          >
            Please fill in your details to get the Offer code in your mobile.
          </Text>
          <View style={{ width: wp(35), marginTop: rs(10) }}>
            <Icon
              style={{
                position: "absolute",
                top: rs(8),
                left: rs(8)
              }}
              name="user"
              size={26}
              color={"#4b4b4b"}
            />
            <TextInput
              testID="myName"
              onChangeText={this.handleNameChange}
              placeholder="Name"
              maxLength={50}
              value={userName}
              style={{
                width: "100%",
                borderWidth: rs(0.5),
                borderRadius: rs(4),
                paddingLeft: rs(30),
                fontSize: rs(13),
                borderColor: "#dadada",
                fontFamily: "Montserrat-Medium"
              }}
            />
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                marginTop: 4,
                color: "red",
                fontSize: rs(10)
              }}
            >
              {errorName}
            </Text>
          </View>
          <View style={{ width: wp(35), marginTop: rs(0) }}>
            <Icon
              style={{
                position: "absolute",
                top: rs(8),
                left: rs(8)
              }}
              name="phone"
              size={26}
              color={"#4b4b4b"}
            />

            <TextInput
              testID="myNumber"
              keyboardType="numeric"
              maxLength={10}
              onChangeText={this.handlePhoneNumberChange}
              placeholder="Phone Number"
              value={userMobile}
              style={{
                width: "100%",
                borderWidth: rs(0.5),
                borderRadius: rs(4),
                paddingLeft: rs(30),
                fontSize: rs(13),

                borderColor: "#dadada",
                fontFamily: "Montserrat-Medium"
              }}
            />
            <Text
              style={{
                fontFamily: "Montserrat-Regular",
                marginTop: 4,
                color: "red",
                fontSize: rs(10)
              }}
            >
              {" "}
              {errorMobile}
            </Text>
          </View>
          <View style={{ width: wp(35), marginTop: rs(0) }}>
            <Icon
              style={{
                position: "absolute",
                top: rs(8),
                left: rs(8)
              }}
              name="envelope"
              size={26}
              color={"#4b4b4b"}
            />
            <TextInput
              testID="myEmail"
              value={userEmail}
              placeholder="Email (Optional)"
              maxLength={40}
              onChangeText={text =>
                this.setState({
                  userEmail: text
                })
              }
              style={{
                width: "100%",
                borderWidth: rs(0.5),
                borderRadius: rs(4),
                paddingLeft: rs(32),
                fontSize: rs(13),
                borderColor: "#dadada",
                fontFamily: "Montserrat-Medium"
              }}
            />
          </View>

          <TouchableOpacity
            onPress={this.handelOnPress}
            disabled={!isFormValid}
            activeOpacity={0.7}
            style={{
              width: "90%",
              padding: rs(6),
              alignItems: "center",
              justifyContent: "center",
              borderWidth: rs(0.5),
              borderRadius: rs(50),
              backgroundColor: backgroundColor,
              margin: rs(10),
              borderColor: "#dadada"
            }}
          >
            <Text
              style={{
                fontSize: rs(12),
                fontFamily: "Montserrat-Medium",
                color: Color
              }}
            >
              SUBMIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
