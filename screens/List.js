import React, { Component } from "react";
import {
  withNavigationFocus,
  Keyboard,
  NavigationEvents
} from "react-navigation";
import Autocomplete from "react-native-autocomplete-input";
import { Button, ThemeProvider } from "react-native-elements";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  SectionList,
  StatusBar
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

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
      userid: "",
      EditItem: "",
      Updatedtext: "",
      SelectedList: "",
      ListName: "",
      access_token: "",
      totalPrice: "",
      ModalVisibleStatus: false,
      hideAuto: false,
      favoritesModalStatus: false,
      firstLoad: false,
      ItemList: [],
      searchedAdresses: [],
      CompleteData: [],
      favoritesList: [],
      catigoriesList: [],
      ItemData: []
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
      .catch(function(error) {})
      .then(() => {
        this.setState({ ItemData: [] });
        this.setState({ ListName: ListName });
        this.setState({ ItemList: usersList });
        // this.getCategory();
      })
      .then(() => {
        usersList.forEach(item => {
          this.getItemData(item, "70600094");
        });
      });
  };
  // add item to list
  _getInput(item) {
    SelectedList = this.state.ListName;
    var regex = new RegExp(this.state.ItemList.join("|"), "i");

    if (item == "") {
      alert("Please type in a word");
    } else if (!regex.test(item) || this.state.ItemList.length == 0) {
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
    var index = this.state.catigoriesList.indexOf(original);
    if (index > -1) {
      this.state.catigoriesList.splice(index, 1);
    }
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
    var index = this.state.ItemList.indexOf(item);
    if (index > -1) {
      this.state.ItemList.splice(index, 1);
    }
    this.ShowModalFunction(false);
  }
  // get item name, show edit item modal
  _ItemModal = pram => {
    var itemArray = pram.item.split("-")[0].trim();
    this.setState({ Updatedtext: itemArray });
    this.setState({ EditItem: itemArray });
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
  getCategory = () => {
    // get list
    var List = this.state.ItemData;
    var total = 0;
    var CatList = [
      {
        title: "Loading",
        data: ["Loading"]
      }
    ];
    if (List.length == this.state.ItemList.length) {
      CatList = [];
      List.forEach(item => {
        var found = false;
        var name = item.name;
        if (item.cost != "") {
          total += parseFloat(item.cost);
          name = item.name + " - $" + item.cost;
        }
        for (var i = 0; i < CatList.length; i++) {
          if (
            CatList[i].title != undefined &&
            CatList[i].title == item.category
          ) {
            //found item cat, add to that cat
            CatList[i].data.push(name);
            found = true;
            break;
          }
        }
        if (!found) {
          CatList.push({
            title: item.category,
            data: [name]
          });
        }
      });
      // set each item with its isle number / location
      if (total != 0) {
        this.setState({
          totalPrice: parseFloat(total).toFixed(2)
        });
      } else {
        this.setState({ totalPrice: 0 });
      }
    }
    this.setState({ catigoriesList: CatList });
  };
  // use this instead of go through all of them, ??
  addCategry = () => {
    var found = false;
    for (var i = 0; i < CatList.length; i++) {
      if (CatList[i].title != undefined && CatList[i].title == item.category) {
        //found item cat, add to that cat
        CatList[i].data.push(item.name);
        found = true;
        break;
      }
    }
    if (!found) {
      CatList.push({ title: item.category, data: [item.name] });
    }
  };
  getItemData = (item, locationId) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = loadComplete = () => {
      if (xhr.readyState === 4) {
        if (JSON.parse(xhr.responseText).data[0].categories[0] == "undifined") {
          //add to list of items with no isle
          this.state.ItemData.push({
            name: item,
            category: "none",
            cost: JSON.parse(
              xhr.responseText
            ).data[0].items[0].price.regular.toFixed(2)
          });
        } else if (
          typeof JSON.parse(xhr.responseText).data[0].items[0].price ==
          "undefined"
        ) {
          //push [name: item, isleNumber: number, cost: price]
          this.state.ItemData.push({
            name: item,
            category: JSON.parse(xhr.responseText).data[0].categories[0],
            cost: ""
          });
        } else {
          this.state.ItemData.push({
            name: item,
            category: JSON.parse(xhr.responseText).data[0].categories[0],
            cost: JSON.parse(
              xhr.responseText
            ).data[0].items[0].price.regular.toFixed(2)
          });
        }
      }
      this.getCategory();
    };

    xhr.open(
      "GET",
      `https://api.kroger.com/v1/products?filter.term=${item}&filter.locationId=${locationId}&filter.limit=1`
    );
    xhr.setRequestHeader("Authorization", `Bearer ${this.state.access_token}`);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Host", "api.kroger.com");
    xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
    xhr.setRequestHeader("Connection", "keep-alive");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send();
  };
  didRender = () => {
    console.log("he");
  };
  componentDidMount() {
    // const { navigation } = this.props;
    // global.SelectedList = ListName;
    this.setState({ firstLoad: true });
    let ListName = "";
    if (global.SelectedList == undefined) {
      ListName = this.props.navigation.getParam("name", "List 1");
    } else {
      ListName = global.SelectedList;
    }
    global.SelectedList = ListName;
    // console.log(ListName);
    this.setState({ ListName: ListName });
    getCreds.then(res => {
      this.setState({
        access_token: res
      });
      // console.log(firebase.auth().currentUser);
      // if (firebase.auth().currentUser != null) {
      console.log("here");
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var userId = firebase.auth().currentUser.uid;
          this.setState({ userId: userId });
          this._getList();
          this._getFavoritesList();
          this.getCategory();
        }
      });
      // } else {
      // console.log("not loged in");
      // this.props.navigation.navigate(
      //   "App",
      //   {},
      //   this.props.navigation.navigate({ routeName: "Profile" })
      // );
      // }
    });
  }
  render() {
    return (
      <View style={styles.container} keyboardShouldPersistTaps="always">
        {/* <NavigationEvents
          onDidFocus={() => {
            if (!this.state.firstLoad) {
              this.componentDidMount();
              console.log(!this.state.firstLoad)
            }
            this.setState({ firstLoad: false });
          }}
        /> */}
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
            style={styles.changeList}
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
            keyExtractor={(item, key) => item.name.toString()}
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
                style={styles.onTop}
                title={item.name}
                accessibilityLabel={item.name}
              />
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
        <ScrollView style={styles.onbottom}>
          <Button
            style={styles.addFavorites}
            onPress={() => {
              this._getFavoritesList();
              this.ShowFavModal(true);
            }}
            title="Add from Favorites"
            accessibilityLabel="Add from Favorites"
          />
          <SectionList
            sections={this.state.catigoriesList}
            renderItem={({ item }) => (
              <Button
                onPress={() => this._ItemModal({ item })}
                title={`${item}`}
                style={styles.ListItem}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={title => title}
          />
        </ScrollView>
        <View style={styles.totalPriceView}>
          <Text style={styles.totalPriceText}>
            Total: ${this.state.totalPrice}
          </Text>
        </View>
        {/* Item Modal */}
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
            <View style={styles.itemModal} keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback>
                <View style={styles.ModalInsideView}>
                  <Button
                    onPress={() => {
                      this._saveToFavorites(this.state.EditItem);
                    }}
                    title="Add to favorites"
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
                      this._editItem(
                        this.state.EditItem,
                        this.state.Updatedtext
                      );
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
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Favorites Modal */}
        <Modal
          transparent={true}
          animationType={"none"}
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
              this.ShowFavModal(false);
            }}
          >
            <View style={styles.itemModal} keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback>
                <View style={styles.ModalInsideView}>
                  <Button
                    style={styles.backButton}
                    title="Back"
                    onPress={() => {
                      this.ShowFavModal(false);
                    }}
                  />
                  <Text style={styles.FavoritesText}>Favorites</Text>
                  <FlatList
                    data={this.state.favoritesList}
                    renderItem={({ item }) => (
                      <View style={styles.ModalListItem}>
                        <Button
                          onPress={() => {
                            this._getInput(item);
                            this.ShowFavModal(false);
                            this._getList();
                          }}
                          title={item}
                          accessibilityLabel={item}
                        />
                      </View>
                    )}
                    keyExtractor={item => item}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

var getCreds = new Promise(function(resolve, reject) {
  data = "grant_type=client_credentials&scope=product.compact";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.onload = loadComplete = () => {
    if (xhr.readyState === 4) {
      resolve(JSON.parse(xhr.responseText).access_token);
    }
  };

  xhr.open("POST", "https://api.kroger.com/v1/connect/oauth2/token");
  xhr.setRequestHeader(
    "Authorization",
    "Basic d2hlcmVzLXRoZS1taWxrLWViYTFjMWI1ZTUzOGZlNjlmN2Y0ODM2ZmRjZmQzNWUzOnFYdWttS0ZWUzhTZFp3TG5RN3FEQ3p1TGNLTWdvcmc3"
  );
  xhr.setRequestHeader("Accept", "*/*");
  xhr.setRequestHeader("Cache-Control", "no-cache");
  xhr.setRequestHeader("Host", "api.kroger.com");
  xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
  xhr.setRequestHeader("Connection", "keep-alive");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);
});

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
    paddingTop: getStatusBarHeight(),
    // flex: 1,
    height: "100%",
    backgroundColor: "#132640"
  },
  // changeList: {
  //   backgroundColor: "#d6d7da"
  // },
  Search: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 10
  },
  searchBar: {
    width: "80%",
    height: 60,
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center"
    // marginTop: 10
  },
  searchEnter: {
    marginLeft: 2,
    paddingTop: 1
  },
  autocompleteContainer: {
    flex: 3,
    zIndex: 10
    // height: 50,
  },
  onbottom: {
    zIndex: -1,
    marginLeft: 20,
    marginRight: 20
  },
  addFavorites: {
    marginBottom: 5
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    margin: 3,
    // marginBottom: 3,
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  ListItem: {
    width: "90%",
    // marginLeft: 20,
    // padding: 15,
    borderColor: "#d6d7da",
    backgroundColor: "#132640",
    alignSelf: "center",
    margin: 3
  },
  totalPriceView: {
    justifyContent: "flex-end",
    margin: 5
  },
  totalPriceText: {
    fontSize: 18,
    color: "#FFF"
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
    backgroundColor: "rgba(100,100,100, 0.8)"
  },
  ModalListItem: {
    width: "70%",
    alignSelf: "center",
    marginBottom: 5
  },
  favoriteListItem: {
    top: 10,
    left: 10,
    width: "70%",
    alignSelf: "center",

    // width: 40,
    marginBottom: 25
  },
  backButton: {
    width: "20%",
    margin: 5,
    marginBottom: 10
  },
  FavoritesText: {
    alignSelf: "center",
    fontSize: 20,
    marginBottom: 10
  }
});

export default HomeScreen;
