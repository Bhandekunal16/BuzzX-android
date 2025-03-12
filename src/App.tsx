import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { RootStack } from "./navigation";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from '../theme.json';

export default function App() {
  return (
    <>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ApplicationProvider>
    </>

  );
}