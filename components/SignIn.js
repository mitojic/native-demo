import React from 'react';
import Dimensions from 'Dimensions';
import { Container, Content, Button, Icon, H3, Form, Item, Input, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import globalStyles from '../styles';
import constants from '../constants';

const styles = {
  button: { marginTop: 5 },
  heading: { marginTop: 10, marginBottom: 5, fontSize: 18 },
  headingSite: { marginTop: 20, marginBottom: 5, fontSize: 18 },
  separatorText: { alignSelf: "center", color: "#939393" },
  separatorRow: { marginTop: 20 },
  separator: { backgroundColor: "#939393", height: 1, marginTop: 10 },
  input: { marginTop: 10 },
};

const SignIn = ({ screenProps, navigation }) => {

  onSocialLoginPressed = (provider) => {
    screenProps.loading();
    screenProps.gigya.socialLogin(provider, this.onSocialLoginCompleted)
  };

  onSignUpPressed = () => navigation.navigate(constants.screens.SignUp);

  onForgotPwdPressed = () => navigation.navigate(constants.screens.ForgotPwd);

  onLoginPressed = () => {
    if (!this.loginId || !this.password) {
      screenProps.notifyUser('Please provide username and password');
      return;
    };

    screenProps.loading();
    screenProps.gigya.login(this.loginId, this.password, this.onLoginCompleted);
  };

  onScreenSetPressed = () => {
    screenProps.loading();
    screenProps.gigya.showScreenSet(
      'Default-RegistrationLogin',
      {
        x:0, y:0,
        w:Dimensions.get('window').width, h:Dimensions.get('window').height,
        screenSetParams: {
          startScreen:"gigya-login-screen",
          sessionExpiration:3600,
        }
      },
      this.onScreenSetCompleted);
  };

  onSocialLoginCompleted = (error) => this.checkErrors(error);
  
  onScreenSetCompleted = (error) => this.checkErrors(error);

  onLoginCompleted = (error) => this.checkErrors(error);

  checkErrors = (error) => {
    screenProps.loading(true);
    if (!error) return;
    screenProps.notifyUser(error);
  };

  return (
    <Container style={globalStyles.container}>
      <Content>
        <Grid>
          <Row>
            <Col>
              <H3 style={styles.heading}>Quickly log in with your social network:</H3>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                style={styles.button}
                onPress={() => this.onSocialLoginPressed('facebook')}
                block
              >
                <Icon name='logo-facebook' />
              </Button>
              <Button
                style={styles.button}
                onPress={() => this.onSocialLoginPressed('googleplus')}
                block
              >
                <Icon name='logo-googleplus' />
              </Button>
              <Button
                style={styles.button}
                onPress={() => this.onSocialLoginPressed('twitter')}
                block
              >
                <Icon name='logo-twitter' />
              </Button>
              <Button
                onPress={() => this.onScreenSetPressed()}
                style={styles.button}
                block
                success
              >
                <Text>Screenset</Text>
              </Button>
            </Col>
          </Row>
          <Row style={styles.separatorRow}>
            <Col style={styles.separator}></Col>
            <Col>
              <Text style={styles.separatorText}>OR</Text>
            </Col>
            <Col style={styles.separator}></Col>                    
          </Row>
          <Row>
            <Col>
              <H3 style={styles.headingSite}>Log in with your email and password:</H3>
              <Form>
                <Item style={styles.input} regular>
                  <Input
                    keyboardType="email-address"
                    onChangeText={(text) => this.loginId = text}
                    placeholder="Email"
                  />
                </Item>
                <Item style={styles.input} regular>
                  <Input
                    onChangeText={(text) => this.password = text}
                    placeholder="Password"
                    secureTextEntry
                  />
                </Item>
              </Form>
              <Button
                onPress={() => this.onForgotPwdPressed()}
                small
                full
                transparent
              >
                <Text>Forgot password?</Text>
              </Button>
              <Button
                onPress={() => this.onLoginPressed()}
                style={styles.button}
                block
                success
              >
                <Text>Login</Text>
              </Button>
              <Button
                onPress={() => this.onSignUpPressed()}
                small
                full
                transparent
              >
                <Text>Don't have an account yet? Register now</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
}

export default SignIn;
