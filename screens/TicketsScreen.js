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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const TicketsScreen = ({route, navigation}) => {
  const {Data} = React.useContext(AuthContext);
  const [pageStart, setPageStart]= React.useState(0)
  const [pageEnd, setPageEnd]= React.useState(20)
  const [isFetching, setFetching] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const isFocused = useIsFocused();
  const tokenUser = Data.initialLoginState.propsData.session_token


  useEffect(() => {
    getData();
    if(isFocused){
    }
  }, [isFocused, pageStart, pageEnd],); 

  const getData =  async () => {
    await fetch(API_URL+'/ticket/?order=DESC&expand_dropdowns=true&range='+pageStart+'-'+pageEnd, {
       method: 'GET',
       headers: {
         'Session-Token' :   tokenUser,
       }
     }).then((response) => response.json())
       .then (async json => {
          const arr = []
          const arrayticket  = json.map((item) => { 
            if (item.status == 1) {
              return arr.push({
                Id: item.id, 
                Title: item.name, 
                DateCreate: item.date_creation,
                Status: item.status,
                Entity: item.entities_id,
                User: item.users_id_recipient,
                Content: item.content
              })
            }
            if (item.status == 2) {
              return arr.push({
                Id: item.id, 
                Title: item.name, 
                DateCreate: item.date_creation,
                Status: item.status,
                Entity: item.entities_id,
                User: item.users_id_recipient,
                Content: item.content
              })
            }
            if (item.status == 4) {
              return arr.push({
                Id: item.id, 
                Title: item.name, 
                DateCreate: item.date_creation,
                Status: item.status,
                Entity: item.entities_id,
                User: item.users_id_recipient,
                Content: item.content
              })
            }

          });
          setData([...data, ...arr]);    

       })
       .catch((error) => console.error(error))
       .finally(() => setLoading(false));       
   }


  const onRefresh = () =>  {
    this.setFetching({isFetching: true}, function(){
    })
  }

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableWithoutFeedback>
          <ActivityIndicator color="#181f1d" />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  const handleMore = () => {
    setPageStart(pageStart + 20)
    setPageEnd(pageEnd + 20)
  }

  const renderItem = ({ item}) => ( 
    <CardTicket 
      key={item.id}
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
          //  keyExtractor={(item) => item.Id.toString()}       
            keyExtractor={(item, index) => String(index)}       
            ListFooterComponent={renderFooter}
            renderItem={renderItem}
           // refreshing={true}
            onEndReached={handleMore}
            onEndReachedThreshold={0.1}
           // onRefresh={onRefresh}
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
  footer: {
    marginTop: 20,
    height: 40,
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1f0ec',
    flexDirection: 'row',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,

  }
});

