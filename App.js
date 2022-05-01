import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
import Schedule from "./Screens/Schedule";
import Calendar from "./Screens/Calendar";
import SettingsView from "./Screens/Settings";
import "./global.js";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={({ navigation }) => ({
            headerTitle: "Dashboard",
            headerRight: () => (
              <Button
                title="Settings"
                onPress={() => {
                  navigation.navigate("SettingsView");
                }}
              />
            ),
          })}
        />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="SettingsView" component={SettingsView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00ffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default App;