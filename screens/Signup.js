import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
  // Button
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import { getStatusBarHeight } from "react-native-status-bar-height";
require("firebase/firestore");
const firebase = require("firebase");

const db = firebase.firestore();

class Signup extends React.Component {
  state = {
    email: "",
    password: ""
  };

  _signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " : " + errorMessage);
      })
      .then(() => {
        userData = firebase.auth().currentUser;
        if (userData != null) {
          const user = {
            Lists: [
              {
                "List 1": []
              }
            ],
            uid: userData.uid,
            userName: this.state.email,
            total: 500
          };
          db.collection("users")
            .doc(userData.uid)
            .set(user);
          const List = {};
          db.collection("users").doc(userData.uid);
        }
      })
      .then(() => {
        userData = firebase.auth().currentUser;
        if (userData != null) {
          this.props.navigation.navigate(
            "Main",
            {},
            this.props.navigation.navigate({ routeName: "HomeStack" })
          );
        }
      });
  };

  _Cancel = () => {
    this.props.navigation.navigate(
      "Main",
      {},
      this.props.navigation.navigate({ routeName: "ProfileStack" })
    );
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container} keyboardShouldPersistTaps="always">
          <Text style={styles.title}>Create an account</Text>
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
            title={"Signup"}
            onPress={() => this._signup()}
          ></Button>
          <Button
            style={styles.button}
            title={"Cancel"}
            onPress={() => this._Cancel()}
          ></Button>
        </View>
      </ThemeProvider>
    );
  }
}

Signup.navigationOptions = {
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
    paddingTop: getStatusBarHeight(),
    marginTop: 0
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
  title: { alignSelf: "center", fontSize: 25, margin: 10, color: "#fff" },
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
  }
});

export default Signup;
