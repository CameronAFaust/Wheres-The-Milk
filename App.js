import Login from "./screens/Login";
import Signup from "./screens/Signup";
import React, { Component } from "react";
import {
  Platform,
  StatusBar,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  Picker,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  TouchableHighlight
} from "react-native";

import AppNavigator from "./navigation/AppNavigator";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: "testhere"
    };
  }
  render(){
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
