import React, { Component } from "react";
// import { withNavigationFocus, Keyboard } from "react-navigation";
import { StyleSheet, Text, ScrollView, Button } from "react-native";
require("firebase/firestore");
const firestore = require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class ListSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var userId = firebase.auth().currentUser.uid;
    const snapshot = firebase.firestore().collection('users').doc(userId).collection("Lists")
    snapshot.get().then(() => {
      var temp = snapshot;//.map(doc => doc.data());
      console.log(temp)
    })
    // var docRef = db
    //   .collection("users")
    //   .doc(userId)
    //   .collection("Lists");
    // docRef.get().then(function(doc) {
    //   if (doc.exists) {
    //     console.log("Document data:", doc.data());
    //   } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    //   }
    // });
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <Button
          onPress={() => {
            this.props.navigation.navigate(
              "Main",
              {},
              this.props.navigation.navigate({ routeName: "HomeStack" })
            );
          }}
          title="Back"
          color="#841584"
          accessibilityLabel="Back to List"
        />
        {/* {this.state.ItemList.map((item, key) => (
          <Button
            onPress={() => this._handleClick({ item })}
            title={item}
            key={key}
            //   style={styles.ListItem}
          >
            {item}
          </Button>
        ))} */}
      </ScrollView>
    );
  }
}

ListSelection.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({});

export default ListSelection;
