import React, {useEffect} from "react";
import { View,  StyleSheet, StatusBar } from 'react-native';
 import {
   Text,
  Badge,
  colors,
} from 'react-native-elements'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from './context';
import { API_URL } from '../src/config/const';
import { useIsFocused } from "@react-navigation/native";


const CardTicket = ({ route, token, navigation, ...props}) => {
  const {Data} = React.useContext(AuthContext);
  const isFocused = useIsFocused();
  const [isEmail, setEmail] = React.useState(null);
  const theme = useTheme();
  const tokenUser = Data.initialLoginState.propsData.session_token

  useEffect(() => {
    if(isFocused){ 
      getEmail();
  }
}, [isFocused]);  

  const statusinfo = () => {
    if(props.getStatus == 0){
    }
    if(props.getStatus == 1){
      return (
        <Badge value="Nuevo" status="success" />
      )
    }
     if(props.getStatus == 2){
      return (
        <Badge value="En Curso" status="primary" />
      )
    }
    if(props.getStatus == 4){
      return (
        <Badge value="En Espera" status="warning" />
      )
    }
    if(props.getStatus == 6){
      return (
        <Badge value="Cerrado" status="black" />
      )
    }
  }

  const getEmail =  () => {
    if(props.getApplicant == 0) { 
      let A =  fetch(API_URL+'/ticket/'+props.getID+'/ticket_user?expand_dropdowns=true', {
        method: 'GET',
        headers: {
          'Session-Token' :   tokenUser,
          'html' : true, 
        }
      }).then((res) => res.json())
        .then(async res => {
           let at = res[0].alternative_email
           setEmail(at)
        })
      }
    if( props.getApplicant !== 0) {
      setEmail(props.getApplicant)
    }
    return " "

  }
    return (
        <View style={styles.container}>
          <StatusBar barStyle = { theme.dark ? "light-content" : "dark-content" }/>
          <View style={styles.cardDefault}>
            <View style={styles.barTop}>
              <View style={styles.infoID}>
                <Text style={{fontWeight: "bold"}}>ID: </Text>  
                <Text style={[{color: colors.text}]}>{props.getID}</Text>
              </View>
              <View style={styles.infoStatus}>  
                {statusinfo()}
              </View>
              <View style={styles.infoIcon}>  
              <Icon.Button name="page-last" 
                size={25} 
                backgroundColor="#009387" 
                onPress={() => navigation.navigate('DetallTicketScreen', { 
                  screen: 'DetallTicketScreen',
                  params: {props}, 
                })}>
              </Icon.Button>
              </View>
            </View>
            <View style={styles.title}>
              <Text numberOfLines={1} style={{fontWeight: "bold"}}> {props.getTitle} </Text>
            </View>

            <View style={styles.barBottom}>
              <View style={styles.fecha}>
                <Text style={{ fontSize: 12 , fontWeight: 'bold' }}>Date: </Text>
                <Text style={styles.textfecha}> {props.getDataEntry} </Text>
              </View>

              <View style={styles.entity}>
                <Text> {props.getEntity} </Text>
              </View>
              </View>

            <View style={styles.barBottom}>
              <View style={styles.applicant}> 
             <Text> {isEmail}  </Text>

              </View>
              <View style={styles.assigned}>            
                <Text> {props.getAssigned} </Text>
              </View>
            </View>
        </View>       
      </View>
    );
};

export default CardTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
  },
  cardDefault: {
    flex: 1, 
    backgroundColor: '#b0f4ed',
    width: '95%',
    marginTop: 10,
    borderRadius: 10,
  },
  barTop: {
    paddingLeft: 10,
    width: '100%',
    display: 'flex', 
    flexDirection: 'row', 
  },
  infoID: {
    flexDirection: 'row', 
    paddingLeft: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '15%',
  },
  infoStatus: {
    justifyContent: 'center', 
    width: '20%',
  },
  infoIcon: {
    marginLeft: 'auto',
    width: '14%',
  },
  title: {
    paddingLeft: 10,
    paddingBottom: 5,


  },
  barBottom: {
    flexDirection: 'row', 
  },
  barBottomleft: {
    flexDirection: 'column', 
  },
  fecha: {
    justifyContent: 'center', 
    paddingBottom: 5,
    paddingLeft: 10,
    alignItems: 'center', 
    flexDirection: 'row', 
    width: '50%',
  },
  textfecha: {

  },
  entity: {
    width: '50%',
  },
  applicant: {
    paddingLeft: 10,
    paddingBottom: 5,
    flexDirection: 'row', 
    width: '70%',
  },
  assigned: {
    flexDirection: 'row', 
    width: '50%',
  }
});


