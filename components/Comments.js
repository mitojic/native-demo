import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Button, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon } from 'native-base';
import globalStyles from '../styles';
import CommentsStream from './CommentsStream';

const styles = {
  deck: { marginTop: 50 },
};

const cards = [
  {
    text: 'Burger',
    name: 'burger',
    image: { uri: 'http://townhallburgerandbeer.com/wp-content/uploads/2015/06/mac-cheese-burger-townhall-burger-beer-durham-nc-400x300.jpg' },
  },
  {
    text: 'Pasta',
    name: 'pasta',
    image: { uri: 'http://img.bestrecipes.com.au/AtA4r7K-/h300-w400-cscale/br-api/asset/6068/creamy-pasta-salad-recipe.jpg' },
  },
];

class Comments extends Component {
  constructor(){
    super();
    this.state = {
      showStream: false,
    };
  }

  onCommentsPressed = (stream) => {
    this.setState({ showStream: true, stream });
  };

  closeStream = () => {
    this.setState({ showStream: false });
  };

  render() {
    const { showStream, stream } = this.state;

    if(showStream) {
      return (<CommentsStream
        stream={stream}
        onStreamClosed={this.closeStream}
        screenProps={this.props.screenProps}
      />)
    }

    return(
      <Container style={globalStyles.container}>
        <View style={styles.deck}>
          <DeckSwiper
            ref={(c) => this._deckSwiper = c}
            dataSource={cards}          
            renderItem={item =>
              <Card style={{ elevation: 3 }}>
                <CardItem>
                  <Left>
                    <Thumbnail source={item.image} />
                    <Body>
                      <Text>{item.text}</Text>
                      <Text note>Food comments demo</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{ height: 300, flex: 1 }} source={item.image} />
                </CardItem>
                <CardItem>
                  <Button
                    onPress={() => this.onCommentsPressed(item.name)}
                    transparent
                  >
                    <Icon name="chatbubbles" />
                    <Text>View comments</Text>
                  </Button>
                </CardItem>
              </Card>
            }
          />          
        </View>
        <View style={{ flexDirection: "row", flex: 1, position: "absolute", bottom: 50, left: 0, right: 0, justifyContent: 'space-between', padding: 15 }}>
          <Button iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
            <Icon name="arrow-back" />
            <Text>Previous</Text>
          </Button>
          <Button iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
            <Text>Next</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
      </Container>
    );
  }
}

export default Comments;
