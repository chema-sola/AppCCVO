import React, {useEffect} from 'react';
import { View,  StyleSheet, StatusBar } from 'react-native';
import { Drawer } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../components/context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation}) => {
  //const Data = React.useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    goTicket()
  }); 
  
  const goTicket = () => {
    navigation.navigate('TicketsScreen')
  }

  if(theme.dark == false){
    styles.button = {
      paddingHorizontal: 5,
      paddingVertical: 8,
      borderRadius: 15,
     // backgroundColor: "oldlace",
      alignSelf: "flex-start",
      marginHorizontal: "1%",
      marginTop: "10%",
      marginBottom: 6,
      minWidth: "39%",
      textAlign: "center",
      borderWidth: 1,
      borderColor: "#333333"
    }
  }

  if(theme.dark == true){
    styles.button = {
      paddingHorizontal: 5,
      paddingVertical: 8,
      borderRadius: 15,
     // backgroundColor: "oldlace",
      alignSelf: "flex-start",
      marginHorizontal: "1%",
      marginTop: "10%",
      marginBottom: 6,
      minWidth: "39%",
      textAlign: "center",
      borderWidth: 1,
      borderColor: "#ffffff"
    }
  }

    return (
      <View style={styles.container }>
        <StatusBar barStyle = { theme.dark ? "light-content" : "dark-content" }/>
      <View style={styles.row}>
      <Drawer.Item 
          icon={({color, size}) => (
            <Icon 
            name="alert-box" 
            color={color}
            size={size}
            />
        )}
        style={styles.button}
        label="Tickets"
        onPress={() => {navigation.navigate('TicketsScreen')}}
      />
        </View>
      </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginTop: "10%",
    marginBottom: 6,
    minWidth: "39%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white"
  },
});
