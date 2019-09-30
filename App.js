import React, { Component } from 'react';
import { View, TextInput, Button, Alert, Text, Picker, StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: 'Useless Placeholder', 
        shotPlacement: ["here1", "here2"],
        time: '',
        dayInterval: '',
      };
  }

  _getInput() {
    console.log(this.state.text);
    this.setState({ shotPlacement: [...this.state.shotPlacement, this.state.text] })
    console.log(this.state.shotPlacement)
  }

  render() {
    return (
      <View>
        <TextInput
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
          { this.state.shotPlacement.map((item, key)=>(
            <Text key={key}> { item } </Text>)
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    // flex: 1,
    padding: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 50,
  },
});



