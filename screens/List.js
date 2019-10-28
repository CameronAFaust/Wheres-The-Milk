import React, { Component } from "react";
import { withNavigationFocus, Keyboard } from "react-navigation";
import Autocomplete from "react-native-autocomplete-input";
import { Button, ThemeProvider } from "react-native-elements";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  // Button,
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
      ListName: "",
      favoritesModalStatus: false,
      favoritesList: [],
      hideAuto: false
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
    var ListName = this.state.ListName;
    var userId = firebase.auth().currentUser.uid;
    var usersList;
    var docRef = db.collection("users").doc(userId);
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
    SelectedList = this.state.ListName;
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
    SelectedList = this.state.ListName;
    if (firebase.auth().currentUser != null) {
      var userId = firebase.auth().currentUser.uid;
      var docRef = db
        .collection("users")
        .doc(userId)
        .set(
          {
            Lists: {
              [SelectedList]: firebase.firestore.FieldValue.arrayRemove(
                original
              )
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
    SelectedList = this.state.ListName;
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
  // get item name, show edit item modal
  _ItemModal = pram => {
    // console.log(this.state.ItemList);
    this.setState({ Updatedtext: pram.item });
    this.setState({ EditItem: pram.item });
    this.ShowModalFunction();
  };
  // save item users favorite item list
  _saveToFavorites = item => {
    var userId = firebase.auth().currentUser.uid;
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .set(
        {
          Lists: {
            Favorites: firebase.firestore.FieldValue.arrayUnion(item)
          }
        },
        { merge: true }
      );
  };
  _getFavoritesList = () => {
    var userId = firebase.auth().currentUser.uid;
    var docRef = db.collection("users").doc(userId);
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          usersList = [];
          user = doc.data();
          for (var key in user.Lists) {
            console.log(key);
            if (key == "Favorites") {
              user.Lists[key].forEach(item => {
                usersList.push(item);
              });
              break;
            }
          }
        }
      })
      .then(() => {
        this.setState({ favoritesList: usersList });
      });
  };
  _handleListChange = pram => {
    this.setState({ ItemList: pram });
  };
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  ShowFavModal(visible) {
    this.setState({ favoritesModalStatus: visible });
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
      ListName = ListName.item;
    }
    this.setState({
      ListName: ListName
    });
    this.focusListener = navigation.addListener("didFocus", () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          this._getList();
          this._getFavoritesList();
        }
      });
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <ThemeProvider theme={theme}>
          <Button
            onPress={() => {
              this.props.navigation.navigate(
                "App",
                {},
                this.props.navigation.navigate({ routeName: "ListSelection" })
              );
            }}
            title={this.state.ListName}
            // rightIcon={{ name: "code" }}
            icon={{
              name: "keyboard-arrow-down",
              size: 15,
              color: "white"
            }}
            accessibilityLabel="Change List"
          />
        </ThemeProvider>
        <View style={styles.Search}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            data={this.state.CompleteData}
            value={this.state.text}
            hideResults={this.state.hideAuto}
            onChangeText={text => {
              this.setState({ text: text });
              this.GetAuto(text);
              this.setState({ hideAuto: false });
            }}
            placeholder="Enter"
            renderItem={({ item, key }) => (
              <Button
                onPress={() => {
                  var temp = item.name;
                  // this.setState({ text: temp });
                  this.setState({ hideAuto: true });
                  this.setState({ text: "" });
                  this._getInput(temp);
                  this._getList();
                }}
                key={key}
                style={styles.onTop}
                title={item.name}
                accessibilityLabel={item.name}
              ></Button>
            )}
          />
          <Button
            onPress={() => {
              this._getInput(this.state.text);
              this._getList();
            }}
            title="Enter"
            color="#b2d2dd"
            accessibilityLabel="Enter"
            style={styles.searchEnter}
          />
        </View>
        <View style={styles.onbottom}>
          <Button
            style={styles.addFavorites}
            onPress={() => {
              this._getFavoritesList();
              this.ShowFavModal(true);
            }}
            title="Add from Favorites"
            accessibilityLabel="Add from Favorites"
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
        </View>
        <Modal
          transparent={true}
          animationType="none"
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <TouchableOpacity
            style={styles.modalBack}
            activeOpacity={0}
            onPressOut={() => {
              // this.ShowModalFunction(false);
              this.ShowModalFunction(false);
            }}
          >
            <ScrollView
              style={styles.itemModal}
              keyboardShouldPersistTaps="always"
              // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <View style={styles.ModalInsideView}>
                <Button
                  onPress={() => {
                    this._saveToFavorites(this.state.EditItem);
                  }}
                  icon={{
                    name: "star",
                    size: 15,
                    color: "white"
                  }}
                  // title="Add item to Favorites"
                  style={styles.favoriteListItem}
                />
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
                  style={styles.ModalListItem}
                />
                <Button
                  onPress={() => {
                    this._deleteItem(this.state.EditItem);
                    this._getList();
                  }}
                  title="Delete"
                  style={styles.ModalListItem}
                />
                <Button
                  title="Close"
                  onPress={() => {
                    this.ShowModalFunction(false);
                  }}
                />
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
        <Modal
          transparent={true}
          animationType={"slide"}
          visible={this.state.favoritesModalStatus}
          onRequestClose={() => {
            this.ShowFavModal(!this.state.favoritesModalStatus);
          }}
        >
          <TouchableOpacity
            style={styles.modalBack}
            activeOpacity={0}
            onPressOut={() => {
              // this.ShowModalFunction(false);
              this.ShowModalFunction(false);
            }}
          >
            <ScrollView
              style={styles.ModalInsideView}
              keyboardShouldPersistTaps="always"
            >
              <Button
                title="Back"
                onPress={() => {
                  this.ShowFavModal(false);
                }}
              />
              <FlatList
                data={this.state.favoritesList}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Button
                      onPress={() => {
                        this._getInput(item);
                        // this.ShowFavModal(false);
                      }}
                      title={item}
                      accessibilityLabel={item}
                    />
                  </View>
                )}
                keyExtractor={item => item}
              />
            </ScrollView>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const theme = {
  Button: {
    buttonStyle: {
      width: 200,
      alignSelf: "center",
      // backgroundColor: ""
      backgroundColor: "#132640"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    // flex: 1,
    backgroundColor: "#132640"
  },
  Search: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 10
  },
  autocompleteContainer: {
    flex: 3,
    zIndex: 10
  },
  searchEnter: {
    flex: 2,
    alignSelf: "center"
    // backgroundColor: "#b2d2dd"
  },
  onbottom: {
    zIndex: -1,
    marginLeft: 20,
    marginRight: 20
  },
  addFavorites: {
    marginBottom: 10
  },
  ListItem: {
    width: "90%",
    // marginLeft: 20,
    // padding: 15,
    borderColor: "#d6d7da",
    backgroundColor: "#132640",
    alignSelf: "center",
    marginBottom: 5
  },
  itemModal: {
    backgroundColor: "rgba(100,100,100, 0.8)"
  },
  ModalInsideView: {
    margin: 15,
    marginTop: "35%",
    backgroundColor: "#b2d2dd",
    height: 300,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "column"
  },
  modalBack: {
    height: "100%",
    backgroundColor: "rgba(100,100,100, 0)"
  },
  searchBar: {
    width: "80%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center"
    // marginTop: 10
  },
  ModalListItem: {
    width: "70%",
    alignSelf: "center",
    marginBottom: 5
  },
  favoriteListItem: {
    top: 10,
    left: 10,
    width: 40,
    marginBottom: 15
  }
});

export default HomeScreen;
