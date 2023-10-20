import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

// @ts-ignore
import Radar from 'react-native-radar';
// Customizable Area End

import GeofenceController, {
  Props,
  configJSON,
} from "./GeofenceController";

export default class Geofence extends GeofenceController {
  // Customizable Area Start
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    Radar.on('events', (result: any) => {
      this.setState({events: this.stringify(result)});
    });

    Radar.on('location', (result: any) => {
      this.setState({location: this.stringify(result)});
    });

    Radar.on('clientLocation', (result: any) => {
      this.setState({clientLocation: this.stringify(result)});
    });

    Radar.on('error', (err: any) => {
      /* istanbul ignore next */
      console.log('error:', this.stringify(err));
    });

    Radar.on('log', (result: any) => {
      this.setState({log: this.stringify(result)});
    });


  Radar.setLogLevel('info');

  Radar.setUserId('foo');

  Radar.setMetadata({
    foo: 'bar',
    baz: true,
    qux: 1,
  });

  Radar.requestPermissions(false).then((result: any) => {
    console.log('requestPermissions:', result);
  }).catch((err: any) => {
    console.log('requestPermissions:', err);
  });

  Radar.getPermissionsStatus().then((result: any) => {
    console.log('getPermissionsStatus:', result);
  }).catch((err: any) => {
    /* istanbul ignore next */
    console.log('getPermissionsStatus:', err);
  });

  Radar.getLocation().then((result: any) => {
    console.log('getLocation:', this.stringify(result));
  }).catch((err: any) => {
    console.log('getLocation:', err);
  });

  Radar.trackOnce().then((result: any) => {
    console.log('trackOnce:', this.stringify(result));
  }).catch((err: any) => {
    console.log('trackOnce:', err);
  });

  Radar.startTrackingContinuous();

  Radar.searchPlaces({
    near: {
      latitude: 40.783826,
      longitude: -73.975363,
    },
    radius: 1000,
    chains: ["starbucks"],
    limit: 10,
  }).then((result: any) => {
    console.log('searchPlaces:', this.stringify(result));
  }).catch((err: any) => {
    /* istanbul ignore next */
    console.log('searchPlaces:', err);
  });

  Radar.searchGeofences({
    radius: 1000,
    tags: ["venue"],
    limit: 10,
  }).then((result: any) => {
    console.log('searchGeofences:', this.stringify(result));
  }).catch((err: any) => {
    /* istanbul ignore next */
    console.log('searchGeofences:', err);
  });

  Radar.autocomplete({
    query: 'brooklyn roasting',
    near: {
      latitude: 40.783826,
      longitude: -73.975363,
    },
    limit: 10,
  }).then((result: any) => {
    console.log('autocomplete:', this.stringify(result));
  }).catch((err: any) => {
    /* istanbul ignore next */
    console.log('autocomplete:', err);
  });

  Radar.geocode('20 jay st brooklyn').then((result: any) => {
    console.log('geocode:', this.stringify(result));
  }).catch((err: any) => {
    console.log('geocode:', err);
  });

  Radar.reverseGeocode({
    latitude: 40.783826,
    longitude: -73.975363,
  }).then((result: any) => {
    console.log('reverseGeocode:', this.stringify(result));
  }).catch((err: any) => {
    console.log('reverseGeocode:', err);
  });

  Radar.ipGeocode().then((result: any) => {
    console.log('ipGeocode:', this.stringify(result));
  }).catch((err: any) => {
    console.log('ipGeocode:', err);
  });

  Radar.getDistance({
    origin: {
      latitude: 40.78382,
      longitude: -73.97536,
    },
    destination: {
      latitude: 40.70390,
      longitude: -73.98670,
    },
    modes: [
      'foot',
      'car',
    ],
    units: 'imperial',
  }).then((result: any) => {
    console.log('getDistance:', this.stringify(result));
  }).catch((err: any) => {
    console.log('getDistance:', err);
  });

  Radar.getMatrix({
    origins: [
      {
        latitude: 40.78382,
        longitude: -73.97536,
      },
      {
        latitude: 40.70390,
        longitude: -73.98670,
      },
    ],
    destinations: [
      {
        latitude: 40.64189,
        longitude: -73.78779,
      },
      {
        latitude: 35.99801,
        longitude: -78.94294,
      },
    ],
    mode: 'car',
    units: 'imperial',
  }).then((result: any) => {
    console.log('getMatrix:', this.stringify(result));
  }).catch((err: any) => {
    console.log('getMatrix:', err);
  });

  Radar.startTrip({
    externalId: '299',
    destinationGeofenceTag: 'store',
    destinationGeofenceExternalId: '123',
    mode: 'car',
  });

  Radar.mockTracking({
    origin: {
      latitude: 40.78382,
      longitude: -73.97536,
    },
    destination: {
      latitude: 40.70390,
      longitude: -73.98670,
    },
    mode: 'car',
    steps: 3,
    interval: 3,
  });

  Radar.completeTrip();
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End


  render() {
    return (
      // Customizable Area Start
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View>
            {this.isPlatformWeb() ? (
              <Text
                testID="labelTitle" //Merge Engine::From BDS
                style={styles.title} //UI Engine::From Sketch
              >
                {configJSON.labelTitleText}
              </Text> //UI Engine::From Sketch
            ) : null}

            <Text
              testID="labelBody" //Merge Engine::From BDS
              style={styles.body} //UI Engine::From Sketch
            >
              {" "}
              {/* UI Engine::From Sketch */}
              {configJSON.labelBodyText} {/* UI Engine::From Sketch */}
            </Text>
            <Text testID="txtLog">
              The geofence log:
              {this.state.log}{" "}
            </Text>
            <Text testID="txtClientLocation">
              The geofence client location:
              {this.state.clientLocation}{" "}
            </Text>
            <Text testID="txtLocation">
              The geofence location:
              {this.state.location}{" "}
            </Text>
          </View>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  showHide: {
    alignSelf: "center",
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End
