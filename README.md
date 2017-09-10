## Table of Contents  
[About this project](#about)  
[Requirements](#requirements)  
[Running this demo](#running)  
[Integrating Gigya with existing projects](#existing)  
* [iOS](#ios)  
* [Android](#android)  


![Gigya Integration with React Native](http://alejandro.gigya-cs.com/gigyarn.gif)

<a name="about"></a>
## About this project

This is a simple demo to illustrate [Gigya](http://www.gigya.com) Integration with React Native. Integration is done via [Native Modules](https://facebook.github.io/react-native/docs/native-modules-ios.html). The idea is to create a React RCTBridgeModule for Gigya's available Mobile SDKs (iOS and Android), and use this bridge to communicate between React Native (JS) and Native (SDKs).

<a name="requirements"></a>
## Requirements

```
brew install node
brew install watchman
npm install -g react-native-cli
```

[See React Native official documentation for more information on setting up your environment](https://facebook.github.io/react-native/docs/getting-started.html)

<a name="running"></a>
## Running this demo

```
cd ReactNative-Demo
npm install
# or
yarn install
```

If Yarn was installed when the project was initialized, then dependencies will have been installed via Yarn, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

#### `npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

#### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

#### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

Note: The iOS project is configured with CocoaPods - and calls Gigya, Facebook and Google native SDKs. Run `pod install` from terminal to install libraries.

#### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

##### Using Android Studio's `adb`

1. Make sure that you can run adb from your terminal.
2. Open Genymotion and navigate to `Settings -> ADB`. Select “Use custom Android SDK tools” and update with your [Android SDK directory](https://stackoverflow.com/questions/25176594/android-sdk-location).

##### Using Genymotion's `adb`

1. Find Genymotion’s copy of adb. On macOS for example, this is normally `/Applications/Genymotion.app/Contents/MacOS/tools/`.
2. Add the Genymotion tools directory to your path (instructions for [Mac](http://osxdaily.com/2014/08/14/add-new-path-to-path-command-line/), [Linux](http://www.computerhope.com/issues/ch001647.htm), and [Windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/)).
3. Make sure that you can run adb from your terminal.

<a name="existing"></a>
## Integrating Gigya with existing projects
When building an app in React Native, it is recommended to use Gigya's [iOS](https://developers.gigya.com/display/GD/iOS) and [Android](https://developers.gigya.com/display/GD/Android) SDKs to interact with Gigya API. Using third-party SDKs in React Native it’s pretty straightforward thanks to **Native Modules** ([iOS](https://facebook.github.io/react-native/docs/native-modules-ios.html) - [Android](https://facebook.github.io/react-native/docs/native-modules-android.html)). Native Modules allow reusing existing Objective-C, Swift or Java code without having to reimplement it in JavaScript.

To integrate Gigya with an existing React Native project, follow these instructions:

<a name="ios"></a>
**iOS**

Obtain Your Gigya API Key and enable Mobile or Desktop Client Applications API Access. Refer to the ['Gigya Setup'](https://developers.gigya.com/display/GD/iOS#iOS-GigyaSetup-ObtainYourGigyaAPIKey) section.

In your React Native iOS Xcode Project:

1. Integrate the Gigya SDK. Refer to the ['Getting started'](https://developers.gigya.com/display/GD/iOS#iOS-LibraryGuide) and ['Initialization'](https://developers.gigya.com/display/GD/iOS#iOS-Initialization) sections.
2. Add [Facebook and Google Native Login](https://developers.gigya.com/display/GD/iOS#iOS-ConfiguringNativeLogin) if you want to offer log in via Facebook/Google. Refer to [Twitter](https://developers.gigya.com/display/GD/iOS#iOS-AddingTwitterSingleSign-on) and [Line](https://developers.gigya.com/display/GD/iOS#iOS-AddingLINENativeLogin) sections for corresponding instructions.
3. Create a new Objetive-C class, which will serve as a bridge between your React code and Gigya's native SDK. Use [GigyaBridge.h](https://github.com/gigya/ReactNative-Demo/blob/master/ios/gigyareactnative/GigyaBridge.h) and [GigyaBridge.m](https://github.com/gigya/ReactNative-Demo/blob/master/ios/gigyareactnative/GigyaBridge.m) as a start point to build your bridge.

<a name="android"></a>
**Android**

Obtain Your Gigya API Key and enable Mobile or Desktop Client Applications API Access. Refer to the ['Gigya Setup'](https://developers.gigya.com/display/GD/Android#Android-GigyaSetup-ObtainYourGigyaAPIKey) section.

In your React Native Android Project:

1. Integrate the Gigya Android SDK. Refer to the ['Download'](https://developers.gigya.com/display/GD/Android#Android-Download), ['Add to AndroidManifest.xml'](https://developers.gigya.com/display/GD/Android#Android-AddtoAndroidManifest.xml) and ['Initialization'](https://developers.gigya.com/display/GD/Android#Android-Initialization) sections.
2. Add [Facebook and Google Native Login](https://developers.gigya.com/display/GD/Android#Android-ConfiguringNativeLogin) if you want to offer log in via Facebook/Google. Refer to [Line](https://developers.gigya.com/display/GD/Android#Android-AddingLINENativeLogin) section for corresponding instructions.
3. Create two new classes, which will serve as a bridge between your React code and Gigya's native SDK. Use [GigyaBridge.java](https://github.com/gigya/ReactNative-Demo/blob/master/android/app/src/main/java/com/gigyareactnative/GigyaBridge.java) and [GigyaBridgePackage.java](https://github.com/gigya/ReactNative-Demo/blob/master/android/app/src/main/java/com/gigyareactnative/GigyaBridgePackage.java) as a start point to build your bridge.


**JavaScript**

Finally, call your bridge from the React Native code: 
```
// Importing the bridge
import { NativeEventEmitter, NativeModules } from 'react-native';
const Gigya = NativeModules.GigyaBridge;

// Subscribing to the bridge events
this.gigyaManagerEmitter = new NativeEventEmitter(Gigya);
this.accountDidLoginSubscription = this.gigyaManagerEmitter.addListener('AccountDidLogin', this.onAccountDidLogin);

// Calling bridge methods
Gigya.initBridge();
Gigya.isSessionValid(this.onIsSessionValidCompleted);
```

## Other resources
* [Gigya iOS documentation](https://developers.gigya.com/display/GD/iOS)
* [Gigya Android documentation](https://developers.gigya.com/display/GD/Android)
* [React Native troubleshooting](https://facebook.github.io/react-native/docs/troubleshooting.html)
* [Gigya iOS SDK Reference](https://developers.gigya.com/display/GD/iOS+SDK+Reference)
* [Gigya Android SDK Reference](https://developers.gigya.com/display/GD/Android+SDK+Reference)

## Bootstrapped from React Native

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
