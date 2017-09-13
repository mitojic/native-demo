import React from 'react';
import { NativeEventEmitter, NativeModules, StyleSheet, Text, View } from 'react-native';
import { Root, Toast } from "native-base";
import { createRootNavigator } from "./Router";
import Spinner from "./components/Spinner";

const Gigya = NativeModules.GigyaBridge;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      gigyaAccount: null,
      isSessionValid: null,
      isLoading: true,
    };
    this.gigyaManagerEmitter =  new NativeEventEmitter(Gigya);
  }

  componentWillMount() {
    this.accountDidLoginSubscription = this.gigyaManagerEmitter.addListener(
      'AccountDidLogin',
      this.onAccountDidLogin
    );

    this.AccountDidLogoutSubscription = this.gigyaManagerEmitter.addListener(
      'AccountDidLogout',
      this.onAccountDidLogout
    );

    this.pluginViewFiredEventSubscription = this.gigyaManagerEmitter.addListener(
      'PluginViewFiredEvent',
      this.onPluginViewFiredEvent
    );

    this.pluginViewDidFailWithErrorSubscription = this.gigyaManagerEmitter.addListener(
      'PluginViewDidFailWithError',
      this.onPluginViewDidFailWithError
    );

    Gigya.initBridge();
    Gigya.isSessionValid(this.onIsSessionValidCompleted);
  }

  componentWillUnmount() {
    this.accountDidLoginSubscription.remove();
    this.AccountDidLogoutSubscription.remove();
    this.pluginViewFiredEventSubscription.remove();
    this.pluginViewDidFailWithErrorSubscription.remove();
  }

  onAccountDidLogin = (account) => {
    this.setState({
      gigyaAccount: JSON.parse(account),
      isSessionValid: true,
      isLoading: false,
    });
  };

  onAccountDidLogout = () => {
    Gigya.hidePluginView();
    this.notifyUser('Logged out successfully');
    this.setState({
      isSessionValid: false,
      gigyaAccount: null,
      isLoading: false,
    });
  };

  onPluginViewFiredEvent = (event) => {
    console.log(event);
  };

  pluginViewDidFailWithErrorSubscription = (event) => {
    console.log(event);
    this.loading(true);
  };

  onIsSessionValidCompleted = (error, isValid) => {
    if(!isValid) {
      this.setState({ isSessionValid: false, isLoading: false });
    } else {
      Gigya.getAccountInfo(this.onGetAccountInfoCompleted);
    }
  };

  onGetAccountInfoCompleted = (error, account) => {
    if (account) {
      this.setState({
        gigyaAccount: JSON.parse(account),
        isSessionValid: true,
        isLoading: false,
      });
    } else {
      this.loading(true);
    }
  };

  checkErrors = (error) => {
    if (!error) return;
    this.notifyUser(error);
  };

  notifyUser = (msg) => {
    this.loading(true);
    Toast.show({
      text: msg,
      position: 'bottom',
      buttonText: 'Dismiss',
      duration: 2000,
    });
  };

  loading = (loaded) => {
    this.setState({ isLoading: !loaded })
  };

  render() {
    const { gigyaAccount, isSessionValid, isLoading } = this.state;
    if (isSessionValid===null) return <Spinner />;

    const Layout = createRootNavigator(isSessionValid);
    return (
      <Root>        
        <Layout screenProps={{
          account: gigyaAccount,
          signedIn: isSessionValid,
          gigya: Gigya,
          notifyUser: this.notifyUser,
          loading: this.loading,
        }} />
        { isLoading && <Spinner /> }
      </Root>
    );
  }
}

export default App;
