import React, { Component } from "react";
import { withNavigationFocus, Keyboard } from "react-navigation";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Modal,
  ScrollView
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
      ModalVisibleStatus: false,
      EditItem: "",
      Updatedtext: ""
    };
  }
  _getInput() {
    if (!this.state.ItemList.includes(this.state.text)) {
      // console.log("does contain");
      this.setState({ ItemList: [...this.state.ItemList, this.state.text] });
      var userId = firebase.auth().currentUser.uid;
      const update = {};
      update[`${this.state.text}`] = this.state.text;
      const ref = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .set(update, { merge: true });
    } else {
      alert("Item already in list");
    }
  }
  _getList = () => {
    // console.log(this.state.userid);
    if (this.state.userid != null) {
      // var userId = firebase.auth().currentUser.uid;
      var userId = this.state.userid;
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
            usersList = [];
            user = doc.data();
            for (var key in user) {
              usersList.push(user[key]);
            }
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
  _getList = userid => {
    var userId = firebase.auth().currentUser.uid;
    var userId = userId;
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
          usersList = [];
          user = doc.data();
          for (var key in user) {
            usersList.push(user[key]);
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
      .then(() => {
        this.setState({ ItemList: usersList });
      });
  };
  _handleClick = pram => {
    this.setState({ Updatedtext: pram.item });
    this.setState({ EditItem: pram.item });
    this.ShowModalFunction();
  };
  _editItem(original, Edited) {
    const update = {};
    const del = {};
    del[`${original}`] = firebase.firestore.FieldValue.delete();
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .update(del);
      update[`${Edited}`] = Edited;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .set(update, { merge: true });
    }
    // this._getList();
    this.ShowModalFunction(false);
  }
  _deleteItem(item) {
    const update = {};
    update[`${item}`] = firebase.firestore.FieldValue.delete();
    var userId = firebase.auth().currentUser.uid;

    const ref = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("Lists")
      .doc("List name")
      .update(update);
  }
  _handleListChange = pram => {
    this.setState({ ItemList: pram });
  };
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // console.log("loaded");
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // console.log("user");
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          this._getList(userId);
          // console.log(userId);
        } else {
          console.log("no user");
        }
      });
    });
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <TextInput
          style={styles.searchBar}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          clearTextOnFocus={true}
        />
        <Button
          onPress={() => {
            this._getInput();
            this._getList();
          }}
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
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.ModalInsideView}>
              <TextInput
                style={styles.searchBar}
                onChangeText={text => this.setState({ Updatedtext: text })}
                value={this.state.Updatedtext}
                clearTextOnFocus={false}
                // returnKeyType="go"
              />
              <Button
                onPress={() => {
                  this._editItem(this.state.EditItem, this.state.Updatedtext);
                  this._getList();
                  this.setState({ EditItem: "" });
                  this.setState({ Updatedtext: "" });
                }}
                title="Update"
                style={styles.ListItem}
              >
                Update
              </Button>
              <Button
                onPress={() => {
                  this._deleteItem(this.state.EditItem);
                  this._getList();
                }}
                title="Delete"
                style={styles.ListItem}
              >
                Delete
              </Button>
              <Button
                title="Click Here To Hide Modal"
                onPress={() => {
                  this.ShowModalFunction(!this.state.ModalVisibleStatus);
                }}
              />
            </View>
          </ScrollView>
        </Modal>
        {/* <View style={styles.container}></View> */}
      </ScrollView>
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
  },
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    height: 300,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },

  TextStyle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
    padding: 20,
    textAlign: "center"
  }
});

export default HomeScreen;
