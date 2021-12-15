import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';

const HomeScreen = ({navigation, props}) => {

  const { colors } = useTheme();

  const theme = useTheme();

 // console.log("propiedades", props)

  //console.log("foundUser" , foundUser)
  
    return (
      <View style={styles.container}>
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
        <Text style={{color: colors.text}}>Página Principal</Text>
      <Button
        title="Ir a la pantalla Tickets"
        onPress={() => navigation.navigate("Details")}
      />
      </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
