import React, { Component } from "react";
import { withNavigationFocus } from "react-navigation";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button
} from "react-native";
require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ItemList: [],
      userid: "",
      modalVisible: false,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // if(firebase.auth().currentUser != null){
      //   var userid = firebase.auth().currentUser.uid;
      this._getList();
      // }
    });
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  _getInput() {
    this.setState({ ItemList: [...this.state.ItemList, this.state.text] });
    var userId = firebase.auth().currentUser.uid;
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("Lists")
      .doc("List name");
    firebase
      .firestore()
      .runTransaction(async transaction => {
        const doc = await transaction.get(ref);
        transaction.update(ref, {
          list: this.state.ItemList
        });
      })
  }
  _handleClick = pram => {
    this.setState({modalVisible: true});
  };

  _getList = () => {
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name");
      var usersList;
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            user = doc.data();
            usersList = user.list;
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
        .then(() => {
          this.setState({ ItemList: usersList });
        });
    }
  };

  _editItem() {
    console.log(this.state.text);
    // this.setState({ ItemList: [...this.state.ItemList, this.state.text] })
    console.log("updated");
  }
  _deleteItem() {
    console.log(this.state.text);
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
        <View style={styles.container}></View>
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

export default HomeScreen;
