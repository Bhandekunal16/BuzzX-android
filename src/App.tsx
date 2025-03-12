import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { RootStack } from "./navigation";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

export default function App() {
  return (
    <>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ApplicationProvider>
    </>

  );
}