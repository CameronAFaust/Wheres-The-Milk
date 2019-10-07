import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/List";
import LinksScreen from "../screens/map";
import ProfileScreen from "../screens/Login";

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
      name={
        Platform.OS === "ios"
          ? `ios-list`
          : "md-list"
      }
    />
  )
};

HomeStack.path = "";

const LinksStack = createStackNavigator(
  {
    Links: HomeScreen
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-map" : "md-map"}
    />
  )
};

LinksStack.path = "";

const SettingsStack = createStackNavigator(
  {
    Settings: ProfileScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-person" : "md-person"}
    />
  )
};

SettingsStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack
});

tabNavigator.path = "";

export default tabNavigator;
