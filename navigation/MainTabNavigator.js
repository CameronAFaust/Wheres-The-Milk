import React from "react";
import { Platform } from "react-native";
import {
  // SwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/List";
import mapScreen from "../screens/map";
import ProfileScreen from "../screens/Profile";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home", //Text for the nav
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused} //changes the color if on that page
      name={Platform.OS === "ios" ? `ios-list` : "md-list"}
    />
  )
};

HomeStack.path = "";

const MapStack = createStackNavigator(
  {
    Map: mapScreen
  },
  config
);

MapStack.navigationOptions = {
  tabBarLabel: "Map",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-map" : "md-map"}
    />
  )
};

MapStack.path = "";

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-person" : "md-person"}
    />
  )
};

ProfileStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  MapStack,
  ProfileStack,
});

tabNavigator.path = "";

export default tabNavigator;
