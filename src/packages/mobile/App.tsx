import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
  Animated,
  LogBox,
  AsyncStorage,
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import HomeScreen from '../components/src/HomeScreen';
import InfoPage from '../blocks/info-page/src/InfoPageBlock';
import VisualAnalytics from '../blocks/visualanalytics/src/VisualAnalytics';
import DataSaver from '../blocks/DataSaver/src/DataSaver';
import Videos from '../blocks/videos/src/Videos';
import CfTeamviewerDeviceControl3rdPartyInteg from '../blocks/CfTeamviewerDeviceControl3rdPartyInteg/src/CfTeamviewerDeviceControl3rdPartyInteg';
// import Geofence from '../blocks/geofence/src/Geofence';
import LiveStreaming from '../blocks/LiveStreaming/src/LiveStreaming';
import Analytics from '../blocks/analytics/src/Analytics';
import FacialTracking from '../blocks/FacialTracking/src/FacialTracking';
import CfQuiztrivia from '../blocks/CfQuiztrivia/src/CfQuiztrivia';
import BaselineReporting from '../blocks/BaselineReporting/src/BaselineReporting';
import AdminConsole3 from '../blocks/AdminConsole3/src/AdminConsole3';
import CfActiveCameraTracker from '../blocks/CfActiveCameraTracker/src/CfActiveCameraTracker';
import Home from '../blocks/dashboard/src/Home';
import Quiz1 from '../blocks/dashboard/src/quizzes/Quiz1';
import Quiz2 from '../blocks/dashboard/src/quizzes/Quiz2';
import Quiz3 from '../blocks/dashboard/src/quizzes/Quiz3';
import Quiz4 from '../blocks/dashboard/src/quizzes/Quiz4';
import Quiz5 from '../blocks/dashboard/src/quizzes/Quiz5';
import Quiz6 from '../blocks/dashboard/src/quizzes/Quiz6';
import Win from '../blocks/dashboard/src/quizzes/Win';
import Lottie from 'lottie-react-native';
import {RFValue as rs} from 'react-native-responsive-fontsize';
import {RNCamera} from 'react-native-camera';
import Video from 'react-native-video';
import {useNetInfo} from '@react-native-community/netinfo';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen, navigationOptions: {header: null, title: 'Home'}},
  VisualAnalytics: {
    screen: VisualAnalytics,
    navigationOptions: {title: 'VisualAnalytics'},
  },
  DataSaver: {screen: DataSaver, navigationOptions: {title: 'DataSaver'}},
  Videos: {screen: Videos, navigationOptions: {title: 'Videos'}},
  CfTeamviewerDeviceControl3rdPartyInteg: {
    screen: CfTeamviewerDeviceControl3rdPartyInteg,
    navigationOptions: {title: 'CfTeamviewerDeviceControl3rdPartyInteg'},
  },
  // Geofence: {screen: Geofence, navigationOptions: {title: 'Geofence'}},
  LiveStreaming: {
    screen: LiveStreaming,
    navigationOptions: {title: 'LiveStreaming'},
  },
  Analytics: {screen: Analytics, navigationOptions: {title: 'Analytics'}},
  FacialTracking: {
    screen: FacialTracking,
    navigationOptions: {title: 'FacialTracking'},
  },
  CfQuiztrivia: {
    screen: CfQuiztrivia,
    navigationOptions: {title: 'CfQuiztrivia'},
  },
  BaselineReporting: {
    screen: BaselineReporting,
    navigationOptions: {title: 'BaselineReporting'},
  },
  AdminConsole3: {
    screen: AdminConsole3,
    navigationOptions: {title: 'AdminConsole3'},
  },
  CfActiveCameraTracker: {
    screen: CfActiveCameraTracker,
    navigationOptions: {title: 'CfActiveCameraTracker'},
  },
  Dashboard: {screen: Home, navigationOptions: {title: 'Home'}},

  Quiz1: {screen: Quiz1, navigationOptions: {title: 'Quiz', header: null}},
  Quiz2: {screen: Quiz2, navigationOptions: {title: 'Quiz2', header: null}},
  Quiz3: {screen: Quiz3, navigationOptions: {title: 'Quiz3', header: null}},
  Quiz4: {screen: Quiz4, navigationOptions: {title: 'Quiz4', header: null}},
  Quiz5: {screen: Quiz5, navigationOptions: {title: 'Quiz5', header: null}},
  Quiz6: {screen: Quiz6, navigationOptions: {title: 'Quiz6', header: null}},
  Win: {screen: Win, navigationOptions: {title: 'Win', header: null}},

  InfoPage: {
    screen: InfoPage,
    navigationOptions: {title: 'Info'},
  },
});

if (!HomeScreen.instance) {
  const defaultProps = {
    navigation: null,
    id: 'HomeScreen',
    dd: '',
  };
  const homeScreen = new HomeScreen(defaultProps);
}

export function App() {
  if (__DEV__) {
    const ignoreWarns = [
      'EventEmitter.removeListener',
      '[fuego-swr-keys-from-collection-path]',
      'Setting a timer for a long period of time',
      'ViewPropTypes will be removed from React Native',
      'AsyncStorage has been extracted from react-native',
      "exported from 'deprecated-react-native-prop-types'.",
      'Non-serializable values were found in the navigation state.',
      'VirtualizedLists should never be nested inside plain ScrollViews',
    ];

    const warn = console.warn;
    console.warn = (...arg) => {
      for (const warning of ignoreWarns) {
        if (arg[0].startsWith(warning)) {
          return;
        }
      }
      warn(...arg);
    };

    LogBox.ignoreLogs(ignoreWarns);
  }

  return <HomeStack />;
}
