import Login from './screens/Login'
import Signup from './screens/Signup'
import React, { Component } from 'react';
import { Platform, StatusBar, View, TextInput, Button, Alert, Text, Picker, StyleSheet, Keyboard, TouchableWithoutFeedback, Modal, TouchableHighlight } from 'react-native';

import AppNavigator from './navigation/AppNavigator';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: '', 
        ItemList: [],
        modalVisible: false,
    };
  }

  _getList = (userId) => {    
    var docRef = db.collection("users").doc(userId);
    var usersList;
    docRef.get().then(function(doc) {
      if (doc.exists) {
          var user = doc.data();
          usersList = user.List[0].list1;
          console.log(usersList)
      }}).catch(function(error) {
          console.log("Error getting document:", error);
    }).then(() => {
      this.setState({ItemList: usersList});
    });
  }

  _editItem(){
    console.log(this.state.text);
    // this.setState({ ItemList: [...this.state.ItemList, this.state.text] })
    console.log("updated")
  }
  _deleteInput(){
    console.log("deleted")
  }

  _handleListChange = (pram) => {
    this.setState({ItemList: pram});
    console.log(this.state.ItemList)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    // return <Login />
    // return <Signup />
    return(
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});



