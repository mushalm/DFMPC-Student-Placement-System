import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  Linking,
  Alert,
} from "react-native";
import firebase from "../firebase";
import "../global.js";
import { TouchableOpacity } from "react-native-web";
import DialogInput from "react-native-dialog-input";

const Settings = () => {
  const navigation = useNavigation();
  const [name, SetName] = useState("");
  const [visible, setVisible] = useState(false);
  const changeProfilePhoto = () => {
    // TODO:
    // Take in an image from the gallery
    // Upload image to some file host and save the url
    // Set user_profile_photo image host URL
    setVisible(true);
    console.log("Button pressed. Dialog visible: " + visible);
  };

  return (
    <>
      <View style={styles.button}>
        <Image style={styles.ProfilePic} source={{ uri: authUserProfilePic }} />
      </View>
      <View style={styles.button}>
        <Button
          title="Change Profile Photo"
          onPress={changeProfilePhoto}
        ></Button>
        <DialogInput
          isDialogVisible={visible}
          title={"Change Profile Photo"}
          message={"Please paste image link"}
          hintInput={authUserProfilePic}
          submitInput={(inputText) => {
            console.log("New image link is: " + inputText);
          }}
          closeDialog={() => {
            setVisible(false);
          }}
        ></DialogInput>
      </View>
      <View style={styles.button}>
        <Button
          title="Change App Theme"
          onPress={() => {
            Alert.alert(
              "TODO:",
              "Display app theme options as dropdown. \nPlace current theme on the top."
            );
          }}
        ></Button>
      </View>
      <View style={styles.button}>
        <Button
          title="Suggestions?"
          onPress={() => {
            Alert.alert(
              "TODO:",
              "Add suggestions, placeholder. \nAdd suggestions on Discord."
            );
          }}
        ></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "darkcyan",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  tinyProfilePic: {
    width: 45,
    height: 45,
    borderRadius: 50,
    margin: 5,
  },
  ProfilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: 5,
    marginBottom: 10,
  },
  btnStyle: {
    width: "30%",
    backgroundColor: "white",
    marginTop: 50,
    borderColor: "lightblue",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;