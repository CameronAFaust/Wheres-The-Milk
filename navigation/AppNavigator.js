import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import Signup from "../screens/Signup";
import List from "../screens/List";
import ListSelection from "../screens/ListSelection";
const SignUpStack = createStackNavigator({Signup: Signup});
const ListStack = createStackNavigator({ListSelection: ListSelection});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    SignUp: SignUpStack,
    ListStack: ListStack,
  })
);
