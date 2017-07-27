import React from 'react';
import { Container, Header, Content, Button, Icon, H3, Form, Item, Input, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import globalStyles from '../styles';

const styles = {
  button: { marginTop: 10 },
  heading: { marginTop: 20, marginBottom: 20 },
  separatorText: { alignSelf: "center" },
  separatorRow: { marginTop: 20, marginBottom: 20 },
  separator: { backgroundColor: "#000", height: 1, marginTop: 10 },
};

const Login = ({ onLoginPressed, onSocialLoginPressed, onScreensetPressed }) => (
  <Container style={globalStyles.container}>
    <Header style={globalStyles.header} />
    <Content>
      <Grid>
        <Row>
          <Col>
            <H3 style={styles.heading}>Log in with your email and password:</H3>
            <Form>
              <Item regular>
                <Input
                  onChangeText={(text) => this.loginId = text}
                  placeholder="Username"
                />
              </Item>
              <Item regular>
                <Input
                  onChangeText={(text) => this.password = text}
                  placeholder="Password"
                  secureTextEntry
                />
              </Item>
            </Form>
            <Button
              onPress={() => onLoginPressed(this.loginId, this.password)}
              style={styles.button}
              block
              success
            >
              <Text>Login</Text>
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
            <H3 style={styles.heading}>Quickly log in with your social network:</H3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              style={styles.button}
              onPress={() => onSocialLoginPressed('facebook')}
              block
            >
              <Icon name='logo-facebook' />
            </Button>
            <Button
              style={styles.button}
              onPress={() => onSocialLoginPressed('googleplus')}
              block
            >
              <Icon name='logo-googleplus' />
            </Button>
            <Button
              style={styles.button}
              onPress={() => onSocialLoginPressed('twitter')}
              block
            >
              <Icon name='logo-twitter' />
            </Button>
            <Button
              onPress={() => onScreensetPressed()}
              style={styles.button}
              block
              success
            >
              <Text>Screenset</Text>
            </Button>
          </Col>
        </Row>
      </Grid>
    </Content>
  </Container>
);

export default Login;
