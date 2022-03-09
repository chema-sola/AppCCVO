import React,  {useEffect} from 'react';
import {  
  View, 
  ActivityIndicator,  
  StyleSheet,  
  FlatList, 
} from 'react-native';

import { API_URL } from '../src/config/const';
import CardTicket from '../components/CardTicket';
import { AuthContext } from '../components/context';
import { useIsFocused } from "@react-navigation/native";


const TicketsScreen = ({route, navigation}) => {
  const {Data} = React.useContext(AuthContext);
  const [isFetching, setFetching] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const isFocused = useIsFocused();
  const tokenUser = Data.initialLoginState.propsData.session_token


  useEffect(() => {
    getData();
    if(isFocused){
    }
  }, [isFocused]); 

  const getData =  async () => {
    await fetch(API_URL+'/ticket/?order=DESC&expand_dropdowns=true`', {
       method: 'GET',
       headers: {
         'Session-Token' :   tokenUser,
       }
     }).then((response) => response.json())
       .then (async json => {
          const arr = []
          const arrayticket  = json.map((item) => { 
           return arr.push({
              Id: item.id, 
              Title: item.name, 
              DateCreate: item.date_creation,
              Status: item.status,
              Entity: item.entities_id,
              User: item.users_id_recipient,
              Content: item.content
            })
          });
          setData(arr);      
       })
       .catch((error) => console.error(error))
       .finally(() => setLoading(false));       
   }


  const onRefresh = () =>  {
    this.setFetching({isFetching: true}, function(){
      this.getData()
    })
  }

  const renderItem = ({ item}) => ( 
    <CardTicket 
      getID={item.Id}      
      getStatus = {item.Status}
      getTitle={item.Title} 
      getDataEntry = {item.DateCreate}
      getContent = {item.Content}
      getEntity = {item.Entity}
      getApplicant = {item.User}
      navigation  = {navigation}
      route = {route}       
      // getAssigned = { element.assigned}      
    />
  );

    return (
      <View style={styles.container}>
        {!data &&  <ActivityIndicator size="large" color="#0000ff" /> }         
        {data && (
          <FlatList
            data={data}
            keyExtractor={(item) => item.Id.toString()}       
            renderItem={renderItem}
            refreshing={true}
            //onRefresh={onRefresh}
            //maxToRenderPerBatch={5} 
          />
        )}
      </View>
    );
};

export default TicketsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

