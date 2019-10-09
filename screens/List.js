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
  Button,
  Modal
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
    const update = {};
    update[`${this.state.text}`] = this.state.text;
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("Lists")
      .doc("List name")
      .set(update, { merge: true });
  }
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
  _handleClick = pram => {
    this.setState({ Updatedtext: pram.item });
    this.setState({ EditItem: pram.item });
    this.ShowModalFunction();
  };
  _editItem(original, Edited) {
    const update = {};
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      update[`${original}`] = Edited;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .update(update);
    }
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
      .update(
        update
        // ,
        // { merge: true }
      );
    // console.log(this.state.text);
  }
  _handleListChange = pram => {
    this.setState({ ItemList: pram });
    console.log(this.state.ItemList);
  };

  ShowModalFunction(visible) {
    // this.state.Updatedtext
    // this.setState({ Updatedtext: this.state.EditItem });
    this.setState({ ModalVisibleStatus: visible });
    console.log(this.state.Updatedtext);
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
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.ModalInsideView}>
              <TextInput
                style={styles.searchBar}
                onChangeText={text => this.setState({ Updatedtext: text })}
                value={this.state.Updatedtext}
                clearTextOnFocus={false}
              />
              <Button
                onPress={() =>
                  this._editItem(this.state.EditItem, this.state.Updatedtext)
                }
                title="Update"
                style={styles.ListItem}
              >
                Update
              </Button>
              <Button
                onPress={() => this._deleteItem(this.state.EditItem)}
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
          </View>
        </Modal>
        {/* <View style={styles.container}></View> */}
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
