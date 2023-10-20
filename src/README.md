# **React Native** | _**ScreenzyCommercialsLLP**_ | _**125263**_ | _**studio_pro**_

## **Catalog ProjectId: 95553** | **Catalog BuildId: 5181**

## NOTE FOR DEVELOPERS:
Clone the code-engine branch into your working branch. The contents of the branch may get overwritten.
## Author:
Code-Engine
## Keywords:
 - ScreenzyCommercialsLLP
 - mobile
## Assembled Features To Block Status

| **Feature-Name**        | **Block-Name**        | **Path**  | **Status**  |
|:-------------|:-------------|:-------------|:-------------|
| Geofence2      | geofence<br>core<br>      | {+packages/blocks/geofence+}<br>{+packages/blocks/core+}<br> | {+Non-Empty+} |
| Dashboard4      | dashboard<br>      | {+packages/blocks/dashboard+}<br> | {+Non-Empty+} |
| StatisticsReports2      | analytics<br>      | {+packages/blocks/analytics+}<br> | {+Non-Empty+} |
| Videos8      | videos<br>      | {+packages/blocks/videos+}<br> | {+Non-Empty+} |
| AdHocReporting2      | visualanalytics<br>      | {+packages/blocks/visualanalytics+}<br> | {+Non-Empty+} |
| BaselineReporting      | BaselineReporting      | {-packages/blocks/BaselineReporting-} | {-Empty-} |
| FacialTracking      | FacialTracking      | {-packages/blocks/FacialTracking-} | {-Empty-} |
| DataSaver      | DataSaver      | {-packages/blocks/DataSaver-} | {-Empty-} |
| LiveStreaming      | LiveStreaming      | {-packages/blocks/LiveStreaming-} | {-Empty-} |
| AdminConsole3      | AdminConsole3      | {-packages/blocks/AdminConsole3-} | {-Empty-} |
| CfTeamviewerDeviceControl3rdPartyInteg      | CfTeamviewerDeviceControl3rdPartyInteg      | {-packages/blocks/CfTeamviewerDeviceControl3rdPartyInteg-} | {-Empty-} |
| CfActiveCameraTracker      | CfActiveCameraTracker      | {-packages/blocks/CfActiveCameraTracker-} | {-Empty-} |
| CfQuiztrivia      | CfQuiztrivia      | {-packages/blocks/CfQuiztrivia-} | {-Empty-} |

## AWS BACKEND DEPLOYMENT URL
 - BaseURL exported as: "https://screenzycommercialsllp-125263-ruby.b125263.dev.eastus.az.svc.builder.cafe"
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

See docs folder for additional information.

### Prerequisites

What things you need to install the software and how to install them

* React Native (last tested on react-native0.61.3)
  - https://facebook.github.io/react-native/docs/getting-started

* IFF brew is installed and user doesn't have permisions.
```
  $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
  $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

* XCode 11 or greater

* XCode Command Line Tools
```
  $ xcode-select --install
```

* Android SDK
```
  $ brew cask install android-sdk
```

* JDK 11
```
  $ brew tap homebrew/cask-versions
  $ brew cask install java
  $ brew cask install java11
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install yarn
```
  $ brew install yarn
```

Install node

```
  $ brew install node
```

Web
```
  $ yarn
  $ yarn workspace web start 
  (Note: After udpating depencies run again if no cocde erros. )
```

iOS
```
  $ yarn
  $ cd packages/mobile/ios && pod install && cd ../../../ && cp node-runners/RCTUIImageViewAnimated.m node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m && npx react-native bundle --entry-file ./packages/mobile/index.js --platform ios --dev true --bundle-output ./packages/mobile/ios/main.jsbundle && yarn ios
```

Android - https://docs.expo.io/versions/latest/workflow/android-studio-emulator/
```
  $ yarn
  $ export JAVA_HOME=`/usr/libexec/java_home -v 11`; java -version; export ANDROID_HOME=${HOME}/Library/Android/sdk; export PATH=${PATH}:${ANDROID_HOME}/emulator && yarn android
```

## Running the tests

```
  $ yarn test
```


## CI/CD Details

We use GitlabCI for our deployment/Build pipelines

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).



