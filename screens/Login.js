import React, { Component } from "react";
import { Dimensions } from "react-native";
// import listPage from "./List";
// import appPage from "../app"
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  ScrollView
} from "react-native";
// require("firebase/firestore");
const firebase = require("firebase");
firebase.initializeApp({
  apiKey: "AIzaSyBp5DHO2pXerW_HYQCklL5X286qqCrrH1U",
  authDomain: "wheresthemilk-816ca.firebaseapp.com",
  projectId: "wheresthemilk-816ca",
  databaseURL: "https://wheresthemilk-816ca.firebaseio.com"
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  _Dologin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " : " + errorMessage);
      })
      .then(() => {
      });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button
          style={styles.button}
          title={"Login"}
          onPress={() => this._Dologin()}
        ></Button>
        <Button title="Don't have an account yet? Sign up" />
      </ScrollView>
    );
  }
}

Login.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 500,
    backgroundColor: "#fff"
    // alignItems: "center",
    // justifyContent: "center"
  },
  inputBox: {
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
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#F6820D",
    borderColor: "#F6820D",
    borderWidth: 1,
    borderRadius: 5,
    width: 200
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

export default Login;
