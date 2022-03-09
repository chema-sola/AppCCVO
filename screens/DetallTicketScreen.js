import React, {useEffect} from "react";
import {View, Text,  StyleSheet, FlatList, TouchableOpacity, ScrollView, useWindowDimensions} from "react-native";
import { ListItem , colors, Badge} from "react-native-elements";
import { API_URL } from '../src/config/const';
import { AuthContext } from '../components/context';
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native-webview';
import RenderHTML from "react-native-render-html";
import {decode} from 'html-entities';
import { useIsFocused } from "@react-navigation/native";

const DetallTicketScreen = ({navigation, ...props}) => {
  const {Data} = React.useContext(AuthContext);
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const tokenUser = Data.initialLoginState.propsData.session_token
  const get = props.route.params.props
  const { width } = useWindowDimensions();
  const [isOnline, setIsOnline] = React.useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
      if(isFocused){ 
        getInitialData();
    }
  }, [isFocused]);

  const getInitialData =  async () => {
    await fetch(API_URL+'/ticket/'+get.getID+'?expand_dropdowns=true', {
       method: 'GET',
       headers: {
         'Session-Token' :   tokenUser,
         'html' : true, 
       }
     }).then((response) => response.json())
       .then (async json => {
          if(json.users_id_recipient == 0){
            const resp = await fetch(API_URL+'/ticket/'+get.getID+'/ticket_user?expand_dropdowns=true', {
              method: 'GET',
              headers: {
                  'Session-Token' :   tokenUser,
              }}); 
              const dataUser = await resp.json();
              let name = dataUser[0].alternative_email
              let id = json.entities_id
              let contents = json.content
              const dataTicket = {
               name,
               contents,
               id
              }
              setData(dataTicket)
           }
           if(json.users_id_recipient !== 0){
            let name = json.users_id_recipient
            let id = json.entities_id
            let contents = json.content
            const dataTicket = {
             name,
             contents,
             id
            }
            setData(dataTicket)
           }
       })
       .catch((error) => console.error(error))
       .finally(() => setLoading(false));       
   }
  const statusinfo = () => {
    if(get.getStatus == 0){
    }
    if(get.getStatus == 1){
      return (
        <Badge value="Nuevo" status="success" />
      )
    }
     if(get.getStatus == 2){
      return (
        <Badge value="En Curso" status="primary" />
      )
    }
    if(get.getStatus == 4){
      return (
        <Badge value="En Espera" status="warning" />
      )
    }
    if(get.getStatus == 6){
      return (
        <Badge value="Cerrado" status="black" />
      )
    }  
  }

const deco = decode(get.getContent)
const html =  deco 
    return (
      <View style={styles.container}>
      {isLoading ? <Text>Loading...</Text> : 
      (
        <ScrollView >
          <View style={styles.cardDefault} >
            <View style={styles.celda}>
              <Text style={styles.info}>ID:</Text>
              <Text style={styles.res}>{get.getID}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.info}>Titulo:</Text>
              <Text style={styles.res}>{get.getTitle}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.info}>Entidad:</Text>
              <Text style={styles.res}> {data.id} </Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.info}>Fecha de Apertura:</Text>
              <Text style={styles.res}>{get.getDataEntry}</Text>
            </View>
            <View style={styles.celda}>
              <Text style={styles.info}>Estado:</Text>
              <View> 
                {statusinfo()} 
              </View>
            </View>
            <View style={styles.celda}>
              <Text style={styles.info}>Solicitante:</Text>
              <Text style={styles.res}>{data.name}</Text>
            </View>            
            <View style={styles.celda}>
              <Text style={styles.info}>Contenido:</Text>
            </View>
          </View >
            <View style={styles.content}>
              <HTMLView value={html} /> 
              {/* <RenderHTML contentWidth={width} source={{ html }} /> */}
            </View>         
        </ScrollView>
      )}
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#CFF3EF',
    },
    cardDefault: {
      backgroundColor: '#b0f4ed',
      padding: '2%',
    },
    content: {
      flex: 1,
      paddingLeft: '5%',
      paddingRight: '5%', 
    },
    celda: {
      flexDirection: 'row', 
      padding: 5,
    },
    info: {
      paddingLeft: 10,
      width: '40%',
      fontWeight: 'bold'
    },
    res: {
      width: '60%'
    },
  });




export default DetallTicketScreen;