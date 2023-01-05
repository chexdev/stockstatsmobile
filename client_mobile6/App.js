import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./context/StocksContext";

export default function App() {
  return (
    //wrap all code in App that requires the StocksProvider Context to be used
    <StocksProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </StocksProvider>
  );
}
