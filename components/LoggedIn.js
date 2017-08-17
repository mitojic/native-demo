import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, Text, H3 } from 'native-base';
import globalStyles from '../styles';

const styles = {
  welcome: { alignSelf: "center", marginTop: 50 },
};

class LoggedIn extends Component {
  render() {
    const { account, onLogout, onViewProfilePressed } = this.props;

    return(
      <Container style={globalStyles.container}>
        <Content>
          <H3 style={styles.welcome}>Welcome {account.profile.firstName}</H3>
          <H3></H3> 
          <H3></H3> 
          <H3></H3>
           <Button
              onPress={() => onViewProfilePressed()}
              style={styles.button}
              block
              success
            >
              <Text>View Profile</Text>
            </Button>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={onLogout}>
              <Icon name="log-out" />
              <Text>Log out</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default LoggedIn;
