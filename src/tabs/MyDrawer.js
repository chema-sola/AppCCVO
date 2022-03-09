import React  from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import {DrawerContent} from './DrawerContent';
import HomeScreen from '../../screens/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import TicketsScreen from '../../screens/TicketsScreen';
import DetallTicketScreen from '../../screens/DetallTicketScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MyDrawer = ({navigation, ...props}) => {
  const { Data } = props
  console.log("DATADrawer", Data)

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} Data={Data} />}>
      <Drawer.Screen name="HomeScreen" component={HomeStackNavigator}  />
      <Drawer.Screen name="TicketsScreen" component={TicketStackNavigator}/>
      <Drawer.Screen name="DetallTicketScreen" component={DetallTicketStackScreen}/>
      <Drawer.Screen name="ProfileScreen" component={ProfileStackNavigator}  />               
    </Drawer.Navigator>
  );
};



const HomeStackNavigator = ({navigation}) => {
  return (
  <Stack.Navigator initialRouteName="HomeScreen"  activeColor="#fff"   >
        <Stack.Screen  
        name="HomeScreen" 
        //component={HomeScreen}         
        options={{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          },
          title:'Visión General',
          headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
        }}
      >
         {props => <HomeScreen {...props}  />}
       </Stack.Screen>
  </Stack.Navigator> 
  )
}


const TicketStackNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="TicketsScreen" activeColor="#fff" >
      <Stack.Screen  
        name="TicketsScreen" 
        component={TicketsScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          },
          title:'Tickets',
          headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
        }} 
      >
       
      </Stack.Screen>
    </Stack.Navigator> 
  )
}



const DetallTicketStackScreen = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen  
        name="DetallTicketScreen" 
        component={DetallTicketScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          },
          title:'Detalle Ticket',
          headerLeft: () => (
              <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
        }} 
      />

    </Stack.Navigator> 
  )
}

const ProfileStackNavigator = ({navigation, ...props}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          fontWeight: 'bold'
          },
          title:'Perfil',
          headerLeft: () => (
            <Icon.Button name="ios-menu" size={25} backgroundColor="#009387" onPress={() => navigation.openDrawer()}></Icon.Button>
          )
        }} 
      />
    </Stack.Navigator> 
    )
}

export default MyDrawer;
