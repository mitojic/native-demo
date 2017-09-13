import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Icon } from 'native-base';
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ForgotPwd from "./components/ForgotPwd";
import Comments from "./components/Comments";
import Home from "./components/Home";

export const SignedOut = StackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
    title: "Sign In"
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
        title: "Sign Up"
    }
  },
  ForgotPwd: {
    screen: ForgotPwd,
    navigationOptions: {
        title: "Forgot Password"
    }
  },
});

export const SignedIn = TabNavigator({
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <Icon name='home' style={{color: tintColor}} />
        ),
      }
    },
    Comments: {
      screen: Comments,
      navigationOptions: {
        tabBarLabel: "Comments",
        tabBarIcon: ({ tintColor }) => (
          <Icon name='chatbubbles' style={{color: tintColor}} />
        ),
      }
    },
  }, 
  {
    animationEnabled: true,
    tabBarOptions: {
      inactiveTintColor: '#939393',
    }
});

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator({
    SignedIn: {
      screen: SignedIn,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    SignedOut: {
      screen: SignedOut,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
  },
  {
    headerMode: "none",
    mode: "modal",
    initialRouteName: signedIn ? "SignedIn" : "SignedOut"
  });
};
