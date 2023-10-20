import React from "react";
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import renderer from "react-test-renderer";
import * as helpers from "../../../../framework/src/Helpers";
import axios from "axios";
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";
import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock";

const headers = {
  token: "tyugiojpkiy8ucfghvjbuy76tfygui86t7yuhu7vbnubhhjihbjihjghjkiou897ytfyghjkiou8976tfygvhjbkiu8y76t5tfychjbuhy",
};

import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";

import Home from "../../src/Home";

const navigation = require("react-navigation");
const screenProps = {
  navigation: navigation,
  id: "Home",
};
let homeWrapper: ShallowWrapper;
let instance: Home;

const feature = loadFeature("./__tests__/features/home-scenario.feature");
jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);
jest.mock("react-native-device-info", () => mockRNDeviceInfo);

const baseURL =
  "https://screenzycommercialsllp-125263-ruby.b125263.dev.eastus.az.svc.builder.cafe";

const mockFiles = [
  {
    path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
  {
    path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
  {
    path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
  },
];

jest.mock(
  "react-native-advertising-id",
  () => {
    return {
      RNAdvertisingId: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  },
  { virtual: true }
);

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
jest.mock("axios");
jest.mock("react-native-fs", () => ({
  readDir: jest.fn().mockResolvedValue([
    {
      path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
    {
      path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
    {
      path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
    },
  ]),
}));
let response: any;

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });
  test("User navigates to home", ({ given, when, then }) => {
    given("I am a User loading home", () => {
      homeWrapper = shallow(<Home {...screenProps} />);
      expect(homeWrapper).toBeTruthy();
      expect(homeWrapper).toMatchSnapshot();
    });

    when("I navigate to the home", () => {
      instance = homeWrapper.instance() as Home;
      expect(homeWrapper).toBeTruthy();
      expect(homeWrapper).toMatchSnapshot();
    });

    then("home will load with out errors", async () => {
      expect(homeWrapper).toBeTruthy();
      expect(homeWrapper).toMatchSnapshot();
    });
  });
  test("Get all videos", ({ given, when, then }) => {
    given("I am a User loading home", () => {
      homeWrapper = shallow(<Home {...screenProps} />);
      expect(homeWrapper).toBeTruthy();
      expect(homeWrapper).toMatchSnapshot();
    });
    when("the getAllVideos API endpoint is called", async () => {
      expect(homeWrapper).toBeTruthy();
    });
    then("the response status code should be", async () => {
      try {
        response = await instance.getAllVideos();
        expect(response.status).toBe(200);
      } catch (e) {
        response = e.response;
      }
    });
  });
  test("Geofence data", ({ given, when, then }) => {
    given("The app is launched", () => {
      homeWrapper = shallow(<Home {...screenProps} />);
      expect(homeWrapper).toBeTruthy();
      expect(homeWrapper).toMatchSnapshot();
    });
    when("the geofence data endpoint is called", async () => {
      expect(homeWrapper).toBeTruthy();
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
  it("should get the formatted data from Internal storage", async () => {
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
        path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
      {
        path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
      {
        path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: "22.55458",
        id: "687",
      },
    ]);
  });
  it("should read and parse files from directory", async () => {
    const spy = jest.spyOn(RNFS, "readDir");
    const expectedPaths = [
      {
        path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
        latitude: 22.55458,
        id: "1",
      },
      {
        path: "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP/Screenzy/video-687-video-dynamic-22.55458-88.34081-.mp4",
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

  it("renders with the correct styles", () => {
    const testRenderer = renderer.create(<Home {...screenProps} />);
    const json = testRenderer.toJSON();
    expect(json).toMatchSnapshot();
  });
});