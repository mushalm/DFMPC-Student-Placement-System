import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Import the functions you need from the SDKs you need


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = { //
  apiKey: "AIzaSyAZVQZO8XWR0UTPoSMLrRN7nSltUDW9Xzs",
  authDomain: "dfmpc-student-placement-system.firebaseapp.com",
  projectId: "dfmpc-student-placement-system",
  storageBucket: "dfmpc-student-placement-system.appspot.com",
  messagingSenderId: "295214875936",
  appId: "1:295214875936:web:c6574b5bd48a1652c84345",
  measurementId: "G-C2X38C34FX"
};

// Initialize Firebase


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Riot Ndlovu</Text>
      <Text>Nokuthaba Moyo</Text>
      <Text>Shagan</Text>
      <Text>Callum</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0f00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});