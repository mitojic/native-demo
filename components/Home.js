import React from 'react';
import Dimensions from 'Dimensions';
import { Container, Content, Footer, FooterTab, Button, Icon, Text, H3 } from 'native-base';
import globalStyles from '../styles';

const styles = {
  welcome: { alignSelf: "center", marginTop: 50 },
};

const Home = ({ screenProps }) => {
  onLogout = () => {
    screenProps.loading();
    screenProps.gigya.logout();
  }

  onViewProfilePressed = () => {
    screenProps.loading();
    screenProps.gigya.showScreenSet(
      'Default-ProfileUpdate',
      {
        x:0, y:0,
        w:Dimensions.get('window').width, h:Dimensions.get('window').height,
        screenSetParams:{}
      },
      this.onScreenSetCompleted
    );
  };

  onScreenSetCompleted = (error) => this.checkErrors(error);

  checkErrors = (error) => {
    screenProps.loading(true);
    if (!error) return;
    screenProps.notifyUser(error);
  };

  return(
    <Container style={globalStyles.container}>
      <Content>
        <H3 style={styles.welcome}>Welcome {screenProps.account.profile.firstName}</H3>
        <H3></H3> 
        <H3></H3> 
        <H3></H3>
          <Button
            onPress={() => this.onViewProfilePressed()}
            style={styles.button}
            block
            success
          >
            <Text>View Profile</Text>
          </Button>
      </Content>
      <Footer>
        <FooterTab>
          <Button vertical onPress={this.onLogout}>
            <Icon name="log-out" />
            <Text>Log out</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

export default Home;
