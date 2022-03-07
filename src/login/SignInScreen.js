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
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
//import { CheckBox } from 'react-native-elements'

import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import base64 from 'react-native-base64'

import { API_URL } from '../config/const';
import { setSessionToken, setUserObject } from '../actions/user';

import { useTheme } from 'react-native-paper';
import { AuthContext } from '../../components/context';

import AsyncStorage from '@react-native-community/async-storage';
import {getConexion} from '../actions/Actions';


//import Users from '../model/users';


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

    const [ isSelected, setSelection] = React.useState(false);
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

    const authenticateUser = (userName, password) => {
        const UserPWD = userName + ':' + password;
        const credentials = base64.encode(UserPWD);
        if( credentials !==  null) {
            try{
            getConexion(credentials)
                .then(response => {
                const DataUser = response
                isSelected ? AsyncStorage.setItem('credentials', credentials) : null 
                signIn(DataUser)
            }).catch(error => console.warn(error));
            }catch(e) {
            console.log(e);
            }
        }
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

            {/* =========================================================================== */}
            <View style={styles.action}>
                <View style={styles.checkboxContainer}>
                <CheckBox
                    value={isSelected}
                    disabled={false}
                    onValueChange={setSelection}
                    style={styles.checkbox}
                    tintColors={{ true: '#009387', false: 'black' }}
                    />                
                <Text style={styles.label}>Recuérdame</Text>
                </View>
            </View>
            {/* =========================================================================== */}

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
    CheckBox:{
        borderColor: 'red',
        paddingLeft: 5,
        paddingTop: 5,

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
    },
 
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },

    checkbox: {
        alignSelf: "center",
        borderColor: "#666666"
    },
    label: {
        margin: 8,
        color:'#666666'
    },
  });



