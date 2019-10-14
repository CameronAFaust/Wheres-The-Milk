import React, { Component } from "react";
// import { Dimensions } from "react-native";
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
// firebase.initializeApp({
//   apiKey: "AIzaSyBp5DHO2pXerW_HYQCklL5X286qqCrrH1U",
//   authDomain: "wheresthemilk-816ca.firebaseapp.com",
//   projectId: "wheresthemilk-816ca",
//   databaseURL: "https://wheresthemilk-816ca.firebaseio.com"
// });

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  goToSignup() {
    this.props.navigator.push({
      component: Signup
    });
    console.log("this.props.navigator")
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
      .then(() => {});
  };

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
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
        >
          Login
        </Button>
        <Button
          style={styles.button}
          title={"Sign up"}
          onPress={() => this.goToSignup()}
        >
          Sign up
        </Button>
      </ScrollView>
    );
  }
}

Login.navigationOptions = {
  header: null
};

export default Login;
