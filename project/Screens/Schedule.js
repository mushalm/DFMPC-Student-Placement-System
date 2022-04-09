import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/core'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Linking,
} from 'react-native';

const Dashboard = () => {
  const navigation =useNavigation()
  const [name, SetName] = useState('');

  return (
    <><View style={styles.button}>
      <Button  title='Dashboard' onPress={()=>{navigation.navigate("Dashboard")}}></Button>
    </View>
    <View style={styles.button}>
       <Button  title='Logout' onPress={()=>{navigation.navigate("Login")}}></Button>
      </View>
     </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default Dashboard;