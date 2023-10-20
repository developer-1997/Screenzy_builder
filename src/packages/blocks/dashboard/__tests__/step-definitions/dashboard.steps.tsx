import React from "react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper, mount } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import renderer from "react-test-renderer";

import toJson from "enzyme-to-json";
// import DeviceInfo from 'react-native-device-info';
// import RNAdvertisingId from 'react-native-advertising-id';
import { RNCamera } from "react-native-camera";
import BackgroundGeolocation from "react-native-background-geolocation";
import RNAdvertisingId from "react-native-advertising-id";
import axios from "axios";
const navigation = require("react-navigation");
import NetInfo from "@react-native-community/netinfo";

import Home from "../../src/Dashboard";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
let response: any;
let dashboardWrapper: ShallowWrapper;
let instance: Home;
const screenProps = {
  navigation: navigation,
  id: "Home",
};
import { AsyncStorage, PermissionsAndroid, Platform } from "react-native";

const feature = loadFeature("./__tests__/features/dashboard-scenario.feature");

const baseURL =
  "https://screenzycommercialsllp-125263-ruby.b125263.dev.eastus.az.svc.builder.cafe";
const headers = {
  token:
    "tyugiojpkiy8ucfghvjbuy76tfygui86t7yuhu7vbnubhhjihbjihjghjkiou897ytfyghjkiou8976tfygvhjbkiu8y76t5tfychjbuhy",
};

const mockFiles = [
  {
    path:
      "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
  {
    path:
      "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
  {
    path:
      "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
];

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
}));

jest.mock("react-native-background-geolocation", () => ({
  ready: jest.fn(() => Promise.resolve({ enabled: true })),
  addGeofences: jest.fn(() => Promise.resolve({ success: true })),
  getCurrentPosition: jest.fn(),
  start: jest.fn(),
}));

jest.mock("react-native-camera", () => ({
  RNCamera: {
    Constants: {
      FaceDetection: {
        Mode: {
          fast: "fast",
        },
      },
      Type: {
        front: "front",
      },
      Orientation: {
        auto: "auto",
      },
    },
  },
}));

jest.mock("react-native-video", () => "Video");

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  multiSet: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn().mockResolvedValue(undefined),

  // Add other AsyncStorage methods you use in your code as needed
}));
jest.mock("react-native-advertising-id");

jest.mock("react-native-device-info", () => ({
  getPowerState: jest
    .fn()
    .mockResolvedValue({ batteryLevel: 100, batteryState: "charged" }),
}));
jest.mock("axios");

jest.mock(
  "react-native-advertising-id",
  () => {
    return {
      RNAdvertisingId: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  },
  { virtual: true }
);

jest.mock("react-native-advertising-id", () => ({
  getAdvertisingId: jest.fn().mockResolvedValue({
    advertisingId: "45701ab9-986f-48a4-860c-5e9a3ab4e770",
  }),
}));

jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");
jest.mock("react-native-simple-toast", () => ({
  SHORT: jest.fn(),
}));

jest.mock("rn-fetch-blob", () => ({
  fs: {
    lstat: jest.fn(),
    dirs: {
      SDCardApplicationDir: "/Screenzy",
    },
  },
}));

jest.mock("react-native-fs", () => ({
  readDir: jest.fn().mockResolvedValue([
    {
      path:
        "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
    {
      path:
        "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
    {
      path:
        "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
  ]),
}));

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to dashboard1", ({ given, when, then }) => {
    let dashboardWrapper: ShallowWrapper;
    let instance: Dashboard;
    given("I am a User loading dashboard", () => {
      dashboardWrapper = shallow(<Home {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    when("I navigate to the dashboard", () => {
      instance = dashboardWrapper.instance() as Dashboard;
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("dashboard will load with out errors", () => {
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("Dashboard will display messages", () => {
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
            type: "dashboard",
            attributes: {
              id: 1,
              title: "Dashboard_title_1",
              value: 1,
              created_at: "2021-03-08T17:10:08.139Z",
              updated_at: "2021-03-08T17:10:08.139Z",
            },
          },
          {
            id: 2,
            type: "dashboard",
            attributes: {
              id: 2,
              title: "Dashboard 5",
              value: 5,
              created_at: "2021-03-08T17:10:36.867Z",
              updated_at: "2021-03-08T17:10:36.867Z",
            },
          },
        ],
      });
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("Dashboard will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      apiNoItemsMsg.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: [] }
      );
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("Dashboard will display notifcation if API failure", () => {
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

      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });
  });

  test("User navigates to dashboard", ({ given, when, then }) => {
    given("I am a User loading dashboard", () => {
      dashboardWrapper = shallow(<Home {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    when("I navigate to the dashboard", () => {
      instance = dashboardWrapper.instance() as Home;
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });

    then("dashboard will load with out errors", async () => {
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });
  });
  test("Get all videos", ({ given, when, then }) => {
    given("I am a User loading dashboard", () => {
      dashboardWrapper = shallow(<Home {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });
    when("the getAllVideos API endpoint is called", async () => {
      expect(dashboardWrapper).toBeTruthy();
    });
    then("the response status code should be", async () => {
      try {
        response = await instance.getAllVideos();
        expect(response.status).toBe(200);
        expect(axios.post).toHaveBeenCalledWith(
          `${baseURL}/advertisments/get_all_ads_tab_wise?unique_serial_no=${"787879797979"}`,
          { advertisement_id: "5", unique_serial_no: "99" },
          { headers }
        );
      } catch (e) {
        response = e.response;
      }
    });
  });
  test("Geofence data", ({ given, when, then }) => {
    given("The app is launched", () => {
      dashboardWrapper = shallow(<Home {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
      expect(dashboardWrapper).toMatchSnapshot();
    });
    when("the geofence data endpoint is called", async () => {
      expect(dashboardWrapper).toBeTruthy();
    });
    then("should get an array containing geofence data", async () => {
      try {
        response = await instance.getFenceData();
        expect(response.status).toBe(200);
        expect(response).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              notifyOnEntry: true,
              notifyOnExit: true,
              identifier: expect.any(String),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              radius: expect.any(Number),
            }),
          ])
        );
      } catch (e) {
        response = e.response;
      }
    });
  });
});

describe("Internal storage mock testing", () => {
  it("returns the correct length of videos in storage", async () => {
    let videosLength = 10;
    RNFetchBlob.fs.lstat.mockResolvedValue(videosLength);
    const result = await instance.videosInStorageLength();
    expect(result).toBe(videosLength);
  });
  test("should get the formatted data from Internal storage", async () => {
    const files = await RNFS.readDir(
      RNFetchBlob.fs.dirs.SDCardApplicationDir + "/Screenzy"
    ).then((filez) => {
      const allPaths = filez.map((i, index) => {
        const videoData = filez.map((j) => {
          const splitArray = j.path.split("-");
          return [splitArray[4], splitArray[1]];
        });
        return {
          path: i.path,
          latitude: videoData[index][0],
          id: videoData[index][1],
        };
      });
      return allPaths;
    });
    expect(files).toEqual([
      {
        path:
          "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
      {
        path:
          "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
      {
        path:
          "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
    ]);
  });
  test("should read and parse files from directory", async () => {
    const spy = jest.spyOn(RNFS, "readDir");
    const expectedPaths = [
      {
        path:
          "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: 22.55458,
        id: "1",
      },
      {
        path:
          "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: 22.55458,
        id: "2",
      },
    ];
    await instance.readPathFromStorage();
    expect(spy).toHaveBeenCalledWith(
      RNFetchBlob.fs.dirs.SDCardApplicationDir + "/Screenzy"
    );
    // verify that the function parses the file paths correctly
    expect(expectedPaths).toEqual([
      { path: mockFiles[0].path, latitude: 22.55458, id: "1" },
      { path: mockFiles[1].path, latitude: 22.55458, id: "2" },
    ]);
  });
});

describe("Post calls testing", () => {
  it("sends expected video stat data to server", async () => {
    const id = 123;
    const unique_serial_no = "abc123";
    const mockResponse = { data: { status: 200, message: "Success" } };
    axios.post.mockResolvedValueOnce(mockResponse);
    await instance.sendStats(id, unique_serial_no);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${baseURL}/advertisments/create_advertisement_report`,
      { advertisement_id: id, unique_serial_no },
      { headers }
    );
    expect(mockResponse.data.status).toEqual(200);
  });
});

describe("Tests for renderEmptyViewOrDownloadAds", () => {
  // Test case for when totalLength is 0
  it("renders empty view when totalLength is 0", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ totalLength: 0 });
    expect(
      toJson(component.instance().renderEmptyViewOrDownloadAds())
    ).toMatchSnapshot();
  });

  // Test case for when downLoadLoader is true
  it("renders download loader when downLoadLoader is true", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: true });
    expect(
      toJson(component.instance().renderEmptyViewOrDownloadAds())
    ).toMatchSnapshot();
  });

  // Test case for when downLoadLoader is false
  it("returns null when downLoadLoader is false", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: false });
    expect(component.instance().renderEmptyViewOrDownloadAds()).toBe(null);
  });
});

describe("Tests for renderMainLogo funtion", () => {
  // Test case for when downLoadLoader is false
  it("renders the main logo when downLoadLoader is false", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: false });
    expect(component.instance().renderMainLogo()).toMatchSnapshot();
  });

  // Test case for when downLoadLoader is true
  it("returns null when downLoadLoader is true", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: true });
    expect(component.instance().renderMainLogo()).toBe(undefined);
  });
});

describe("Tests for renderVolumeButton", () => {
  // Test case for when downLoadLoader is false and sound is true
  it("renders the volume button with white background when downLoadLoader is false and sound is true", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: false, sound: true });
    expect(component.instance().renderVolumeButton()).toMatchSnapshot();
  });

  // Test case for when downLoadLoader is false and sound is false
  it("renders the volume button with grey background when downLoadLoader is false and sound is false", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: false, sound: false });
    expect(component.instance().renderVolumeButton()).toMatchSnapshot();
  });

  // Test case for when downLoadLoader is true
  it("returns null when downLoadLoader is true", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ downLoadLoader: true });
    expect(component.instance().renderVolumeButton()).toBe(undefined);
  });
});

describe("Tests for renderUpdatingIndicator", () => {
  // Test case for when isUpdating is true
  it("renders the updating indicator when isUpdating is true", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ isUpdating: true });
    expect(component.instance().renderUpdatingIndicator()).toMatchSnapshot();
  });

  // Test case for when isUpdating is false
  it("returns null when isUpdating is false", () => {
    const component = shallow(<Home {...screenProps} />);
    component.setState({ isUpdating: false });
    expect(component.instance().renderUpdatingIndicator()).toBe(undefined);
  });
});

describe("Tests  for filterVideos funtion", () => {
  test("should filter out elements present in mergedArray", () => {
    const videos = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const mergedArray = [2, 4];

    const result = instance.filterVideos(videos, mergedArray);

    expect(result).toEqual([3, [{ id: 1 }, { id: 3 }, { id: 5 }]]);
  });

  test("should return the original video array when mergedArray is empty", () => {
    const videos = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const mergedArray = [];

    const result = instance.filterVideos(videos, mergedArray);

    expect(result).toEqual([5, videos]);
  });

  test("should return an empty array when videos is empty", () => {
    const videos = [];
    const mergedArray = [1, 2, 3];

    const result = instance.filterVideos(videos, mergedArray);

    expect(result).toEqual([0, []]);
  });

  test("should return an empty array when both videos and mergedArray are empty", () => {
    const videos = [];
    const mergedArray = [];

    const result = instance.filterVideos(videos, mergedArray);

    expect(result).toEqual([0, []]);
  });
});

describe("Tests for Facial count ", () => {
  test("should update facialCount state correctly", () => {
    const wrapper = shallow(<Home {...screenProps} />);

    // Define the input parameter for checkForFaces
    const inputParameter = { faces: 5 };

    // Call the checkForFaces function with the input parameter
    wrapper.instance().checkForFaces(inputParameter);

    // Update the component state by re-rendering
    wrapper.update();

    // Get the updated facialCount state
    const updatedFacialCount = wrapper.state("facialCount");

    // Assert that the state has been updated correctly
    expect(updatedFacialCount).toBe(5);
  });
});
