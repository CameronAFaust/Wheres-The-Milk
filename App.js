import React, { Component } from 'react';
import { View, TextInput, Button, Alert, Text, Picker, StyleSheet, Keyboard, TouchableWithoutFeedback, Modal, TouchableHighlight } from 'react-native';
var DismissKeyboard = require('dismissKeyboard');
require("firebase/firestore");
const firebase = require("firebase");

firebase.initializeApp({
    apiKey: "AIzaSyBp5DHO2pXerW_HYQCklL5X286qqCrrH1U",
    authDomain: "wheresthemilk-816ca.firebaseapp.com",
    projectId: "wheresthemilk-816ca",
    databaseURL: "https://wheresthemilk-816ca.firebaseio.com"
});

const db = firebase.firestore()

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: '', 
        ItemList: [],
        modalVisible: false,
        editItemName: '',
        userName: '',
        password: '',
    };
  }

  _getList(){    
    // console.log(this.state.modalVisible);
    var db = firebase.firestore();
    var docRef = db.collection("users").doc("user1");
    var usersList;
    docRef.get().then(function(doc) {
      if (doc.exists) {
          var user = doc.data();
          console.log(user.lists)
          usersList = user.lists[0].products;
          // return user.lists[0].products;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
    });
    // this.setState({ItemList: usersList});
  }

  _getInput() {
    console.log(this.state.text);
    this.setState({ ItemList: [...this.state.ItemList, this.state.text] })
    // db.collection("users").add({
    //   UsersList2: ["one", "two", "333"]
    // })
    // .then(function(docRef) {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });
  }

  _editItem(){
    console.log(this.state.text);
    // this.setState({ ItemList: [...this.state.ItemList, this.state.text] })
    console.log("updated")
  }
  _deleteInput(){
    console.log("deleted")
  }

  _handleClick = (pram) => {
    this.setState({modalVisible: true});
    this.setState({editItemName: pram.item});
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _login(){
    firebase.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // console.log(errorMessage)
      // ...
    });
  }

  _signup() {
    try {
        const response = firebase.auth().createUserWithEmailAndPassword(this.state.userName, this.state.password).then(() => {
          console.log(response.user)
          userData = firebase.auth().currentUser;

          // console.log(user)
          if (userData.uid) {
              const user = {
                  uid: userData.uid,
                  userName: this.state.userName
              }

              db.collection('users')
                  .doc(userData.uid)
                  .set(user)

              // .dispatch({ type: SIGNUP, payload: user })
          }
        });
    } catch (e) {
        alert(e)
    }
  }
  //       {
  //         "username": "no",
  //         "Lists": [
  //           "list1": {
  //             "products": [
  //               "paper airplanes",
  //               "tooth picks"
  //             ],
  //             "total": 500
  //           },
  //           "list2": {
  //             "Products": [
  //               "rocks and dirt",
  //               "spatulas"
  //             ],
  //             "total": 1000
  //           }
  //         ]
  //       }


  render() {
    return (
      <View>
        <TextInput
            style={styles.searchBar}
            onChangeText={(userName) => this.setState({userName})}
            value={this.state.userName}
            clearTextOnFocus={true} 
          />
          <TextInput
            style={styles.searchBar}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            clearTextOnFocus={true} 
          />
          <Button
            onPress={() => this._signup()}
            title="Enter"
            color="#841584"
            accessibilityLabel="Enter"
          />


          {/* <TextInput
            style={styles.searchBar}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            clearTextOnFocus={true} 
          />
        <Button
          onPress={() => this._getInput()}
          title="Enter"
          color="#841584"
          accessibilityLabel="Enter"
        />
        <View>
          { this.state.ItemList.map((item, key)=>(
            <Button onPress={() => this._handleClick({item})} title={item} key={key} style={styles.ListItem}>{item}</Button>)
          )}
        </View> */}
        {/* <Modal
          animationType="slide"
          transparent={false}
          presentationStyle={"formSheet"}
          visible={this.state.modalVisible}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Edit</Text>
                <TextInput
                  style={styles.searchBar}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.editItemName}
                />
                <Button
                  onPress={() => this._editItem()}
                  title="Enter"
                  color="#841584"
                  accessibilityLabel="Enter"
                />
                <Button
                  onPress={() => this._deleteInput()}
                  title="Delete"
                  color="#841584"
                  accessibilityLabel="Enter"
                />
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal> */}
        {/* <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight> */}
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    // flex: 1,
    width:'80%',
    // marginLeft: 20,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 50,
  },
  ListItem: {
    width:'90%',
    // marginLeft: 20,
    padding:15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 10,
  }
});



