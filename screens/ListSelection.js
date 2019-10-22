import React, { Component } from "react";
// import { withNavigationFocus, Keyboard } from "react-navigation";
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  View,
  Modal,
  TextInput,
  Clipboard
} from "react-native";
require("firebase/firestore");
const firestore = require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class ListSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Lists: [],
      text: "",
      editList: "",
      NewListModal: false,
      editListModal: false
    };
  }
  ShowEditListModal(visible) {
    this.setState({ editListModal: visible });
  }
  ShowNewListModal(visible) {
    this.setState({ NewListModal: visible });
  }
  // Item clicked. move back to Home page with new list
  _changeClick = ListName => {
    this.props.navigation.navigate(
      "Main",
      {},
      this.props.navigation.navigate({
        routeName: "Home",
        params: { name: ListName }
      })
    );
  };
  // Create a new list with the inputed name
  // need error handling for empty string
  _newList = ListName => {
    var userId = firebase.auth().currentUser.uid;
    var docRef = db
      .collection("users")
      .doc(userId)
      .set(
        {
          Lists: {
            [ListName]: []
          }
        },
        { merge: true }
      );
    this._changeClick(ListName);
  };
  getList = () => {
    var usersList;
    var ListName = this.state.editList;
    var userId = firebase.auth().currentUser.uid;
    var docRef = db.collection("users").doc(userId);
    docRef
      .get()
      .then(function(doc) {
        //get items from DB and add to usersList
        if (doc.exists) {
          usersList = [];
          user = doc.data();
          for (var key in user.Lists) {
            // console.log()
            if (key == ListName) {
              Clipboard.setString(user.Lists[key]);
              alert("Copied to Clipboard!");
            }
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
      .then(() => {
        // console.log(usersList)
        // return usersList;
      });
  };
  // get all of users lists and display them
  componentDidMount() {
    var userId = firebase.auth().currentUser.uid;
    var userId = userId;
    var docRef = db.collection("users").doc(userId);
    // .collection("Lists")
    // .doc("List name");
    var usersList;
    docRef
      .get()
      .then(function(doc) {
        //get items from DB and add to usersList
        if (doc.exists) {
          usersList = [];
          user = doc.data();
          for (var key in user.Lists) {
            usersList.push(key);
          }
        }
      })
      .then(() => {
        this.setState({ Lists: usersList });
      });
  }
  // get text from users clipboard, create new list with inputed data
  readFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    // this.setState({ clipboardContent });
    var temp = clipboardContent
      .slice(1, clipboardContent.length - 1)
      .split(",");
    var importedArray = [];
    temp.forEach(item => {
      importedArray.push(item.trim());
    });
    var ListName = "imported List"
    var userId = firebase.auth().currentUser.uid;
    var docRef = db
      .collection("users")
      .doc(userId)
      .set(
        {
          Lists: {
            [ListName]: importedArray
          }
        },
        { merge: true }
      );
    this._changeClick(ListName);
  };

  render() {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps="always">
          <Button
            onPress={() => {
              this.props.navigation.navigate(
                "Main",
                {},
                this.props.navigation.navigate({ routeName: "HomeStack" })
              );
            }}
            title="Back"
            color="#841584"
            accessibilityLabel="Back to List"
          />
          {this.state.Lists.map((item, key) => (
            <Button
              // onPress={() => this._changeClick({ item })}
              onPress={() => {
                this.setState({ editList: item });
                this.ShowEditListModal(true);
              }}
              title={item}
              key={key}
              //   style={styles.ListItem}
            />
          ))}
        </ScrollView>
        <Button
          onPress={() => this.ShowNewListModal(true)}
          title="Create new List"
        ></Button>
        {/* Edit List Modal */}
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.editListModal}
          onRequestClose={() => {
            this.ShowEditListModal(!this.state.editListModal);
          }}
        >
          <Text>{this.state.editList}</Text>
          <Button
            onPress={() => {
              // this.ShowEditListModal(false);
              this.getList();
            }}
            title="Copy List"
            color="#841584"
            accessibilityLabel="Copy List"
          />
          <Button
            onPress={() => {
              this.ShowEditListModal(false);
            }}
            title="Cancel"
            color="#841584"
            accessibilityLabel="Enter"
          />
        </Modal>
        {/* New List Modal */}
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.NewListModal}
          onRequestClose={() => {
            this.ShowNewListModal(!this.state.NewListModal);
          }}
        >
          <TextInput
            style={styles.searchBar}
            onChangeText={text => {
              this.setState({ text });
            }}
            value={this.state.text}
            clearTextOnFocus={true}
          />
          <Button
            onPress={() => {
              this.readFromClipboard();
              // console.log(this.state.clipboardContent)
              // this.setState({ clipboardContent });
              // this.ShowNewListModal(false);
              // this._newList(this.state.text);
            }}
            title="Import List from clipboard"
            color="#841584"
            accessibilityLabel="Import List from clipboard"
          />
          <Button
            onPress={() => {
              this.ShowNewListModal(false);
              this._newList(this.state.text);
            }}
            title="Enter"
            color="#841584"
            accessibilityLabel="Enter"
          />
          <Button
            onPress={() => {
              this.ShowNewListModal(false);
            }}
            title="Cancel"
            color="#841584"
            accessibilityLabel="Enter"
          />
        </Modal>
      </View>
    );
  }
}

ListSelection.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
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
  }
});

export default ListSelection;
