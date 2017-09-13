import React, { Component } from 'react';
import { Platform } from 'react-native';
import Dimensions from 'Dimensions';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import globalStyles from '../styles';

class CommentsStream extends Component {

  componentDidMount() {
    const { stream, screenProps, onStreamClosed } = this.props;
    screenProps.gigya.showComments(
      'mobilecomments',
      stream,
      { 
        x:0, y:80,
        w:Dimensions.get('window').width, h:(Dimensions.get('window').height - 80),
      },
      this.onScreenSetCompleted
    );

    if(Platform.OS === 'android') onStreamClosed();
  }

  onBackPressed = (stream) => {
    const { screenProps, onStreamClosed } = this.props;
    screenProps.gigya.hidePluginView();
    onStreamClosed();
  };

  onScreenSetCompleted = (error) => this.checkErrors(error);
  
  checkErrors = (error) => {
    const { screenProps } = this.props;
    if (!error) return;
    screenProps.notifyUser(error);
  };

  render() {
    return (
      <Container style={globalStyles.container}>
      <Header>
        <Left>
          <Button onPress={this.onBackPressed} transparent>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Comments</Title>
        </Body>
        <Right />
      </Header>
    </Container>
    );
  }
}

export default CommentsStream;
