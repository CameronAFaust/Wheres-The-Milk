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
// import { createStackNavigator, createAppContainer } from 'react-navigation';
import AppNavigator from "./navigation/AppNavigator";

export default class App extends Component {
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
