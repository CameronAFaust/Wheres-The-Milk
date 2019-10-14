import React from "react";
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
            uid: userData.uid,
            userName: this.state.email,
            total: 500
          };
          db.collection("users")
            .doc(userData.uid)
            .set(user);
          const List = {};
          db.collection("users")
            .doc(userData.uid)
            .collection("Lists")
            .doc("List name")
            .set(List);
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
      <View>
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
        <TouchableOpacity style={styles.button} onPress={() => this._signup()}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => this._Cancel()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Signup.navigationOptions = {
  title: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center"
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#FFA611",
    borderColor: "#FFA611",
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

export default Signup;
