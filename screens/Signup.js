import React from 'react'
import {StyleSheet} from 'react-native'
require("firebase/firestore");
const firebase = require("firebase");

firebase.initializeApp({
    apiKey: "AIzaSyBp5DHO2pXerW_HYQCklL5X286qqCrrH1U",
    authDomain: "wheresthemilk-816ca.firebaseapp.com",
    projectId: "wheresthemilk-816ca",
    databaseURL: "https://wheresthemilk-816ca.firebaseio.com"
});

const db = firebase.firestore()

class Signup extends React.Component {
    state = {
        email: '',
        password: ''
    }

    _signup = () => {
        try {
            const response = firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            userData = firebase.auth().currentUser;
            var products = [
                "paper airplanes",
                "tooth picks"
            ]
            if (userData.uid) {
                const user = {
                uid: userData.uid,
                userName: this.state.email,
                List: [{"list1" : products}, {"list2" : products}],
                total : 500
                }
                db.collection('users')
                .doc(userData.uid)
                .set(user)
            }
            });
        } catch (e) {
            alert(e)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={() => this._signup()}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#FFA611',
        borderColor: '#FFA611',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    }
})

export default Signup