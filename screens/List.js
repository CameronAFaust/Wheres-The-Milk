import React, { Component } from "react";
import { withNavigationFocus, Keyboard } from "react-navigation";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Modal,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
require("firebase/firestore");
const firebase = require("firebase");
firebase.initializeApp({
  apiKey: "AIzaSyBp5DHO2pXerW_HYQCklL5X286qqCrrH1U",
  authDomain: "wheresthemilk-816ca.firebaseapp.com",
  projectId: "wheresthemilk-816ca",
  databaseURL: "https://wheresthemilk-816ca.firebaseio.com"
});
const db = firebase.firestore();

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      ItemList: [],
      ItemListPrices: [],
      userid: "",
      ModalVisibleStatus: false,
      EditItem: "",
      Updatedtext: "",
      SelectedList: "",
      searchedAdresses: [],
      CompleteData: [],
      ItemPrice: [],
      ListName: ""
    };
  }
  searchedAdresses = searchedText => {
    if (searchedText == "") {
      this.setState({ searchedAdresses: [] });
    } else {
      this.GetAuto(searchedText);
    }
  };
  SetAuto = data => {
    this.setState({ CompleteData: data });
    var searchedAdresses = [];
    data.forEach(item => {
      searchedAdresses.push(item.name);
    });
    this.setState({ searchedAdresses: searchedAdresses });
    // console.log(searchedAdresses);
  };
  GetAuto = input => {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = loadComplete = () => {
      this.SetAuto(JSON.parse(xhr.responseText));
    };
    xhr.open(
      "GET",
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete?number=5&query=${input}`
    );
    xhr.setRequestHeader(
      "x-rapidapi-host",
      "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    );
    xhr.setRequestHeader(
      "x-rapidapi-key",
      "22565bcaa7msh7b316a0ef99472ap164e6cjsn2841a03ec9cd"
    );

    xhr.send(data);
  };
  //get first list in users DB
  _getList = () => {
    var userId = firebase.auth().currentUser.uid;
    var ListName = this.state.ListName;
    var userId = userId;
    var docRef = db.collection("users").doc(userId);
    // .collection("Lists")
    // .doc("List name");
    var usersList;
    docRef
      .get()
      .then(function(doc) {
        //get items from DB and add to usersList
        if (doc.exists) {
          usersList = [];
          user = doc.data();
          for (var key in user.Lists) {
            if (key == ListName) {
              user.Lists[key].forEach(item => {
                usersList.push(item);
              });
              break;
            }
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
      .then(() => {
        // this.PriceItems(usersList);
        this.setState({ ListName: ListName });
        this.setState({ ItemList: usersList });
      });
  };
  // add item to list
  _getInput(item) {
    SelectedList = this.state.ListName
    if (!this.state.ItemList.includes(item)) {
      this.setState({ ItemList: [...this.state.ItemList, item] });
      var userId = firebase.auth().currentUser.uid;
      const ref = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .set(
          {
            Lists: {
              [SelectedList]: firebase.firestore.FieldValue.arrayUnion(item)
            }
          },
          { merge: true }
        );
    } else {
      alert("Item already in list");
    }
  }
  //get original item and edit it to new item
  _editItem(original, Edited) {
    SelectedList = this.state.ListName
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .set(
          {
            Lists: {
              [SelectedList]: firebase.firestore.FieldValue.arrayRemove(original)
            }
          },
          { merge: true }
        );
      var docRef = db
        .collection("users")
        .doc(userId)
        .set(
          {
            Lists: {
              [SelectedList]: firebase.firestore.FieldValue.arrayUnion(Edited)
            }
          },
          { merge: true }
        );
    }
    // this._getList();
    this.ShowModalFunction(false);
  }
  //remove item
  _deleteItem(item) {
    // const update = {};
    // update[`${item}`] = firebase.firestore.FieldValue.delete();
    SelectedList = this.state.ListName
    var userId = firebase.auth().currentUser.uid;
    var docRef = db
      .collection("users")
      .doc(userId)
      .set(
        {
          Lists: {
            [SelectedList]: firebase.firestore.FieldValue.arrayRemove(item)
          }
        },
        { merge: true }
      );
    this.ShowModalFunction(false);
  }
  _getPrices = list => {
    // console.log(list);
    list.forEach(item => {
      // loadData();
    });
    //  for each item in list
    //  `https://api.spoonacular.com/food/products/search?query=${item}`
    //  if none return null, or nothing else:
    //  get id of item
    // `https://api.spoonacular.com/food/products/${id}?apiKey=5565c2ccd2f1482e830f5b68bef337de`
    //  estimatedCost.value
    // set state of new list with item: price
  };
  _ItemModal = pram => {
    // console.log(this.state.ItemList);
    this.setState({ Updatedtext: pram.item });
    this.setState({ EditItem: pram.item });
    this.ShowModalFunction();
  };
  _handleListChange = pram => {
    this.setState({ ItemList: pram });
  };
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  PriceItems = items => {
    // console.log(item);
    var xhr = new XMLHttpRequest();

    var ingredientList = "";
    items.forEach(item => {
      ingredientList += encodeURIComponent(item.trim()) + "\n";
    });
    var data = `ingredientList=${ingredientList}&servings=6`;
    // console.log(data);

    xhr.withCredentials = true;

    xhr.onload = loadComplete = () => {
      var response = JSON.parse(xhr.responseText);
      response.forEach(item => {
        var obj = {};
        var key = JSON.stringify(item.originalName);
        if (item.estimatedCost !== undefined) {
          key = key.substring(1, key.length - 1);
          obj[key] = JSON.stringify(item.estimatedCost.value) / 100;
          this.state.ItemPrice.push(obj);
          // this.state.ItemPrice.push(
          //   JSON.stringify(item.estimatedCost.value) / 100
          // );
        } else {
          key = key.substring(1, key.length - 1);
          obj[key] = " ";
          this.state.ItemPrice.push(obj);
        }
      });
      // console.log(this.state.ItemPrice[0]);
      // console.log(JSON.stringify(this.state.ItemPrice)["tuna"]);
      this.setState({ state: this.state });
      // return JSON.parse(xhr.responseText);
    };

    xhr.open(
      "POST",
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/parseIngredients"
    );
    xhr.setRequestHeader(
      "x-rapidapi-host",
      "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    );
    xhr.setRequestHeader(
      "x-rapidapi-key",
      "22565bcaa7msh7b316a0ef99472ap164e6cjsn2841a03ec9cd"
    );
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    xhr.send(data);
  };
  componentDidMount() {
    const { navigation } = this.props;
    let ListName = this.props.navigation.getParam("name", "List 1");
    // console.log("props ");
    // console.log(ListName);
    if (ListName.item != undefined) {
      // console.log(ListName.item)
      ListName = ListName.item
    }
    this.setState({
      ListName: ListName
    });
    this.focusListener = navigation.addListener("didFocus", () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          // console.log("state ");
          console.log(this.state.ListName);
          this._getList();
        }
      });
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <Button
          onPress={() => {
            this.props.navigation.navigate(
              "App",
              {},
              this.props.navigation.navigate({ routeName: "ListSelection" })
            );
          }}
          title="Change List"
          color="#841584"
          accessibilityLabel="Change List"
        ></Button>
        <TextInput
          style={styles.searchBar}
          // onChangeText={this.searchedAdresses}
          onChangeText={text => {
            this.searchedAdresses(text);
            this.setState({ text });
          }}
          value={this.state.text}
          clearTextOnFocus={true}
        />
        <FlatList
          data={this.state.searchedAdresses}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Button
                onPress={() => {
                  var temp = item;
                  this.setState({ text: temp });
                  this._getInput(temp);
                  this._getList();
                }}
                title={item}
                accessibilityLabel={item}
              ></Button>
            </View>
          )}
          keyExtractor={item => item}
        />
        <Button
          onPress={() => {
            this._getInput(this.state.text);
            this._getList();
          }}
          title="Enter"
          color="#841584"
          accessibilityLabel="Enter"
        />
        <View>
          {this.state.ItemList.map((item, key) => (
            <Button
              onPress={() => this._ItemModal({ item })}
              title={`${item} ${
                JSON.stringify(this.state.ItemPrice[key]) !== undefined
                  ? " - " + this.state.ItemPrice[item]
                  : ""
              }`}
              key={key}
              style={styles.ListItem}
            ></Button>
          ))}
        </View>
        <Modal
          transparent={false}
          animationType={"slide"}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.ModalInsideView}>
              <TextInput
                style={styles.searchBar}
                onChangeText={text => this.setState({ Updatedtext: text })}
                value={this.state.Updatedtext}
                clearTextOnFocus={false}
                // returnKeyType="go"
              />
              <Button
                onPress={() => {
                  this._editItem(this.state.EditItem, this.state.Updatedtext);
                  this._getList();
                  this.setState({ EditItem: "" });
                  this.setState({ Updatedtext: "" });
                }}
                title="Update"
                style={styles.ListItem}
              >
                Update
              </Button>
              <Button
                onPress={() => {
                  this._deleteItem(this.state.EditItem);
                  this._getList();
                }}
                title="Delete"
                style={styles.ListItem}
              >
                Delete
              </Button>
              <Button
                title="Click Here To Hide Modal"
                onPress={() => {
                  this.ShowModalFunction(false);
                }}
              />
            </View>
          </ScrollView>
        </Modal>
      </ScrollView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  searchBar: {
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
  ListItem: {
    width: "90%",
    // marginLeft: 20,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 10
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

  TextStyle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
    padding: 20,
    textAlign: "center"
  }
});

export default HomeScreen;
