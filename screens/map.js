import React, { Component } from "react";
import { Button, ThemeProvider } from "react-native-elements";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  // Button,
  Text,
  TouchableOpacity,
  SectionList,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar
} from "react-native";
import Canvas, { Image as CanvasImage } from "react-native-canvas";
import Display from "react-native-display";
import { getStatusBarHeight } from "react-native-status-bar-height";

require("firebase/firestore");
const firebase = require("firebase");
const db = firebase.firestore();

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgID:
        "https://firebasestorage.googleapis.com/v0/b/wheresthemilk-816ca.appspot.com/o/SmithsLayout.jpg?alt=media&token=1d2f0027-2bc2-464f-9122-a8f4919f0e2b",
      storeDetails: [],
      imgdata: "",
      access_token: "",
      LocationModal: true,
      userZipCode: "",
      isleList: [],
      allItemsList: [],
      AllStores: [],
      ItemData: [],
      ItemList: []
    };
  }
  handleCanvas = () => {
    canvas = this.refs.canvas;
    var { height, width } = Dimensions.get("window");
    canvas.width = width;
    canvas.height = height / 2;

    const image = new CanvasImage(canvas);
    var imgWidth = 0;
    var imgHeight = 0;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    Image.getSize(this.state.imgID, (width, height) => {
      imgWidth = width / 3;
      imgHeight = height / 3;
      image.crossOrigin = "anonymous";
      image.src = this.state.imgID;
    });

    image.addEventListener("load", () => {
      context.drawImage(image, 0, 0, imgWidth, imgHeight);
      var onTop = true;
      // if(UsersList has vegetables) {
      // x = this.state.storeDetails.vegetables[0];
      // y = this.state.storeDetails.vegetables[0];
      // } else {
      x = this.state.storeDetails.start[0] / 3;
      y = this.state.storeDetails.start[1] / 3;
      // }
      IsleDistance = this.state.storeDetails.IsleDistance / 3;
      IsleLength = this.state.storeDetails.IsleLength / 3;
      context.beginPath();
      context.moveTo(x, y);
      islesCount = 17   ;
      j = 0;
      // isDone = false;
      // console.log(this.state.isleList);
      for (let i = 1; i < islesCount; i++) {
        // console.log(this.state.isleList[j].title + " == " + i)
        // console.log(this.state.isleList[j].title ==  i)
        if (this.state.isleList[j].title == i) {
          // go down isle
          if (onTop) {
            context.lineTo(x, y + IsleLength);
            y = y + IsleLength;
          } else {
            context.lineTo(x, y - IsleLength);
            y = y - IsleLength;
          }
          context.stroke();
          onTop = !onTop;
          if (j + 1 != this.state.isleList.length) {
            j++;
          } else {
            break;
          }
        } else {
          // go to next isle
          context.lineTo(x + IsleDistance, y);
          context.stroke();
          x = x + IsleDistance;
        }
      }
      var dataURL = canvas.toDataURL().then(data => {
        this.setState({ imgdata: data });
      });
    });
  };
  getZipcode = () => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = loadComplete = () => {
      if (xhr.readyState === 4) {
        temp = [];
        JSON.parse(xhr.responseText).data.forEach(item => {
          temp.push({
            name: item.name,
            locationID: item.locationId
          });
        });
        this.setState({ AllStores: temp });
      }
    };

    xhr.open(
      "GET",
      `https://api.kroger.com/v1/locations?filter.zipCode.near=${this.state.userZipCode}&filter.radiusInMiles=10&filter.limit=10&filter.chain=SMITHS`
    );
    xhr.setRequestHeader("Authorization", `Bearer ${this.state.access_token}`);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Host", "api.kroger.com");
    xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
    xhr.setRequestHeader("Connection", "keep-alive");
    xhr.setRequestHeader("cache-control", "no-cache");
    var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
    if (zipCodePattern.test(this.state.userZipCode)) {
      xhr.send();
    } else {
      // Error handling here
    }
  };
  getPhoneLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // this.setState({ userLat: position.coords.latitude });
        // this.setState({ userLong: position.coords.longitude });
        this.getLatLong(position.coords.latitude, position.coords.longitude);
      },
      error => {
        alert(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000
      }
    );
  };
  getLatLong = (lat, long) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = loadComplete = () => {
      if (xhr.readyState === 4) {
        temp = [];
        JSON.parse(xhr.responseText).data.forEach(item => {
          temp.push({
            name: item.name,
            locationID: item.locationId
          });
        });
        this.setState({ AllStores: temp });
      }
    };

    xhr.open(
      "GET",
      `https://api.kroger.com/v1/locations?filter.latLong.near=${lat},${long}&filter.radiusInMiles=10&filter.limit=10&filter.chain=SMITHS`
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
  getMapData() {
    // from firebase
    // get distance between each isle
    // get starting point
    // vegetables
    // bottom section?
    // set to state
    this.setState({
      storeDetails: {
        IsleDistance: 65,
        IsleLength: 345,
        vegetables: [40, 40],
        start: [170, 380]
      }
    });
  }
  getItemData = (item, locationId) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = loadComplete = () => {
      if (xhr.readyState === 4) {
        if (
          typeof JSON.parse(xhr.responseText).data[0].aisleLocations[0] ==
          "undefined"
        ) {
          //add to list of items with no isle
          this.state.ItemData.push({
            name: item,
            isle: "none",
            cost: JSON.parse(xhr.responseText).data[0].items[0].price.regular
          });
        } else if (
          typeof JSON.parse(xhr.responseText).data[0].items[0].price ==
          "undefined"
        ) {
          //push [name: item, isleNumber: number, cost: price]
          if (
            JSON.parse(xhr.responseText).data[0].aisleLocations[0].number < 1 ||
            JSON.parse(xhr.responseText).data[0].aisleLocations[0].number > 30
          ) {
            this.state.ItemData.push({
              name: item,
              isle: JSON.parse(xhr.responseText).data[0].aisleLocations[0]
                .description,
              cost: ""
            });
          } else {
            this.state.ItemData.push({
              name: item,
              isle: JSON.parse(xhr.responseText).data[0].aisleLocations[0]
                .number,
              cost: ""
            });
          }
        } else {
          if (
            JSON.parse(xhr.responseText).data[0].aisleLocations[0].number < 1 ||
            JSON.parse(xhr.responseText).data[0].aisleLocations[0].number > 30
          ) {
            this.state.ItemData.push({
              name: item,
              isle: JSON.parse(xhr.responseText).data[0].aisleLocations[0]
                .description,
              cost: JSON.parse(
                xhr.responseText
              ).data[0].items[0].price.regular.toFixed(2)
            });
          } else {
            this.state.ItemData.push({
              name: item,
              isle: JSON.parse(xhr.responseText).data[0].aisleLocations[0]
                .number,
              cost: JSON.parse(
                xhr.responseText
              ).data[0].items[0].price.regular.toFixed(2)
            });
          }
        }
        if (this.state.ItemData.length == this.state.ItemList.length) {
          this.getListData();
        }
      }
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
  getList() {
    var ListName = global.SelectedList;
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
        this.setState({ ItemList: usersList });
        usersList.forEach(item => {
          this.getItemData(item, "70600094");
        });
      });
  }
  getListData() {
    var CatList = [
      {
        title: "Loading",
        data: ["Loading"]
      }
    ];
    nonIsleNum = [];
    IsleNum = [];
    CatList = [];
    this.state.ItemData.forEach(item => {
      var found = false;
      var name = item.name;
      if (item.cost != "") {
        name = item.name;
      }
      for (var i = 0; i < CatList.length; i++) {
        if (CatList[i].title != undefined && CatList[i].title == item.isle) {
          //found item cat, add to that cat
          CatList[i].data.push(name);
          if (!isNaN(parseInt(item.isle))) {
            IsleNum.forEach(itemObj => {
              if (itemObj.title == item.isle) {
                itemObj.data.push(name);
              }
            });
          } else {
            // nonIsleNum[i].data.push(name);
            nonIsleNum.forEach(itemObj => {
              if (itemObj.title == item.isle) {
                itemObj.data.push(name);
              }
            });
          }
          found = true;
          break;
        }
      }
      if (!found) {
        if (!isNaN(parseInt(item.isle))) {
          this.state.isleList.push(item.isle);
          IsleNum.push({
            title: item.isle,
            data: [name]
          });
        } else {
          nonIsleNum.push({
            title: item.isle,
            data: [name]
          });
        }
        CatList.push({
          title: item.isle,
          data: [name]
        });
      }
    });
    let temp = IsleNum.sort(function(a, b) {
      return a.title - b.title;
    });
    this.setState({
      allItemsList: temp.concat(nonIsleNum)
    });
    this.setState({
      isleList: temp
    });

    this.getMapData();
    this.setState(
      {
        imgID:
          "https://firebasestorage.googleapis.com/v0/b/wheresthemilk-816ca.appspot.com/o/SmithsLayout.jpg?alt=media&token=1d2f0027-2bc2-464f-9122-a8f4919f0e2b"
      },
      () => {
        this.handleCanvas();
      }
    );
    this.setState({ showMap: "flex" });
    this.setState({ showModal: "none" });
  }
  // DROP DOWN FOR DIFFERENT STORES
  // OR ONLY LET KROGER/SMITHS
  render() {
    return (
      <View style={styles.container}>
        <Display enable={this.state.LocationModal}>
          <View style={styles.insideModal}>
            <Text style={styles.HeaderText}>Pick Store</Text>
            <Text style={styles.InputLabel}>Search by zip code</Text>
            <TextInput
              style={styles.zipCode}
              // autoFocus={true}
              placeholder="Search by zipcode"
              keyboardType="number-pad"
              onChangeText={text => this.setState({ userZipCode: text })}
            />
            <Button
              onPress={() => {
                getCreds.then(res => {
                  this.setState({
                    access_token: res
                  });
                  this.getZipcode(this.state.userZipCode);
                });
              }}
              style={styles.getUserLocation}
              title="Search for zip code"
            />
            <Button
              onPress={() => {
                getCreds.then(res => {
                  this.setState({
                    access_token: res
                  });
                  this.getPhoneLocation();
                });
              }}
              style={styles.getUserLocation}
              title="Use phone location"
            />
            <ScrollView style={styles.LocationList}>
              {this.state.AllStores.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0}
                  key={item.locationID}
                  onPress={() => {
                    this.setState({ LocationModal: false });
                    this.getList();
                  }}
                  keyExtractor={item => item}
                >
                  <Text style={styles.locationItem}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Display>
        <Display enable={!this.state.LocationModal}>
          <View>
            <View style={styles.mapView}>
              <View style={styles.mapCanvas}>
                <Canvas ref="canvas" />
              </View>
              {/* <View style={styles.listView}> */}
              <ScrollView style={styles.listView}>
                <SectionList
                  sections={this.state.allItemsList}
                  renderItem={({ item }) => (
                    <Text style={styles.item}>{item}</Text>
                  )}
                  renderSectionHeader={({ section }) => {
                    {
                      if (
                        parseInt(section.title) > 1 &&
                        parseInt(section.title) < 30
                      ) {
                        return (
                          <Text style={styles.sectionHeader}>
                            Isle {section.title}{" "}
                          </Text>
                        );
                      } else {
                        return (
                          <Text style={styles.sectionHeader}>
                            {section.title}
                          </Text>
                        );
                      }
                    }
                  }}
                  keyExtractor={title => title}
                />
              </ScrollView>
              {/* </View> */}
            </View>
          </View>
        </Display>
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

MapScreen.navigationOptions = {
  header: null
};

const theme = {
  Button: {
    buttonStyle: {
      width: "80%",
      alignSelf: "center",
      margin: 10,
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
  mapView: {},
  // mapCanvas: { height: "40%" },
  listView: {
    zIndex: -1,
    marginBottom: 50,
    height: "40%"
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 20,
    // paddingRight: 10,
    width: "100%",
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  item: {
    color: "white",
    width: "90%",
    fontSize: 16,
    padding: 5,
    borderColor: "#d6d7da",
    backgroundColor: "#132640",
    alignSelf: "center",
    marginBottom: 5
  },
  insideModal: {
    alignSelf: "center",
    width: "90%",
    margin: 10,
    backgroundColor: "#b2d2dd",
    height: "95%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "column"
  },
  HeaderText: { alignSelf: "center", fontSize: 25, margin: 10 },
  InputLabel: { alignSelf: "center", fontSize: 15, margin: 5 },
  zipCode: {
    width: "80%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fff",
    alignSelf: "center"
  },
  getUserLocation: { margin: 5 },
  LocationList: {},
  locationItem: {
    width: "90%",
    borderColor: "#d6d7da",
    backgroundColor: "#80afc2",
    alignSelf: "center",
    margin: 3,
    // color: "#FFF",
    borderRadius: 4,
    borderWidth: 0.5,
    // borderColor: "#d6d7da",
    // backgroundColor: "#132640",
    // alignSelf: "center",
    padding: 10,
    // marginBottom: 5
  }
});

export default MapScreen;
