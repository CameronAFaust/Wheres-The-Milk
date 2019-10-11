import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  ScrollView
} from "react-native";
// import { Link, withRouter } from "react-router-dom";
require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      name: "",
      ModalVisibleStatus: false,
      Logedin: false
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    let username = "";
    this.focusListener = navigation.addListener("didFocus", () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          console.log("user found");
          var docRef = db.collection("users").doc(userId);
          docRef
            .get()
            .then(function(doc) {
              user = doc.data();
              username = user.userName;
            })
            .then(() => {
              this.setState({ name: user.userName });
              this.setState({ Logedin: true });
            });
        } else {
          console.log("no user");
          // this.navigat();
        }
      });
    });
  }
  // navigat() {
  //   const { navigate } = this.props.navigation;
  //   navigate("ListStack");
  //   console.log("here")
  // }
  _userLogout() {
    firebase.auth().signOut();
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  _updateUsername() {
    var user = firebase.auth().currentUser;
    user
      .updateEmail(this.state.name)
      .then(function() {
        console.log("update");
        this.ShowModalFunction(!this.state.ModalVisibleStatus);
      })
      .catch(function(error) {
        alert(error);
      });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text>{this.state.name}</Text>
        </View>
        <Button
          onPress={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
          title="Update username"
          color="#841584"
          accessibilityLabel="Update username"
        />
        <Button
          onPress={() => {
            this._userLogout();
          }}
          title="Logout"
          color="#841584"
          accessibilityLabel="Logout"
        />
        {/* <View visible={this.state.Logedin}></View> */}
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
                onChangeText={text => this.setState({ name: text })}
                value={this.state.name}
                clearTextOnFocus={false}
              />
              <Button
                onPress={() => {
                  this._updateUsername();
                }}
                title="Update"
                style={styles.ListItem}
              >
                Update
              </Button>
              <Button
                onPress={() => {
                  this.ShowModalFunction(!this.state.ModalVisibleStatus);
                }}
                title="Cancel update"
                style={styles.ListItem}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

Profile.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
  }
});

export default Profile;
// export default withRouter(Profile);
