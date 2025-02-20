import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  // Button,
  Modal,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { getStatusBarHeight } from "react-native-status-bar-height";
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
      Logedin: false,
      email: "",
      password: ""
    };
  }
  goToSignup = () => {
    this.props.navigation.navigate("SignUp");
  };
  _Dologin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " : " + errorMessage);
      })
      .then(() => {});
  };
  componentDidMount() {
    const { navigation } = this.props;
    let username = "";
    this.focusListener = navigation.addListener("didFocus", () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          // console.log("user found");
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
          // console.log("no user");
          this.setState({ Logedin: false });
        }
      });
    });
  }
  _userLogout() {
    firebase.auth().signOut();
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  // _updateUsername() {
  //   var user = firebase.auth().currentUser;
  //   user
  //     .updateEmail(this.state.name)
  //     .then(function() {
  //       // console.log("update");
  //       this.ShowModalFunction(!this.state.ModalVisibleStatus);
  //     })
  //     .catch(function(error) {
  //       alert(error);
  //     });
  // }
  render() {
    if (this.state.Logedin) {
      //is logged in: show profile page
      return (
        <ThemeProvider theme={theme}>
          <ScrollView style={styles.container}>
            <Image
              style={styles.profileImg}
              source={require("../assets/default_avatar.png")}
            />
            {/* <View style={styles.header}> */}
            <Text style={styles.title}>{this.state.name}</Text>
            {/* </View> */}
            <Button
              onPress={() => {
                this._userLogout();
              }}
              title="Logout"
              color="#841584"
              accessibilityLabel="Logout"
            />
            {/* <Button
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus);
              }}
              title="Update username"
              color="#841584"
              accessibilityLabel="Update username"
            /> */}
            {/* <View visible={this.state.Logedin}></View> */}
            {/* <Modal
              transparent={false}
              animationType={"slide"}
              visible={this.state.ModalVisibleStatus}
              onRequestClose={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
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
            </Modal> */}
          </ScrollView>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme}>
          <View keyboardShouldPersistTaps="always" style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <TextInput
              style={styles.inputBox}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.inputBox}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              placeholder="Password"
              secureTextEntry={true}
              textContentType="password"
            />
            <Button
              style={styles.button}
              title={"Login"}
              onPress={() => this._Dologin()}
            ></Button>
            <Button
              style={styles.button}
              title={"Create an account"}
              onPress={this.goToSignup.bind(this)}
            ></Button>
            <Text style={styles.name}>Where's the Milk?</Text>
          </View>
        </ThemeProvider>
      );
    }
  }
}

Profile.navigationOptions = {
  header: null
};

const theme = {
  Button: {
    buttonStyle: {
      width: 300,
      alignSelf: "center"
      // backgroundColor: ""
      // backgroundColor: "#132640"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#132640",
    paddingTop: getStatusBarHeight()
    // marginTop: 20
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
  inputBox: {
    // flex: 1,
    width: "80%",
    // marginLeft: 20,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#132640",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 15
    // marginTop: 50
  },
  title: {
    alignSelf: "center",
    fontSize: 25,
    margin: 10,
    color: "#fff",
    marginBottom: 15
  },
  profileImg: {
    width: 150,
    height: 150,
    alignSelf: "center"
  },
  button: {
    margin: 6
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  buttonSignup: {
    fontSize: 12
  },
  name: {
    alignSelf: "center",
    fontSize: 25,
    color: "#fff",
    // margin: 10,
    // color: "#fff",
    // marginBottom: 15
    position: "absolute",
    bottom: 10
  }
});

export default Profile;
// export default withRouter(Profile);
