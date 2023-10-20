import { StyleSheet } from "react-native";
import { RFValue as rs } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const globalQuizStyles = StyleSheet.create({
    wrapperQuiz: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    mainLogo: {
        width: rs(100),
        height: rs(100),
        resizeMode: "contain",
    },
    showQuiz: {
        flex: 1,
        backgroundColor: "#1c1616",
        justifyContent: "center",
        alignItems: "center",
    },
    showQuizIcon: {
        width: rs(100),
        height: rs(100),
        resizeMode: "contain",
        position: "absolute",
        left: 15,
        top: -25,
    },
    modalWrapperOne: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
    },
    modalWrapperTwo: {
        backgroundColor: "#fff",
        width: wp(40),
        height: rs(150),
        borderRadius: rs(10),
    },
    lostIcon: {
        width: rs(70),
        height: rs(70),
        position: "absolute",
        alignSelf: "center",
        top: rs(-50),
    },
    lostTextOne: {
        fontSize: rs(22),
        fontFamily: "Montserrat-SemiBold",
        textAlign: "center",
        marginTop: rs(30),
    },
    lostTextTwo: {
        fontSize: rs(16),
        fontFamily: "Montserrat-Medium",
        textAlign: "center",
    }
});
