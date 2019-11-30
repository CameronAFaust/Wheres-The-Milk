import React, { Component } from "react";
// import { withNavigationFocus, Keyboard } from "react-navigation";
import { Button, ThemeProvider } from "react-native-elements";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Modal,
  TextInput,
  Clipboard,
  TouchableOpacity
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
require("firebase/firestore");
const firestore = require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class ListSelection extends Component {
  constructor(props) {
    global.SelectedList = "List 1";
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
    global.SelectedList = ListName;
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
    // console.log(this.state.text);
    var ListName = this.state.text;
    if (this.state.text == "") {
      var ListName = "imported List";
    }
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
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.ScrollStyle}
        >
          <Button
            onPress={() => {
              this.props.navigation.navigate(
                "Main",
                {},
                this.props.navigation.navigate({ routeName: "HomeStack" })
              );
            }}
            title="Back"
            accessibilityLabel="Back to List"
          />
          <Text style={styles.ListText}>Select List</Text>
          {this.state.Lists.map((item, key) => (
            <Button
              style={styles.listStyle}
              onPress={() => {
                this.setState({ editList: item });
                this.ShowEditListModal(true);
              }}
              title={item}
              key={key}
            />
          ))}
        </ScrollView>
        <Button
          onPress={() => this.ShowNewListModal(true)}
          title="Create new List"
          style={styles.newListStyle}
        />
        {/* Edit List Modal */}
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.editListModal}
          onRequestClose={() => {
            this.ShowEditListModal(!this.state.editListModal);
          }}
        >
          <TouchableOpacity
            style={styles.modalBack}
            activeOpacity={0}
            onPressOut={() => {
              // this.ShowModalFunction(false);
              this.ShowEditListModal(false);
            }}
          >
            <View style={styles.itemModal} keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback>
                <View style={styles.ModalInsideView}>
                  <Text style={styles.TextStyle}>{this.state.editList}</Text>
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      this._changeClick(this.state.editList);
                    }}
                    title="Select List"
                    // color="#841584"
                    accessibilityLabel="Select List"
                  />
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      // this.ShowEditListModal(false);
                      this.getList();
                    }}
                    title="Copy List"
                    // color="#841584"
                    accessibilityLabel="Copy List"
                  />
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      this.ShowEditListModal(false);
                    }}
                    title="Cancel"
                    // color="#841584"
                    accessibilityLabel="Enter"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* New List Modal */}
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.NewListModal}
          onRequestClose={() => {
            this.ShowNewListModal(!this.state.NewListModal);
          }}
        >
          <TouchableOpacity
            style={styles.modalBack}
            activeOpacity={0}
            onPressOut={() => {
              this.ShowNewListModal(false);
            }}
          >
            <View style={styles.itemModal} keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback>
                <View style={styles.ModalInsideView}>
                  <TextInput
                    placeholder="Name of new list"
                    style={styles.searchBar}
                    placeholderTextColor="#000"
                    onChangeText={text => {
                      this.setState({ text });
                    }}
                    value={this.state.text}
                    clearTextOnFocus={true}
                  />
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      this.readFromClipboard();
                    }}
                    title="Import List from clipboard"
                    // color="#841584"
                    accessibilityLabel="Import List from clipboard"
                  />
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      this.ShowNewListModal(false);
                      this._newList(this.state.text);
                    }}
                    title="Enter"
                    // color="#841584"
                    accessibilityLabel="Enter"
                  />
                  <Button
                    style={styles.EditButtons}
                    onPress={() => {
                      this.ShowNewListModal(false);
                    }}
                    title="Cancel"
                    // color="#841584"
                    accessibilityLabel="Enter"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

ListSelection.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
    backgroundColor: "#132640",
    color: "#f0f"
  },
  searchBar: {
    width: "80%",
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center",
    margin: 15
  },
  ScrollStyle: {
    height: "100%",
    width: "100%",
    flexDirection: "column"
  },
  listStyle: {
    color: "#fff",
    width: "80%",
    alignSelf: "center",
    margin: 5
  },
  ListText: {
    alignSelf: "center",
    fontSize: 20,
    marginBottom: 10,
    color: "#fff",
    marginTop: 10
  },
  newListStyle: {
    position: "absolute",
    bottom: 10,
    width: "90%",
    alignSelf: "center"
  },
  ModalInsideView: {
    margin: 15,
    marginTop: "35%",
    backgroundColor: "#b2d2dd",
    height: 300,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "column"
  },
  itemModal: {
    height: "100%",
    backgroundColor: "rgba(100,100,100, 0.8)"
  },
  TextStyle: {
    alignSelf: "center",
    fontSize: 20,
    // marginBottom: 10,
    margin: 10
  },
  EditButtons: {
    width: "90%",
    // marginLeft: 20,
    // padding: 15,
    borderColor: "#d6d7da",
    backgroundColor: "#132640",
    alignSelf: "center",
    marginBottom: 5
  }
});

export default ListSelection;
