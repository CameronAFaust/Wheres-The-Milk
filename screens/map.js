import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import Canvas, { Image as CanvasImage } from "react-native-canvas";

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgID:
        "http://www.economicmodeling.com/wp-content/uploads/temp-sticker.jpg",
      storeDetails: [],
      imgdata: ""
    };
  }
  handleCanvas = () => {
    canvas = this.refs.canvas;
    const image = new CanvasImage(canvas);
    var imgWidth = 0;
    var imgHeight = 0;
    Image.getSize(this.state.imgID, (width, height) => {
      imgWidth = width / 3;
      imgHeight = height / 3;
      canvas.width = width / 3;
      canvas.height = height / 3;
      image.crossOrigin = "anonymous";
      image.src = this.state.imgID;
    });

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

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
      // i = 0
      // UserList.forEach(item => {
      // if(item.isle == i) { // go down isle
      for (let i = 0; i < 3; i++) {
        if (onTop) {
          context.lineTo(x, y + IsleLength);
          y = y + IsleLength;
        } else {
          context.lineTo(x, y - IsleLength);
          y = y - IsleLength;
        }
        context.stroke();
        onTop = !onTop;
        // } else { // go to next isle
        context.lineTo(x + IsleDistance, y);
        context.stroke();
        x = x + IsleDistance;
      }

      var dataURL = canvas.toDataURL().then(data => {
        this.setState({ imgdata: data });
      });
      // }
      // });
      //  Start at Starting xy
      //  for each of every item
      //      if itemsIlse == 1
      //          draw line down isle (specific distence)
      //          draw line to next isle (specific distence)
      //      else
      //          draw line to next isle
    });
  };
  getCreds = () => {
    data = "grant_type=client_credentials";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(JSON.parse(this.responseText).access_token);
      }
    });

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
  };
  getLocation = (lat, long) => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(JSON.parse(this.responseText).data.locationId);
      }
    });

    xhr.open(
      "GET",
      `https://api.kroger.com/v1/locations?filter.latLong.near=${lat},${long}&filter.radiusInMiles=10&filter.limit=10&filter.chain=SMITHS`
    );
    xhr.setRequestHeader(
      "Authorization",
      "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilo0RmQzbXNrSUg4OGlydDdMQjVjNmc9PSIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InByb2R1Y3QuY29tcGFjdCIsImF1dGhBdCI6MTU3MzE1MDA2MjY2NTY4NjM3MCwiYXVkIjoid2hlcmVzLXRoZS1taWxrLWViYTFjMWI1ZTUzOGZlNjlmN2Y0ODM2ZmRjZmQzNWUzIiwiZXhwIjoxNTczMTUxODYyLCJpYXQiOjE1NzMxNTAwNTcsImlzcyI6ImFwaS5rcm9nZXIuY29tIiwic3ViIjoiODAxYzY2ZDAtY2UzNS00MjY5LTgwNDYtZDYzYTI4ZjUzY2QwIn0.o85PLq-DlidFvnzs2GmRaM_ZrRBeVkCBsz8ePk0yui2oaxBvvst2UYnAQnJvZ7XioyDsaKH3Hy3Mx7P-r3TxEIHqBl-DG5xnHBtr2NVSZlzCUkFtYkG5WD53SbS9wM-6jC3tX8VHPnMvcl-wtaY4yrc980vh9cF98vA3i74f7yQM7k6XJVXikHuUABtr7daXgizm5uH2ArcsfMust2jlIY3MrLw-sRaWsutcW9UidEPzfFn-Z3-uKgO7U30vAwohheDVikk43EvSSJzKCb4NUpupLq7bvJbrRjg11Mm_XWtRha_FisxX5lvFEI7aqhOdZD8OOU-kC7mX8QMS940m_Q"
    );
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
  componentDidMount() {
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
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mapView}>
          <Canvas ref="canvas" />
        </View>
        <View style={styles.listView}></View>
      </View>
    );
  }
}

MapScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    // flex: 1,
    height: "100%"
    // backgroundColor: "#132640"
  }
});

export default MapScreen;
