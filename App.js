import React, {useEffect} from 'react';
import { View, ActivityIndicator , YellowBox } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import { Provider } from 'react-redux'
//import store from './src/store/store'

import { AuthContext } from './components/context';
import RootStackScreen from './src/login/RootStackScreen';

import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';
import { useDispatch } from 'react-redux';

import {getConexion} from './src/actions/Actions';
import MyDrawer from './src/tabs/MyDrawer';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'RNDeviceInfo', 'Warning:', 'Warning: An update', 'Failed to get size for image:']);


const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [propsData, setpropsData] = React.useState(null);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    propsData: propsData,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const authContext = React.useMemo(() => ({
    signIn: async(DataUser) => { 
      initialLoginState.propsData = DataUser
      const userToken = String(DataUser.session_token);
      setUserToken(userToken);
      setpropsData(DataUser);
      setIsLoading(true);
      DataStorage();
      const userName = DataUser.userName;
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async() => {
       setUserToken(null);
       setIsLoading(false);
      try {
        //await AsyncStorage.removeItem('userToken');
        deleteStorage();
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },  
    toggleTheme: async() => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
      try{
        await AsyncStorage.setItem('isDarkTheme', JSON.stringify(!isDarkTheme));
      }catch(e) {
        console.log(e)
      } 
    },    
    Data: {initialLoginState}
       
  }), [isDarkTheme]);  

  const DataStorage = async() => {
    try{
      AsyncStorage.getItem('isDarkTheme', (err, value) => {
        if (err) {
            console.log(err)
        } else {
          let StorageTheme=  JSON.parse(value) // boolean false
          setIsDarkTheme(StorageTheme);
        }
    })
    }catch(e) {
      console.log(e)
    }
  }
  
  //Usamos Esta Función si deseamos eliminar AsyncStortage, (No esta activado)
  const deleteStorage = async() => {
    try{
      await AsyncStorage.removeItem('credentials');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('DataUser');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('isDarkTheme');
    }catch(e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
     setTimeout(async() => {
      credentials = await AsyncStorage.getItem('credentials');
      if( credentials !==  null) {
        try{
          getConexion(credentials)
            .then(response => {
            const DataUser = response
            authContext.signIn(DataUser)
          }).catch(error => console.warn(error));
        }catch(e) {
          console.log(e);
        }
      }
      //setIsLoading(false);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
  
  return (
  //<Provider store={store}>
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext} >      
        <NavigationContainer theme={theme}>
          { loginState.userToken !== null ? (
            <MyDrawer Data={propsData} />
          )
          :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  //</Provider>
  );
}

export default App;

