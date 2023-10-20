import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// @ts-ignore
import RNAdvertisingId from "react-native-advertising-id";
import Toast from "react-native-simple-toast";
import { createRef } from "react";
// Customizable Area End

export const configJSON = require("./config.js");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}
interface S {
  // Customizable Area Start
  dashboardData: any;
  token: string;
  errorMsg: string;
  loading: boolean;
  count: number;
  quizeData: any;
  sound: any;
  quizQuestionLoaded: boolean;
  quizQuestionData: any;
  events: any;
  offline: boolean;
  offlineVideo: any;
  quizid: any;
  userName: string;
  userMobile: string;
  userEmail: string;
  videoPlay: boolean;
  video: any;
  counter: number;
  videoLoader: boolean;
  videoPlayerKey?: string | number;
  bubbleHide: boolean;
  companyId: any;
  videoId: any;
  locationPermissionGranted: boolean;
  bubble_time: any;
  dynamic_quiz: any;
  cacheVideoURL: string | null;
  dynamicVideoURL: string;
  last_dynamic_video: any;
  staticVideoCurrentTime: number | string;
  static_adv: boolean;
  geofence: string;
  cacheVideoID: string | number;
  resetSeek: boolean;
  correct_Answer: any;
  staticVideo: any;
  staticPause: boolean;
  allStaticVideos: any;
  allDynamicVideos: any;
  allGeofenes: any;
  cameraOn: any;
  allVideos1: any;
  // Customizable Area End
}
interface SS {
  id: any;
}

export default class DashboardController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiDashboardItemCallId: string = "";
  quizSaveAnswerId: any = "";
  dynamicStatsId: any = "";
  dashboardApiCallId: string = "";
  apiGetQueryStrinurl: string = "";
  getQuizeDataApiCallId: any = "";
  getQuizesDataApiCallId: any = "";
  unsubscribe: any = null;
  userDataApiCallId: any = "";
  userVideoDataId: any = "";
  lastNumber: number = -1;
  offlineVideoDataId: any = "";
  lat: any = "";
  lng: any = "";
  getBubbleTimerId: any = "";
  getAllVideos1Id: any = "";
  videoCurrentTime: any;
  bubbleUpTime: any;
  isFirstTimeOnline: any;
  stopped: any;
  facesDetected: number;
  totalFacesDetected: any;
  noFacesDetected: any;
  facialCountDataId: any = "";
  tabDataStatusId: any = "";
  facialCountFreq: any;
  offlineVideoNumber: number;
  offlineDynamicNumber: number;
  newFormatQuizDataId: any = "";
  video_Id: any = "";
  company_Id: any = "";
  intervalID: any;
  timeupate: any;
  timeOut: any;
  questionTime: number;
  transLat: any;
  transLong: any;
  cameraTimer: any;
  // Customizable Area End
  
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    console.disableYellowBox = true;
    // Customizable Area Start
    this.transLat = createRef();
    this.transLong = createRef();
    this.lat = createRef();
    this.lng = createRef();
    this.videoCurrentTime = createRef();
    this.isFirstTimeOnline = createRef();
    this.stopped = createRef();
    this.totalFacesDetected = createRef();
    this.facesDetected = 0;
    this.noFacesDetected = 0;
    this.facialCountFreq = {};
    this.offlineVideoNumber = 0;
    this.video_Id = createRef();
    this.company_Id = createRef();
    this.timeOut = createRef();
    this.intervalID = 0;
    this.timeupate = null;
    this.offlineDynamicNumber = 0;
    this.questionTime = 5;
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.LocationUpdate),
      getName(MessageEnum.GeoFencingEvent)
    ];

    this.state = {
      dashboardData: [],
      errorMsg: "",
      token: "",
      offlineVideo: null,
      quizid: "",
      userName: "",
      userEmail: "",
      userMobile: "",
      videoPlay: false,
      videoLoader: false,
      videoPlayerKey: 2342,
      bubbleHide: false,
      loading: false,
      count: 0,
      quizeData: "",
      sound: false,
      quizQuestionLoaded: false,
      quizQuestionData: null,
      events: [],
      offline: false,
      video: "",
      counter: 0,
      companyId: "",
      videoId: 0,
      locationPermissionGranted: false,
      bubble_time: 30000,
      dynamic_quiz: null,
      cacheVideoURL: null,
      dynamicVideoURL: "",
      last_dynamic_video: false,
      staticVideoCurrentTime: 0,
      static_adv: false,
      cacheVideoID: 1,
      resetSeek: true,
      geofence: "not touhed",
      correct_Answer: [],
      staticVideo: "",
      staticPause: false,
      allStaticVideos: [],
      allDynamicVideos: [],
      allGeofenes: [],
      cameraOn: false,
      allVideos1: []
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }
  
  getToken=()=>{
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  getDashboardData(): boolean {
    // Customizable Area Start
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDashboardItemCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.dashboardGetUrl
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.dashboarApiMethodType
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (
      this.quizSaveAnswerId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log("api response from the api", apiResponse);
    }

    if (
      this.newFormatQuizDataId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      this.setState({ dynamic_quiz: apiResponse.data.quiz_id });
      let NavigateScreen = apiResponse.data.quiz_type;
      if (NavigateScreen) {
        this.setState({ quizid: apiResponse.data.quiz_id });
        this.setState({
          quizQuestionLoaded: false,
          quizQuestionData: null
        });
        this.props.navigation.navigate(this.GetQuizTypeName(NavigateScreen), {
          quizId: apiResponse.data.quiz_id,
          theme: apiResponse.data.theme,
          question_Time: apiResponse.data.question_time
        });
      }
    }
    if (
      this.facialCountDataId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log(apiResponse);
      this.facesDetected = 0;
    }

    if (
      this.getBubbleTimerId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      this.setState({ bubble_time: apiResponse.bubble_time });
    }
    if (
      this.getQuizeDataApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      this.setState({ quizeData: apiResponse });
      this.setState({
        quizQuestionLoaded: true,
        quizQuestionData: apiResponse.data
      });
    }
    if (
      this.getQuizesDataApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (Array.isArray(apiResponse.data)) {
        let RandomIndex = Math.floor(Math.random() * apiResponse.data.length);

        let NavigateScreen = apiResponse.data[RandomIndex].attributes.quiz_type;
        if (NavigateScreen) {
          this.setState({ quizid: apiResponse.data[RandomIndex].id });
          this.setState({
            quizQuestionLoaded: false,
            quizQuestionData: null
          });
          this.props.navigation.navigate(this.GetQuizTypeName(NavigateScreen), {
            quizId: apiResponse.data[RandomIndex].id,
            theme: apiResponse.data[RandomIndex].attributes.theme
          });
        }
      }
    }
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (responseJson && !responseJson.errors && responseJson.data) {
        if (responseJson.data.length === 0) {
          this.setState({
            errorMsg: "Data Not Found",
            loading: false
          });
        } else {
          this.setState({
            dashboardData: responseJson.data,
            errorMsg: "",
            loading: false
          });
        }
      } else {
        let errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        if (errorReponse === undefined) {
          this.setState({
            errorMsg: "Something went serioulsy wrong",
            loading: false
          });
        } else {
          this.setState({
            errorMsg: errorReponse,
            loading: false
          });
        }
      }
    }
    if (
      this.userDataApiCallId ===
      message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const apiResponse = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      console.log(apiResponse);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  sendHelloMessage() {
    // console.log("hello  send Hello Message")
    const msg: Message = new Message(getName(MessageEnum.StartGeoFencing));
    msg.properties.text = "hello world";
    this.send(msg);
  }
  GetQuizTypeName = (type: string) => {
    switch (type) {
      case "Quiz-1":
        return "Quiz1";
      case "Quiz-2":
        return "Quiz1";
      case "Quiz-3":
        return "Quiz1";
      case "Quiz-4":
        return "Quiz1";
      case "Quiz-5":
        return "Quiz2";
      case "Quiz-6":
        return "Quiz2";
      case "Quiz-7":
        return "Quiz6";
      case "Quiz-8":
        return "Quiz6";
      case "Quiz-12":
        return "Quiz6";
      case "Quiz-9":
        return "Quiz5";
      case "Quiz-10":
        return "Quiz5";
      case "Quiz-11":
        return "Quiz5";
      case "Quiz-14":
        return "Quiz4";
      case "Quiz-13":
        return "Quiz3";

      default:
        return null;
    }
  };
  fetchQuizeData = (id: any) => {
    const headers = {
      "Content-Type": configJSON.dashboarContentType,
      token: configJSON.staticToken
    };
    const getQuizeDataValidation = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getQuizeDataApiCallId = getQuizeDataValidation.messageId;

    getQuizeDataValidation.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_cfquiztrivia/quizzes/" + id
    );
    getQuizeDataValidation.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    getQuizeDataValidation.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );

    runEngine.sendMessage(getQuizeDataValidation.id, getQuizeDataValidation);
  };
  fetchallQuizData = () => {
    const headers = {
      "Content-Type": configJSON.dashboarContentType,
      token: configJSON.staticToken
    };
    const getQuizesDataValidation = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getQuizesDataApiCallId = getQuizesDataValidation.messageId;

    getQuizesDataValidation.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_cfquiztrivia/quizzes"
    );

    getQuizesDataValidation.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );

    getQuizesDataValidation.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );

    runEngine.sendMessage(getQuizesDataValidation.id, getQuizesDataValidation);
  };
  sendUserData = async (id: any) => {
    let { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    const UserDataValidation = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.userDataApiCallId = UserDataValidation.messageId;

    UserDataValidation.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_cfquiztrivia/participents"
    );

    const header = {
      "Content-Type": "multipart/form-data",
      token: configJSON.staticToken
    };
    UserDataValidation.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    UserDataValidation.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );

    let formdata = new FormData();
    formdata.append("name", this.state.userName);
    formdata.append("email", this.state.userEmail);
    formdata.append("full_phone_number", this.state.userMobile);
    formdata.append("quiz_id", id);
    formdata.append("unique_serial_no", advertisingId);

    UserDataValidation.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formdata
    );
    runEngine.sendMessage(UserDataValidation.id, UserDataValidation);
    console.log("quiz idf----from api hit", id);

    if (
      this.state.userEmail.length > 0 ||
      this.state.userMobile.length > 0 ||
      this.state.userName.length > 0
    ) {
      Toast.show("Your details are successfully submitted.", Toast.SHORT);
      this.setState({ userName: "", userMobile: "", userEmail: "" });
      this.props.navigation.navigate("Home");
    } else {
      this.setState({ userName: "", userMobile: "", userEmail: "" });
      this.props.navigation.navigate("Home");
    }
  };

  updateTimer = () => {
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: configJSON.staticToken
    };
    const getBubbleDataValidation = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getBubbleTimerId = getBubbleDataValidation.messageId;

    getBubbleDataValidation.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_cfquiztrivia/get_bubble_time"
    );
    getBubbleDataValidation.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getBubbleDataValidation.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );

    runEngine.sendMessage(getBubbleDataValidation.id, getBubbleDataValidation);
  };
  locationBasedQuiz = () => {
    const headers = {
      "Content-Type": configJSON.dashboarContentType,
      token: configJSON.staticToken
    };

    const Quizdata = new Message(getName(MessageEnum.RestAPIRequestMessage));
    this.newFormatQuizDataId = Quizdata.messageId;

    Quizdata.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    if (this.state.dynamic_quiz == null) {
      Quizdata.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        `bx_block_cfquiztrivia/sequence_wise_quiz?quiz_id=`
      );
    } else {
      Quizdata.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        `bx_block_cfquiztrivia/sequence_wise_quiz?quiz_id=${
          this.state.dynamic_quiz
        }`
      );
    }

    Quizdata.addData(getName(MessageEnum.RestAPIRequestMethodMessage), "GET");

    runEngine.sendMessage(Quizdata.id, Quizdata);
  };
  saveUserQuizAnswers = async (id: any, answers: any) => {
    let { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    const headers = {
      "Content-Type": configJSON.dashboarContentType,
      token: configJSON.staticToken
    };
    let body: any = {};
    body.quiz_id = id;
    body.user_answers = answers;
    body.unique_serial_no = advertisingId;

    const QuizAnswerData = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.quizSaveAnswerId = QuizAnswerData.messageId;

    QuizAnswerData.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_cfquiztrivia/quizzes/save_answers"
    );

    QuizAnswerData.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(body)
    );
    QuizAnswerData.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers)
    );
    QuizAnswerData.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );
    runEngine.sendMessage(QuizAnswerData.id, QuizAnswerData);
  };
  // Customizable Area End

}
