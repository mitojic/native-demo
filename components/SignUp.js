import React, { Component } from 'react';
import { Container, Content, Button, H3, Form, Item, Input, Text, ListItem, CheckBox, Body } from 'native-base';
import globalStyles from '../styles';
import constants from '../constants';

const styles = {
  welcome: { marginTop: 20, marginBottom: 20, fontSize: 18 },
  input: { marginTop: 10 },
  button: { marginTop: 10 },
};

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      terms: false,
      errors: {
        firstName: false,
        lastName: false,
        loginId: false,
        password: false,
        confirmPassword: false,
      },
    };
  }

  onSignInPressed = () => this.props.navigation.goBack();

  onRegistrationCompleted = (error) => this.checkErrors(error);
  
  onSignUpPressed = () => {
    const { screenProps } = this.props;

    this.signUpPressed = true;
    this.validateForm(() => {
      const { firstName, lastName, loginId, password, confirmPassword } = this.state.errors;
      
      // Avoid registration if any field is on error
      if (firstName || lastName || loginId || password || confirmPassword) return;
      
      screenProps.loading();
      screenProps.gigya.registerFlow(
        this.firstName,
        this.lastName,
        this.loginId,
        this.password,
        "true", // tnc
        this.onRegistrationCompleted
      );
    });
  }

  setField = (setter) => {
    setter();
    this.validateForm();
  };

  validateForm = (callback) => {
    if(!this.signUpPressed) return;

    this.setState({
      errors: {
        firstName: !!this.firstName === false,
        lastName: !!this.lastName === false,
        loginId: !!this.loginId === false,
        password: !!this.password === false,
        confirmPassword: !!this.confirmPassword === false || 
          this.password && this.confirmPassword && this.password !== this.confirmPassword,
      }
    }, callback);
  };
  
  onTermsPressed = () => this.setState({ terms: !this.state.terms });
  
  checkErrors = (error) => {
    if (!error) return;
    this.props.screenProps.notifyUser(error);
  };
  
  render() {
    const { screenProps, navigation } = this.props;
    const { terms } = this.state;

    return (
      <Container style={globalStyles.container}>
        <Content>
          <H3 style={styles.welcome}>Enter your personal information and create a password below</H3>
          <Form>
            <Item
              error={this.state.errors.firstName}
              style={styles.input}
              regular
            >
              <Input
                onChangeText={(text) => this.setField(() => this.firstName = text)}
                placeholder="First name"              
              />
            </Item>
            <Item
              error={this.state.errors.lastName}
              style={styles.input}
              regular
            >
              <Input
                onChangeText={(text) => this.setField(() => this.lastName = text)}
                placeholder="Last name"
              />
            </Item>
            <Item
              error={this.state.errors.loginId}
              style={styles.input}
              regular
            >
              <Input
                keyboardType="email-address"
                onChangeText={(text) => this.setField(() => this.loginId = text)}
                placeholder="Email"
              />
            </Item>
            <Item
              error={this.state.errors.password}
              style={styles.input}
              regular
            >
              <Input
                onChangeText={(text) => this.setField(() => this.password = text)}
                placeholder="Password"
                secureTextEntry
              />
            </Item>
            <Item
              error={this.state.errors.confirmPassword}
              style={styles.input}
              regular
            >
              <Input
                onChangeText={(text) => this.setField(() => this.confirmPassword = text)}
                placeholder="Confirm password"
                secureTextEntry
              />
            </Item>
            <ListItem>
              <CheckBox checked={terms} onPress={() => this.onTermsPressed()} />
              <Body>
                <Text>I have read and understood the term of use</Text>
              </Body>
            </ListItem>
            <Button
              onPress={() => this.onSignUpPressed()}
              style={styles.button}
              disabled={!this.state.terms}
              block
            >
              <Text>Sign Up</Text>
            </Button>
          </Form>
          <Button
            onPress={() => this.onSignInPressed()}
            small
            full
            transparent
          >
            <Text>Already have an account? Sign in</Text>
          </Button>          
        </Content>
      </Container>
    );
  }
}

export default SignUp;
