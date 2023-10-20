// @ts-nocheck
import React, { createRef } from "react";
import {
  Animated,
  AsyncStorage,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import axios from "axios";
import { uniqBy } from "lodash";
import { RNCamera } from "react-native-camera";
import { RFValue as rs } from "react-native-responsive-fontsize";
import Video from "react-native-video";
import Lottie from "lottie-react-native";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import RNAdvertisingId from "react-native-advertising-id";
import BackgroundGeolocation from "react-native-background-geolocation";
import NetInfo from "@react-native-community/netinfo";
import DashboardController, { Props } from "./DashboardController";
import DeviceInfo from "react-native-device-info";
const configJSON = require("./config.js");

let StartOfBubble = { x: rs(-20), y: rs(-20) };
let downloadedVideoArray = [];

const rdz = 100;

const baseURL =
  "https://screenzycommercialsllp-125263-ruby.b125263.dev.eastus.az.svc.builder.cafe";
const geofenceDataUrl =
  "https://screenzycommercialsllp-125263-ruby.b125263.stage.eastus.az.svc.builder.ai";

const config = {
  headers: {
    token: configJSON.staticToken,
  },
};

const BubbleCom = ({ onPress, position }) => {
  return (
    <Animatable.View
      animation="slideInDown"
      useNativeDriver={true}
      iterationCount={"infinite"}
      direction="alternate"
      easing={"ease-in-out"}
      duration={2000}
    >
      <View
        style={[
          {
            zIndex: 20,
            flexDirection: "row",
            alignItems: "center",
          },
          position
            ? {
                position: "absolute",
                right: 0,
                bottom: 0,
                translateX: position.x,
                translateY: position.y,
              }
            : {},
        ]}
      >
        <View
          style={{
            width: rs(130),
            height: rs(30),
            backgroundColor: "#fff",
            borderRadius: rs(5),
            alignItems: "center",
            justifyContent: "center",
            marginRight: rs(20),
          }}
        >
          <Text
            style={{
              color: "orange",
              fontSize: rs(10),
              zIndex: rs(10),
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Press Here To Win
          </Text>
          <Entypo
            style={{ position: "absolute", right: rs(-10) }}
            size={rs(22)}
            color={"#fff"}
            name={"arrow-right"}
          />
        </View>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1}
          style={{
            alignItems: "center",
            width: rs(80),
            height: rs(80),
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/quiz.png")}
            style={{ width: rs(150), height: rs(150), resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

export default class Home extends DashboardController {
  /* istanbul ignore next */
  constructor(props: Props) {
    super(props);
    this.resp = null;
    this.timer = null;
    this.time = this.state.bubbleTimer;
    this.soundUpdate = null;
    this._unsubscribe = null;
    this._unFocussubscribe = null;
    this.camera = createRef();
    this.enteredFences = new Set();

    this.state = {
      bubbles: [],
      visible: false,
      counter: 0,
      vStaticVideos: [],
      vDynamicVideos: [],
      geoFences: [],
      staticCurrent: 0,
      dynamicCurrent: 0,
      isDynamicPlay: false,
      isStaticPlay: true,
      downloadedCount: 0,
      totalLength: "",
      downLoadLoader: false,
      storageLoader: false,
      allPaths: [],
      dToPlay: [],
      allVideos: [],
      is_moving: "",
      sPause: false,
      dPause: false,
      hasUpdated: false,
      isUpdating: false,
      isConnected: false,
      isCamera: false,
      callReadToUpdate: false,
    };
  }

  getFenceData = async () => {
    try {
      const resp = await axios(
        `${geofenceDataUrl}/bx_block_geofence2/geofence`
      );
      console.log("nnn", resp);
      const formatted = resp.data.data.map((i) => {
        return {
          notifyOnEntry: i.notify_on_entry,
          notifyOnExit: i.notify_on_exit,
          latitude: i.latitude,
          longitude: i.longitude,
          radius: i.radius,
          identifier: i.identifier,
        };
      });
      return formatted;
    } catch (e) {
      console.log(e);
    }
  };
  readPathFromStorage = async () => {
    const { fs } = RNFetchBlob;
    await RNFS.readDir(fs.dirs.SDCardApplicationDir + "/Screenzy")
      .then((files: any) => {
        const allPaths = files.map((i: any, index: any) => {
          const videoData = files.map((i: any) => {
            const splitArray = i.path.split("-");
            return [splitArray[4], splitArray[1]];
          });
          return {
            path: i.path,
            latitude: videoData[index][0],
            id: videoData[index][1],
          };
        });

        const staticPaths = allPaths.filter((str: any) => {
          return str.path.includes("video-static");
        });

        const dynamicPaths = allPaths.filter((str: any) => {
          return str.path.includes("video-dynamic");
        });

        let sequenceSorted = staticPaths.sort(
          (a, b) => parseFloat(a.id) - parseFloat(b.id)
        );

        const uniqueStatic = uniqBy(sequenceSorted, "id");
        /* istanbul ignore next */
        const uniqueDynamic = uniqBy(dynamicPaths, "id");
        this.setState({
          vStaticVideos: uniqueStatic,
          vDynamicVideos: uniqueDynamic,
          allPaths: allPaths,
        });
      })
      /* istanbul ignore next */
      .catch((err: any) => {
        console.log(err);
      });
  };
  getAllVideos = async () => {
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    try {
      const response = await axios.get(
        `${baseURL}/advertisments/get_all_ads_tab_wise?unique_serial_no=${advertisingId}`,
        config
      );
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
    }
  };
  checkPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return true;
      } catch (e) {
        alert("Please update permissions");
      }
    }
  };
  fenceEvent = async () => {
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    BackgroundGeolocation.onGeofence((geofence) => {
      const event = geofence.action;
      if (event === "ENTER") {
        if (!this.enteredFences.has(geofence.identifier)) {
          this.enteredFences.add(geofence.identifier);
          console.log("In same function", this.enteredFences);
          const actualFence = this.state.geoFences.filter((i) => {
            return i.identifier === geofence.identifier;
          });
          this.getAdsWithInFence(
            actualFence[0].latitude,
            actualFence[0].longitude,
            rdz,
            advertisingId
          );
        }
      }
    });
  };
  onLoadDynamic = async () => {
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    console.log(advertisingId);
    if (this.state.isConnected) {
      await this.sendStats(
        this.state.dToPlay[this.state.dynamicCurrent].id,
        advertisingId
      );
    }
  };
  onLoadStatic = async () => {
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    if (this.state.isConnected) {
      await this.sendStats(
        this.state.vStaticVideos[this.state.staticCurrent].id,
        advertisingId
      );
    }
  };
  getAdsWithInFence = async (latitude, longitude, radius, unique_serial_no) => {
    try {
      const res = await axios.get(
        `${baseURL}/advertisments/get_lat_lng_based_all_ads?latitude=${latitude}&longitude=${longitude}&radius=${radius}&unique_serial_no=${unique_serial_no}`,
        config
      );
      console.log("res", res.data.data);
      if (res.data.data.length) {
        const matchedFromStorage = this.state.vDynamicVideos.filter((i) => {
          return i.id === res.data.data[0].id;
        });
        console.log("matched", matchedFromStorage);
        if (matchedFromStorage.length) {
          const list = this.state.dToPlay.concat(matchedFromStorage);
          console.log("list", list);
          const uniqueValues = uniqBy(list, "id");
          console.log("unique", uniqueValues);
          this.setState({
            dToPlay: uniqueValues,
            isDynamicPlay: true,
            sPause: true,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  sendStats = async (id, unique_serial_no) => {
    try {
      const resp = await axios.post(
        `${baseURL}/advertisments/create_advertisement_report`,
        {
          advertisement_id: id,
          unique_serial_no: unique_serial_no,
        },
        config
      );
      console.log("Send stats", resp);
    } catch (e) {
      console.log(e);
    }
  };
  onEndReachedDynamic = () => {
    const { dToPlay, dynamicCurrent } = this.state;
    const videoArrayLength = dToPlay.length;
    if (dynamicCurrent === videoArrayLength - 1) {
      console.log("1", this.enteredFences);
      this.enteredFences.clear();
      console.log("2", this.enteredFences);
      this.setState({
        dynamicCurrent: 0,
        sPause: false,
        isDynamicPlay: false,
        dToPlay: [],
      });
    } else {
      this.setState({
        dynamicCurrent: this.state.dynamicCurrent + 1,
      });
    }
  };
  onEndReachedStatic = () => {
    const { vStaticVideos, staticCurrent } = this.state;
    const videoArrayLength = vStaticVideos.length;
    if (this.state.callReadToUpdate) {
      this.setState(
        {
          callReadToUpdate: false,
        },
        async () => {
          await this.readPathFromStorage();
        }
      );
    }
    const nextIndex =
      staticCurrent === videoArrayLength - 1 ? 0 : staticCurrent + 1;
    this.setState({
      staticCurrent: videoArrayLength === 1 ? 0 : nextIndex,
    });
  };
  initPlugIn = async () => {
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      debug: false,
      stopOnTerminate: false,
      startOnBoot: true,
    }).then((state) => {
      this.setState({
        isEnabled: state.enabled,
      });
      console.log(
        "- BackgroundGeolocation is configured and ready: ",
        state.enabled
      );
      BackgroundGeolocation.addGeofences(this.state.geoFences)
        .then((success) => {
          console.log("[addGeofences] success", success);
          BackgroundGeolocation.getCurrentPosition();
          BackgroundGeolocation.start();
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };
  videosInStorageLength = async () => {
    try {
      return await RNFetchBlob.fs.lstat(
        "/storage/emulated/0/Android/data/com.ScreenzyCommercialsLLP" +
          "/Screenzy"
      );
    } catch (e) {
      console.error("LStat Error", e);
    }
  };
  removeKey = async (key) => {
    console.log("remove key called");
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("Remove Key", error);
    }
  };
  storeData = async (keys) => {
    try {
      await AsyncStorage.multiSet(keys);
    } catch (error) {
      console.log(error);
    }
  };
  updateCheck = async (videos) => {
    try {
      const stringData = await AsyncStorage.getItem("TypeUpdate");

      const a = this.state.allPaths.map((i) => {
        return i.id;
      });

      console.log("all paths ", a);

      if (stringData != null) {
        let convertedToArrayUpdateType = Array.from(JSON.parse(stringData));
        console.log("convertedToArray data update", convertedToArrayUpdateType);
        let mergedArray = [...convertedToArrayUpdateType, ...a];
        console.log("merged", mergedArray);
        let newArrayToMapOver = videos.filter(
          (i) => !mergedArray.includes(i.id)
        );
        console.log("new", newArrayToMapOver);
        return [newArrayToMapOver.length, newArrayToMapOver];
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  };
  updateAdsToStorage = async () => {
    if (!this.state.vStaticVideos.length && !this.state.vDynamicVideos.length) {
      await this.readPathFromStorage();
    }
    const resp = await this.getAllVideos();
    const videos = resp.data.data;

    const videosToUnlink = this.state.allPaths.filter(
      (i) => !videos.some((v) => v.id === i.id)
    );
    console.log("Videos to unlink", videosToUnlink);

    let videosToDownload = videos.filter(
      (i) => !this.state.allPaths.some((v) => v.id === i.id)
    );
    console.log("Videos to download", videosToDownload);

    if (videosToUnlink.length > 0) {
      console.log("Unlink block called");
      this.setState({
        callReadToUpdate: true,
      });
      videosToUnlink.map((i) => {
        RNFetchBlob.fs
          .unlink(i.path)
          .then((res) => console.log(res, "vid deleted"))
          .catch((err) => console.log("unlink error", err));
      });
    }

    const result = await this.updateCheck(videos);
    console.log("Update check return", result);
    if (result) {
      videosToDownload = result[1];
    }
    const actualDiff = await AsyncStorage.getItem("actualDiff");
    const idDiff = await AsyncStorage.getItem("idDiff");
    const diffToUse =
      parseInt(actualDiff) > 0 ? parseInt(actualDiff) : parseInt(idDiff);
    const valueToCheck = result ? result[0] : diffToUse;
    

    NetInfo.addEventListener(async (state) => {
      if (!state.isConnected) {
        try {
          await AsyncStorage.setItem("TypeUpdate", JSON.stringify(updateType));
          await AsyncStorage.setItem("Reload", JSON.stringify(true));
        } catch (e) {
          console.log(e);
        }
      }
    });

    if (videosToDownload.length > 0) {
      this.setState({ isUpdating: true }, () => {
        this.updateAdsToStorageTwo(videosToDownload, valueToCheck);
      });
    }
  };
  updateAdsToStorageTwo = (videos, valueToCheck) => {
    const ext = "." + "mp4";
    let count = 0;
    const filePath = `${
      RNFetchBlob.fs.dirs.SDCardApplicationDir + "/tempScreenzy"
    }`;
    videos.map((i) => {
      const type = !i.attributes.static_adv ? "dynamic" : "static";

      RNFetchBlob.config({
        fileCache: true,
        path: `${filePath}/video-${i.id}-video-${type}-${
          i.attributes.latitude ? i.attributes.latitude : "static"
        }-${i.attributes.longitude ? i.attributes.longitude : "static"}-${ext}`,
      })
        .fetch("GET", i.attributes.video)
        .progress({ interval: 100 }, (received, total) => {
          console.log("progress", received / total);
        })
        .then((res) => {
          const updateType = [];
          const { status, headers } = res.info();
          console.log(status, headers);
          const fileSize = headers["content-length"];
          if (status === 200 && parseInt(fileSize) === i.attributes.file_size) {
            console.log(i.attributes.video);
            const downloadedId = res.path().split("-")[1];
            updateType.push(downloadedId);
            console.log(updateType)
            count++;
          }
          if (count === valueToCheck) {
            this.removeKey("TypeUpdate");
            this.setState({
              isUpdating: false,
              callReadToUpdate: true,
            });
            RNFetchBlob.fs
              .ls(`${RNFetchBlob.fs.dirs.SDCardApplicationDir}/tempScreenzy`)
              .then((files) => {
                files.forEach((file) => {
                  console.log(file);
                  RNFetchBlob.fs.mv(
                    `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/tempScreenzy/${file}`,
                    `${RNFetchBlob.fs.dirs.SDCardApplicationDir}/Screenzy/${file}`
                  );
                });
              });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };
  firstTimeCheck = async () => {
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    console.log(advertisingId);
    const firstTimeDownloaded = await AsyncStorage.getItem(
      "firstTimeDownloaded"
    );
    const hasPermission = await this.checkPermissions();
    if (hasPermission) {
      if (!firstTimeDownloaded) {
        await this.downloadAdsToStorage();
      } else {
        const resp = await this.getAllVideos();
        const videoInLocalStorageLength = await this.videosInStorageLength();
        const idsFromServer = resp.data.data.map((i) => {
          return parseInt(i.id);
        });

        const idsInLocalStorage = videoInLocalStorageLength.map((i) => {
          return parseInt(i.filename.split("-")[1]);
        });

        let idDifference = idsInLocalStorage.filter(
          (x) => !idsFromServer.includes(x)
        );
        const actualVideoArrayLength = resp.data.data.length;
        const diff = Math.abs(
          actualVideoArrayLength - videoInLocalStorageLength.length
        );

        await this.storeData([
          ["actualDiff", JSON.stringify(diff)],
          ["idDiff", JSON.stringify(idDifference.length)],
        ]);

        if (diff == 0 && idDifference == 0) {
          await this.readPathFromStorage();
        } else {
          await this.updateAdsToStorage();
        }
      }
      const resp = await this.getFenceData();
      this.setState(
        {
          geoFences: resp,
        },
        () => {
          this.initPlugIn();
          this.fenceEvent();
        }
      );
    }
  };
  downloadAdsToStorage = async () => {
    this.setState(
      {
        downLoadLoader: true,
      },
      async () => {
        const resp = await this.getAllVideos();
        if (resp.data.errors) {
          alert(
            resp.data.errors[0] +
              " " +
              "Please close the application and add Tab ID in the admin panel"
          );
        } else {
          const filePath = `${
            RNFetchBlob.fs.dirs.SDCardApplicationDir + "/Screenzy"
          }`;
          const videos = resp.data.data;
          let copiedArray = [...videos];
          this.setState({
            totalLength: videos.length,
          });
          NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
              AsyncStorage.setItem(
                "DownloadedArray",
                JSON.stringify(downloadedVideoArray)
              );
              AsyncStorage.setItem("Reload", JSON.stringify(true));

              AsyncStorage.setItem(
                "DownloadedCount",
                JSON.stringify(downloadedVideoArray.length)
              );
            }
          });
          const ext = "." + "mp4";
          try {
            const downloadedVideos = await AsyncStorage.getItem(
              "DownloadedArray"
            );
            if (downloadedVideos != null) {
              let convertedToArray = Array.from(JSON.parse(downloadedVideos));
              let newArrayToMapOver = videos.filter(
                (i) => !convertedToArray.includes(i.id)
              );
              downloadedVideoArray = convertedToArray;
              copiedArray = newArrayToMapOver;
              this.setState({
                downloadedCount: convertedToArray.length,
              });
            }
            copiedArray.forEach((url) => {
              const type = !url.attributes.static_adv ? "dynamic" : "static";
              RNFetchBlob.config({
                fileCache: true,
                path: `${filePath}/video-${url.id}-video-${type}-${
                  url.attributes.latitude ? url.attributes.latitude : "static"
                }-${
                  url.attributes.longitude ? url.attributes.longitude : "static"
                }-${ext}`,
              })
                .fetch("GET", url.attributes.video)
                .progress({ interval: 100 }, (received, total) => {
                  console.log("progress", received / total);
                })
                .then((res) => {
                  const { status, headers } = res.info();
                  const fileSize = headers["content-length"];
                  console.log(status, parseInt(fileSize));
                  if (
                    status === 200 &&
                    parseInt(fileSize) === url.attributes.file_size
                  ) {
                    this.setState((prevState) => ({
                      downloadedCount: prevState.downloadedCount + 1,
                    }));
                    const downloadedId = res.path().split("-")[1];
                    downloadedVideoArray.push(downloadedId);
                  }
                  if (this.state.downloadedCount === this.state.totalLength) {
                    AsyncStorage.setItem(
                      "firstTimeDownloaded",
                      JSON.stringify(true)
                    );
                    this.readPathFromStorage();
                    this.setState({
                      downLoadLoader: false,
                    });
                  }
                })

                .catch((e) => {
                  console.log("EXXXX", e);
                });
            });
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  checkForFaces = (i) => {
    this.setState({
      facialCount: i.faces,
    });
  };
  facialTrackingStats = async () => {
    const powerInfo = await DeviceInfo.getPowerState();
    const { advertisingId } = await RNAdvertisingId.getAdvertisingId();
    try {
      const resp = await axios.post(
        `${baseURL}/bx_block_facialtracking/facial_records`,
        {
          facial_count: this.state.facialCount?.length,
          tab_number: advertisingId,
          total_memory: await DeviceInfo.getTotalMemory(),
          used_memory: await DeviceInfo.getUsedMemory(),
          battery_level: await DeviceInfo.getBatteryLevel(),
          api_level: await DeviceInfo.getApiLevel(),
          system_version: DeviceInfo.getSystemVersion(),
          power_state: `Low Power mode : ${powerInfo.lowPowerMode} ---  Battery State : ${powerInfo.batteryState} --- Battery Level : ${powerInfo.batteryLevel}`,
          system_name: DeviceInfo.getSystemName(),
          hardware_specs: await DeviceInfo.getHardware(),
          device_name: await DeviceInfo.getDeviceName(),
          device_model: await DeviceInfo.getDevice(),
          apk_version: DeviceInfo.getVersion(),
          brand_name: DeviceInfo.getBrand(),
          brand_manufacturer: await DeviceInfo.getManufacturer(),
          carrier: await DeviceInfo.getCarrier(),
          device_type: DeviceInfo.getDeviceType(),
          is_battery_charging: await DeviceInfo.isBatteryCharging(),
          is_landscape: await DeviceInfo.isLandscape(),
          is_location_enabled: await DeviceInfo.isLocationEnabled(),
          is_tablet: DeviceInfo.isTablet(),
          is_camera_present: await DeviceInfo.isCameraPresent(),
        },
        config
      );
      console.log("facial tracking", resp);
    } catch (e) {
      console.log(e);
    }
  };
  turnCameraOn = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        isCamera: !this.state.isCamera,
      });
      setTimeout(() => {
        this.setState({ isCamera: !this.state.isCamera }, async () => {
          await this.facialTrackingStats();
        });
      }, 30000);
    }, 1320000);
  };
  componentDidMount = async () => {
    NetInfo.addEventListener((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
    });
    this.firstTimeCheck();
    this.turnCameraOn();
    this.updateTimer();
    if (this.state.isConnected) {
      this.timeupate = setInterval(() => {
        this.updateTimer();
      }, 30000);
    }
    this._unsubscribe = this.props.navigation.addListener("didFocus", () => {
      this.setState({
        dPause: false,
      });
      if (this.state.dToPlay.length === 0) {
        this.setState({
          sPause: false,
        });
      }
      setTimeout(() => {
        this.callBubble(
          this.state.bubble_time ? this.state.bubble_time : 30000
        );
      }, 5000);
    });
    this._unFocussubscribe = this.props.navigation.addListener(
      "didBlur",
      () => {
        this.setState({
          sPause: true,
          dPause: true,
        });

        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    );
    this.setState({ sound: true });
  };
  componentWillUnmount() {
    clearInterval(this.intervalId);
    if (this.cameraTimer != null) {
      clearInterval(this.cameraTimer);
    }
    if (this.timeupate != null) {
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timeupate);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    AsyncStorage.getItem("Reload")
      .then((value) => {
        if (value) {
          this.firstTimeCheck();
          this.removeKey("Reload");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (this.state.offline) {
      clearInterval(this.timer);
      this.timer = null;
    }

    let timeMatch = false;
    if (this.state.bubble_time != prevState.bubble_time) {
      timeMatch = true;
      this.callBubble(this.state.bubble_time, "time macth");
    }
    if (
      typeof this.state.offline !== "undefined" &&
      prevState.offline != this.state.offline &&
      this.timer == null &&
      !timeMatch
    ) {
      this.callBubble(
        this.state.bubble_time ? this.state.bubble_time : 30000,
        "online"
      );
    }
  }
  CreateNewBubble = () => {
    let bubbles = [...this.state.bubbles];
    let randomId = Math.floor(Math.random() * 10000);
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].endposition.y = bubbles[i].endposition.y - rs(70);
    }
    let bubleObject = {
      id: randomId,
      position: { x: StartOfBubble.x, y: StartOfBubble.y },
      endposition: { x: StartOfBubble.x, y: StartOfBubble.y - rs(70) },
      onClick: () => {
        this.locationBasedQuiz();
        this.removeOnClick(randomId);
      },
      xposition: new Animated.Value(0),
      yposition: new Animated.Value(StartOfBubble.y),
      scale: new Animated.Value(0.8),
    };
    bubbles.push(bubleObject);

    this.setState({
      bubbles: bubbles,
    });
    this.RemoveThisBubble(randomId);
  };
  callBubble = (callBackInMS: number) => {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(() => {
      this.CreateNewBubble();
    }, callBackInMS);
  };
  _start = (index, endposition) => {
    Animated.parallel([
      Animated.timing(this.state.bubbles[index].xposition, {
        toValue: endposition.x,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.bubbles[index].scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.bubbles[index].yposition, {
        toValue: endposition.y,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };
  removeOnClick = (id) => {
    let bubbles = [...this.state.bubbles];
    let newbubbles = bubbles.filter((item) => {
      return item.id != id;
    });
    this.setState({
      bubbles: newbubbles,
    });
  };
  RemoveThisBubble = (id) => {
    setTimeout(() => {
      let bubbles = [...this.state.bubbles];
      let newbubbles = bubbles.filter((item) => {
        return item.id != id;
      });
      this.setState({
        bubbles: newbubbles,
      });
    }, 10000);
  };
  renderStaticVideo = () => {
    const { vStaticVideos, staticCurrent, sound, sPause } = this.state;
    if (vStaticVideos.length > 0) {
      return (
        <Video
          source={{
            uri: vStaticVideos ? vStaticVideos[staticCurrent].path : null,
          }}
          resizeMode={"stretch"}
          fullscreen={true}
          muted={!sound}
          onLoad={() => this.onLoadStatic()}
          paused={sPause}
          onEnd={() => this.onEndReachedStatic()}
          style={styles.backgroundVideoStatic}
        />
      );
    }
    return null;
  };
  renderDynamicVideo = () => {
    const { dToPlay, dynamicCurrent, isDynamicPlay, sound, dPause } =
      this.state;
    if (isDynamicPlay) {
      return (
        <Video
          source={{
            uri: dToPlay[dynamicCurrent].path,
          }}
          fullscreen={true}
          muted={!sound}
          resizeMode={"stretch"}
          paused={dPause}
          onLoad={() => this.onLoadDynamic()}
          onEnd={() => this.onEndReachedDynamic()}
          style={styles.backgroundVideoDynamic}
        />
      );
    }
    return null;
  };
  renderCamera = () => {
    if (this.state.isCamera) {
      return (
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
          }}
          trackingEnabled={true}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
          type={RNCamera.Constants.Type.front}
          orientation={RNCamera.Constants.Orientation.auto}
          captureAudio={false}
          onFaceDetectionError={(i) => console.log(i)}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          onFacesDetected={(i) => this.checkForFaces(i)}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
        />
      );
    }
    return null;
  };
  renderEmptyViewOrDownloadAds = () => {
    const { totalLength, downLoadLoader, downloadedCount } = this.state;
    if (totalLength === 0) {
      return (
        <View style={styles.noAds}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            No advertisements found.
          </Text>
          <Text style={{ fontSize: 16 }}>
            Please add some advertisements through the admin panel.
          </Text>
        </View>
      );
    } else if (downLoadLoader) {
      return (
        <View style={styles.mainWrapper}>
          <View style={styles.lottieWrapper}>
            <Text>Please wait for download to finish.</Text>
            <View style={{ position: "absolute", top: 10, left: 0 }}>
              <Lottie
                style={{ width: 50, height: 50 }}
                source={require("../assets/infinty.json")}
                autoPlay
                loop
              />
            </View>
            <Lottie
              style={{ width: 100, height: 100 }}
              source={require("../assets/download2.json")}
              autoPlay
              loop
            />

            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <View style={styles.totalVideos}>
                <Text>Total videos to download :</Text>
              </View>
              <View style={styles.countWrapper}>
                <Text style={styles.totalCountText}>{totalLength}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.downloadedText}>
                <Text>Videos Downloaded :</Text>
              </View>
              <View style={styles.downloadCountWrapper}>
                <Text style={styles.downloadCountText}>
                  {this.state.newArrayLength
                    ? this.state.newArrayLength
                    : downloadedCount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  renderUpdatingIndicator = () => {
    const { isUpdating } = this.state;
    if (isUpdating) {
      return <View style={styles.updateIndicator} />;
    }
  };
  renderVolumeButton = () => {
    const { sound, downLoadLoader } = this.state;
    const backColor = {
      backgroundColor: sound ? "#fff" : "grey",
    };
    if (!downLoadLoader) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({ sound: !this.state.sound });
            setTimeout(() => {
              console.log("changing to true");
              this.setState({ sound: true });
            }, 900000);
          }}
          style={[styles.volumeButton, backColor]}
        >
          <Image
            source={require("../assets/sound.png")}
            style={{ width: rs(20), height: rs(20) }}
          />
        </TouchableOpacity>
      );
    }
  };
  renderBubbleComponent = () => {
    const { isConnected, bubbleHide, downLoadLoader } = this.state;
    if (!isConnected || !bubbleHide || !downLoadLoader) {
      return null;
    }
    return (
      <View style={{ marginTop: 10, position: "absolute" }}>
        <BubbleCom
          position={{ x: rs(-20), y: rs(-20) }}
          onPress={this.CreateNewBubble}
        />
      </View>
    );
  };
  renderBubbles = () => {
    const { bubbles, isConnected, downLoadLoader } = this.state;
    if (!isConnected || downLoadLoader) {
      return null;
    }
    return (
      <>
        {bubbles.map((item, index) => {
          this._start(index, item.endposition);
          return (
            <Animated.View
              key={item.id}
              style={{
                zIndex: 100,
                position: "absolute",
                right: rs(0),
                bottom: rs(0),
                transform: [
                  {
                    scale: item.scale,
                  },
                  { translateX: item.xposition },
                  { translateY: item.yposition },
                ],
              }}
            >
              <BubbleCom
                position={null}
                onPress={() => {
                  item.onClick();
                }}
              />
            </Animated.View>
          );
        })}
      </>
    );
  };
  renderMainLogo = () => {
    const { downLoadLoader } = this.state;
    if (!downLoadLoader) {
      return (
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/mainlogo.png")}
            style={styles.logoImage}
          />
        </View>
      );
    }
  };
  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          {this.renderEmptyViewOrDownloadAds()}
          {this.renderStaticVideo()}
          {this.renderDynamicVideo()}
          {this.renderUpdatingIndicator()}
          {this.renderVolumeButton()}
          <View style={styles.cameraView}>{this.renderCamera()}</View>
          {this.renderBubbleComponent()}
          {this.renderBubbles()}
          {this.renderMainLogo()}
        </View>
        
      </>
    );
  }
}
/* istanbul ignore next */
const styles = StyleSheet.create({
  backgroundVideoStatic: {
    width: "100%",
    height: "100%",
    zIndex: -1,
    position: "absolute",
  },
  backgroundVideoDynamic: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    position: "absolute",
  },
  wrapperCamera: {
    position: "absolute",
    flex: 1,
    height: "100%",
    width: "100%",
    top: 20,
    left: 20,
    zIndex: -100,
    opacity: 0,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  totalVideos: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 250,
    backgroundColor: "white",
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "#dadada",
  },
  countWrapper: {
    width: 60,
    height: 50,
    backgroundColor: "white",
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "#dadada",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadedText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 250,
    backgroundColor: "white",
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "#dadada",
  },
  downloadCountWrapper: {
    width: 60,
    height: 50,
    backgroundColor: "white",
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: "#dadada",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadCountText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
  },
  totalCountText: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
  },
  lottieWrapper: {
    width: 400,
    height: 400,
    backgroundColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#dadada",
  },
  mainWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  storageLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    position: "absolute",
    top: 40,
    left: 40,
    zIndex: 2,
  },
  logoImage: {
    width: 140,
    height: 70,
  },
  noAds: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraView: {
    position: "absolute",
    flex: 1,
    height: "100%",
    width: "100%",
    top: 100,
    left: 20,
    zIndex: -100,
    opacity: 0,
  },

  updateIndicator: {
    height: 5,
    width: 5,
    backgroundColor: "orange",
    position: "absolute",
    right: 15,
    top: "2%",
  },
  volumeButton: {
    position: "absolute",
    right: rs(20),
    top: rs(20),
    width: rs(30),
    height: rs(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rs(20),
    zIndex: 5,
    marginTop: rs(10),
  },
});
