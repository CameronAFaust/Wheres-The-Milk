// import * as WebBrowser from 'expo-web-browser';
import React, { Component } from "react";
import { Button } from "react-native";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ItemList: []
      // modalVisible: false,
    };
  }
  _getInput() {
    this.setState({ ItemList: [...this.state.ItemList, this.state.text] });
  }
  _handleClick = pram => {
    // this.setState({modalVisible: true});
    this.setState({ editItemName: pram.item });
  };

  _getList = userId => {
    var docRef = db.collection("users").doc(userId);
    var usersList;
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          var user = doc.data();
          usersList = user.List[0].list1;
          console.log(usersList);
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
      .then(() => {
        this.setState({ ItemList: usersList });
      });
  };

  _editItem() {
    console.log(this.state.text);
    // this.setState({ ItemList: [...this.state.ItemList, this.state.text] })
    console.log("updated");
  }
  _deleteItem() {
    console.log("deleted");
  }

  _handleListChange = pram => {
    this.setState({ ItemList: pram });
    console.log(this.state.ItemList);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.searchBar}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          clearTextOnFocus={true}
        />
        <Button
          onPress={() => this._getInput()}
          title="Enter"
          color="#841584"
          accessibilityLabel="Enter"
        />
        <View>
          {this.state.ItemList.map((item, key) => (
            <Button
              onPress={() => this._handleClick({ item })}
              title={item}
              key={key}
              style={styles.ListItem}
            >
              {item}
            </Button>
          ))}
        </View>
        <View style={styles.container}>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  searchBar: {
    // flex: 1,
    width: "80%",
    // marginLeft: 20,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 50
  },
  ListItem: {
    width: "90%",
    // marginLeft: 20,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 10
  }
});
