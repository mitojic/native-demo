import React, { Component } from 'react';
import { Container, Content, Button, Icon, H3, Form, Item, Input, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import globalStyles from '../styles';
import constants from '../constants';

const styles = {
  button: { marginTop: 20 },
  heading: { marginTop: 10, marginBottom: 5, fontSize: 18 },
  input: { marginTop: 10 },
};

const ForgotPwd = ({ screenProps, navigation }) => {

  onLoginPressed = () => navigation.goBack();

  onResetPressed = () => {
    if (!this.loginId) {
      screenProps.notifyUser('Please provide an email address');
      return;
    };

    screenProps.loading();
    screenProps.gigya.resetPassword(this.loginId, this.onResetCompleted);
  };

  onResetCompleted = (error) => screenProps.notifyUser(error || 'Please check your email to reset your password');

  return (
    <Container style={globalStyles.container}>
      <Content>
        <Grid>
          <Row>
            <Col>
              <H3 style={styles.heading}>Please enter your email address to reset your password:</H3>
              <Form>
                <Item style={styles.input} regular>
                  <Input
                    keyboardType="email-address"
                    onChangeText={(text) => this.loginId = text}
                    placeholder="Email"
                  />
                </Item>
              </Form>
              <Button
                onPress={() => this.onResetPressed()}
                style={styles.button}
                block
                success
              >
                <Text>Reset password</Text>
              </Button>
              <Button
                onPress={() => this.onLoginPressed()}
                small
                full
                transparent
              >
                <Text>Login with a different account</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
}

export default ForgotPwd;
