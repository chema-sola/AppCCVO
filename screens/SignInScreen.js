import React, {useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import base64 from 'react-native-base64'

import { API_URL } from '../src/config/const';
import { setSessionToken, setUserObject } from '../src/actions/user';

import HomeScreen from './HomeScreen';


import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';

import Users from '../model/users';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        bootstrapping: true,
        carregando: false,
        
    });

    const { signIn } = React.useContext(AuthContext);
    const { colors } = useTheme();

    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }


    const [Textencode, setEncodeText] = useState("Encode");
    const [Textdecode, setDecodeText] = useState("Decode");


    const onPressEncode = (userName, password) => {
        const UserPWD = userName + ':' + password;
        const cifrado = base64.encode(UserPWD);
        setEncodeText(cifrado);

        const descifrado = base64.decode(cifrado);
        setDecodeText(descifrado);
    };

    const authenticateUser = (userName, password) => {

        /* if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Entrada incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                {text: 'Ok'}
            ]);
            return;
        } */
        // Transform Usuario&PWD => Base64
        const UserPWD = userName + ':' + password;
        const credentials = base64.encode(UserPWD);
        console.log("Encode:", credentials)
        setEncodeText(credentials);
        const descifrado = base64.decode(credentials);
        console.log("Decode:", descifrado)
        //setDecodeText(descifrado);

    
        fetch(API_URL+'/initSession', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' :  'Basic ' + credentials
            },
            cors: true
                
              }).then((response) => response.json())
                .then (async data => {
                    console.log("Datos", data)
                    if ( typeof data === 'object' && typeof data.session_token === 'string'){
                        try{
                            let {session_token} = data;                       
                            let objHeader = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'session_token': session_token,
                              };
                              let result = await fetch(API_URL + '/getFullSession/?session_token=' + session_token, {
                                headers: objHeader
                              });                         
                              let profileData = await result.json();
                              let resultProfile = await fetch(API_URL + '/User/'+profileData.session.glpiID+'?session_token=' + session_token, {
                                headers: objHeader
                              });
                              let resultProfileCvt = await resultProfile.json();
                              
                            const foundUser = {userName, session_token, profileData , resultProfile  , resultProfileCvt  }    
                        signIn(foundUser); 
                      
                    } catch (error) {
            
                      console.log("Error Entrada22")
                      Alert.alert('Error Conexión!', 'Error al cargar el perfil.', [
                          {text: 'Ok'}
                      ]);
                      throw (error);
                      
                    } 
                  }else{
                      Alert.alert('Entrada Incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                          {text: 'Ok'}
                      ]);
                  }
                })
                .catch( error => {
                    console.log("entra aqui?")
                    console.log(error);
                   
                    
                }).then( () => { 
                     setData({carregando: false})
                }); 
              
        
    }      
       
       return (
      <View style={styles.container} >
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Bienvenido!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Usuario</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Nombre de Usuario"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>El nombre de usuario es Incorrecto.</Text>
            </Animatable.View>
            }
            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Contraseña</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Contraseña"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Contraseña Incorrecta</Text>
            </Animatable.View>
            }

            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    //onPress={() => {loginHandle( data.username, data.password )}}
                    onPress={() => {authenticateUser(data.username, data.password )}}
                    

                >
                <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Iniciar Sesión</Text>
                </LinearGradient>
                </TouchableOpacity>

              
            </View>
        </Animatable.View>
      </View>
    );
};


 /** listen state */
/*  const mapStateToProps = (state) => ({
    userConfig: state.user
  })
   */
  /** dispatch actions */
/*   const mapDispatchToProps = dispatch => ({
    setToken: (token) => dispatch(setSessionToken(token)),
    setUser: (user) => dispatch(setUserObject(user))
  });
   */


export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });




  
    /* const onPressDecode = (userName, password) => {
        const UserPWD = userName + ':' + password;
        const descifrado = base64.decode(UserPWD);
        setDecodeText(descifrado);
    } */

    /* const signinAPI = async()=>{
        if(userName!="" && password!=""){
            await fetch(API_URL,{
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'user': username,
                'password': password
            })
        }).then(res => res.json())
        .then(resData => {
            setMessage(resData.message);
        })
        
        }
    }  */

    //======================================================================================//

     /* 
     const foundUser = Users.filter( item => {
           
        return userName == item.username && password == item.password;
            
        } );

        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Entrada incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                {text: 'Ok'}
            ]);
            return;
        }

        if ( foundUser.length == 0 ) {
            Alert.alert('Usuario invalido!', 'Nombre de usuario o contraseña incorrecta.', [
                {text: 'Ok'}
            ]);
            return;
        }

        signIn(foundUser);
    
    */
    //======================================================================================//



    
/* 
    const  GetFullProfile = async token => {
      
        let result = await fetch(API_URL + '/getFullSession/', {
            
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Session-Token": token,
          }
        });
      
        let resultCvt = await result.json();
        
        console.log(resultCvt);
  
        return resultCvt;
      }
   */


      
   /*  const loginHandle = (userName, password) => {

            console.log("Texto de prueba")

        const foundUser = Users.filter( item => {
           
        return userName == item.username && password == item.password;
            
        } );

            if ( data.username.length == 0 || data.password.length == 0 ) {
                Alert.alert('Entrada incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                    {text: 'Ok'}
                ]);
                return;
            }

            if ( foundUser.length == 0 ) {
                Alert.alert('Usuario invalido!', 'Nombre de usuario o contraseña incorrecta.', [
                    {text: 'Ok'}
                ]);
                return;
            }

        signIn(foundUser);
    } */


            //Componente
                /* <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Sign Up</Text>
                </TouchableOpacity> */





                /* 
                
                
        const authenticateUser = (userName, password) => {


        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Entrada incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                {text: 'Ok'}
            ]);
            return;
        }

        console.log("Data", data)

        //console.log("Encode & Decode")
        const UserPWD = userName + ':' + password;
        //console.log("UserPWd:", sUserPWD)
        const credentials = base64.encode(UserPWD);
        console.log("Encode:", credentials)
        setEncodeText(credentials);
        const descifrado = base64.decode(credentials);
        console.log("Decode:", descifrado)
        //setDecodeText(descifrado);

        var myHeaders = new Headers();

        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", 'Basic ' + credentials);

        //console.log (" Api_url", API_URL+'/initSession')

        return fetch(API_URL+'/initSession', {
            method: 'GET',
            headers: myHeaders,
            cors: true
          })
            .then(rawData => rawData.json())
            .then( async data => {
            console.log("data2", data)
            signIn(data)

            if ( typeof data === 'object' && typeof data.session_token === 'string'){
              try {
                let {session_token} = data;
                console.log("token", session_token)
                signIn(data);

             
               /*  let objHeader = {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'session_token': session_token,
                };
    
                let result = await fetch(API_URL + '/getFullSession/?session_token=' + session_token, {
                  headers: objHeader
                });
                
                let profileData = await result.json();

                console.log("prefileData", profileData)
    
                let resultProfile = await fetch(API_URL + '/User/'+profileData.session.glpiID+'?session_token=' + session_token, {
                  headers: objHeader
                });

                console.log("resultProfile", resultProfile)
                let resultProfileCvt = await resultProfile.json();
                console.log("resultProfileCvt", resultProfileCvt)
                console.log("Mi nombre", resultProfileCvt.firstname)               
                console.log("!!", !!profileData) 

            

                if(!!profileData){
                    
                    console.log("Entra aqui?")
                    
                  setUser({                      
                    userGLPI: profileData.session,
                    userProfile: resultProfileCvt
                  });

                  console.log("setuser", userGLPI)
                  
                    // Se ocorrer com sucesso
                    // startTabs();
                }else throw new Error(error);
                  
              } catch (error) {
      
                console.log("Error Entrada22")
                Alert.alert('Error Conexión!', 'Error al cargar el perfil.', [
                    {text: 'Ok'}
                ]);
                throw (error);
                
              } 
            }else{
                Alert.alert('Entrada Incorrecta!', 'El campo de nombre de usuario o contraseña no puede estar vacío.', [
                    {text: 'Ok'}
                ]);
            }
          })
          .catch( err => {
            console.log("errrror")
          }).then( () => { 
               setData({carregando: false})
          }); 
        }
    } */ 

