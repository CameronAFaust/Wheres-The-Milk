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

// function Item({ title }) {
//   return (
//     <View style={styles.item}>
//       <Button title={title} accessibilityLabel={title}></Button>
//     </View>
//   );
// }
function PriceItems(items) {
  // console.log(item);
  var xhr = new XMLHttpRequest();

  var ingredientList = "";
  items.forEach(item => {
    ingredientList += `${item}\n`;
  });
  var data = `ingredientList=${ingredientList}&servings=1`;
  // console.log(data);

  xhr.withCredentials = true;

  xhr.onload = loadComplete = () => {
    // console.log(JSON.parse(xhr.responseText)); //want price
    return JSON.parse(xhr.responseText);
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
}

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
      CompleteData: []
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
  _getInput(item) {
    if (!this.state.ItemList.includes(item)) {
      // console.log("does contain");
      this.setState({ ItemList: [...this.state.ItemList, item] });
      var userId = firebase.auth().currentUser.uid;
      const update = {};
      update[`${item}`] = item;
      const ref = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .set(update, { merge: true });
    } else {
      alert("Item already in list");
    }
  }
  _getList = () => {
    // console.log(this.state.userid);
    if (this.state.userid != null) {
      // var userId = firebase.auth().currentUser.uid;
      var userId = this.state.userid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name");
      var usersList;
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            usersList = [];
            user = doc.data();
            for (var key in user) {
              usersList.push(user[key]);
            }
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
        .then(() => {
          this.setState({ ItemList: usersList });
        });
    }
  };
  _getList = userid => {
    var userId = firebase.auth().currentUser.uid;
    var userId = userId;
    var docRef = db
      .collection("users")
      .doc(userId)
      .collection("Lists")
      .doc("List name");
    var usersList;
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          usersList = [];
          // priceList = [];
          user = doc.data();
          for (var key in user) {
            usersList.push(user[key]);
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
      .then(() => {
        this.setState({ ItemList: usersList });
        PriceItems(usersList);
      });
  };
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
  _handleClick = pram => {
    // console.log(this.state.ItemList);
    this.setState({ Updatedtext: pram.item });
    this.setState({ EditItem: pram.item });
    this.ShowModalFunction();
  };
  _editItem(original, Edited) {
    const update = {};
    const del = {};
    del[`${original}`] = firebase.firestore.FieldValue.delete();
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .update(del);
      update[`${Edited}`] = Edited;
      var docRef = db
        .collection("users")
        .doc(userId)
        .collection("Lists")
        .doc("List name")
        .set(update, { merge: true });
    }
    // this._getList();
    this.ShowModalFunction(false);
  }
  _deleteItem(item) {
    const update = {};
    update[`${item}`] = firebase.firestore.FieldValue.delete();
    var userId = firebase.auth().currentUser.uid;

    const ref = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("Lists")
      .doc("List name")
      .update(update);
  }
  _handleListChange = pram => {
    this.setState({ ItemList: pram });
  };
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // console.log("loaded: " + payload.state);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          this._getList(userId);
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
              onPress={() => this._handleClick({ item })}
              title={item}
              key={key}
              style={styles.ListItem}
            >
              {item} {}
            </Button>
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
                  this.ShowModalFunction(!this.state.ModalVisibleStatus);
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
