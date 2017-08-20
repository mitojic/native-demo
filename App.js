import React from 'react';
// NativeEventEmitter, NativeModules
import { NativeEventEmitter, NativeModules, StyleSheet, Text, View } from 'react-native';
import { Root, Spinner, Toast } from "native-base";
import Login from './components/Login';
import LoggedIn from './components/LoggedIn';
import Dimensions from 'Dimensions';

const Gigya = NativeModules.GigyaBridge;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      gigyaAccount: null,
      isSessionValid: null,
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
    
      console.log(account);
    this.setState({
      gigyaAccount: JSON.parse(account),
      isSessionValid: true,
    });
  };

  onAccountDidLogout = () => {
    this.notifyUser('Logged out successfully');
    this.setState({ isSessionValid: false, gigyaAccount: null })
  };

  onPluginViewFiredEvent = (event) => {
      console.log(event);
  };

  pluginViewDidFailWithErrorSubscription = (event) => {
      console.log(event);
  };

  onIsSessionValidCompleted = (error, isValid) => {
    if(!isValid) {
      this.setState({ isSessionValid: false });
    } else {
      Gigya.getAccountInfo(this.onGetAccountInfoCompleted);
    }
  };

  onGetAccountInfoCompleted = (error, account) => {
    if (account) {
      this.setState({
        gigyaAccount: JSON.parse(account),
        isSessionValid: true,
      });
    }
  };

  login = (loginId, password) => {
    if (!loginId || !password) {
      this.notifyUser('Please provide username and password');
      return;
    };

    Gigya.login(loginId, password, this.onLoginCompleted);
  };

  showScreenSet = () => {
    Gigya.showScreenSet('Default-RegistrationLogin', {x:0,y:0,w:Dimensions.get('window').width,h:Dimensions.get('window').height, screenSetParams:{startScreen:"gigya-login-screen",sessionExpiration:3600}}, this.onScreenSetCompleted);
  };

   viewProfile = () => {
    Gigya.showScreenSet('Default-ProfileUpdate',  {x:0,y:0,w:Dimensions.get('window').width,h:Dimensions.get('window').height,screenSetParams:{}}, this.onScreenSetCompleted);
  };
  
  socialLogin = (provider) => Gigya.socialLogin(provider, this.onSocialLoginCompleted);

  onLoginCompleted = (error) => {
    if (error) {
      this.notifyUser(error);
    }
  };

  onScreenSetCompleted = (error) => {
      this.notifyUser(error);
  };

  onSocialLoginCompleted = (error) => this.checkErrors(error);

  logout = () => Gigya.logout();

  checkErrors = (error) => {
    if (!error) return;
    this.notifyUser(error);
  };

  notifyUser = (msg) => Toast.show({
    text: msg,
    position: 'bottom',
    buttonText: 'Dismiss',
    duration: 2000,
  });

  render() {
    const { gigyaAccount, isSessionValid } = this.state;

    if (isSessionValid===null) return <Spinner color='blue' />;

    let rootChildren = isSessionValid
      ? (<LoggedIn
          account={gigyaAccount}
          onLogout={this.logout}
          onViewProfilePressed={this.viewProfile}
        />)
      : (<Login
          onSocialLoginPressed={this.socialLogin}
          onLoginPressed={this.login}
          onScreensetPressed={this.showScreenSet}
        />);

    return(
      <Root>
        { rootChildren }
      </Root>
    );

  }
}

