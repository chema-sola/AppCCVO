import React,  {useEffect} from 'react';
import { Text, View, ScrollView, TouchableHighlight, ActivityIndicator,  StyleSheet,  FlatList, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from '../src/config/const';

import CardTicket from '../components/CardTicket';
import { AuthContext } from '../components/context';
import {getDataTicket} from '../src/actions/ActionsTicket';
import { useIsFocused } from "@react-navigation/native";


const TicketsScreen = ({route, navigation, ...props}) => {
  const {Data} = React.useContext(AuthContext);
  const [isFetching, setFetching] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [isnombre, setNombre] = React.useState(null);
  const [isArrDate, setArrdate] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const isFocused = useIsFocused();
  const tokenUser = Data.propsData.session_token

  useEffect(() => {
    getData();

    if(isFocused){
      console.log("Entra?")
    }
  }, [isFocused]); 

  const myblob =  (item) => {
    if(item.User == 0) {

     
/*       const  result = new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve('Async Test Load');
          }, 3000);
      });
      const consumer = () => {
        result.then(
          result => {},
          error => {}
        )
      } */

   /*   let A =  fetch(API_URL+'/ticket/'+item.Id+'/ticket_user?expand_dropdowns=true', {
        method: 'GET',
        headers: {
          'Session-Token' :   tokenUser,
          'html' : true, 
        }
      }).then((res) => res.json())
        .then(async res => {
           return res[0].alternative_email
        }) */
      //  console.log("response", response)
       return "isnombre"   

    }

    if( item.User !== 0) {
   /*    function getvals(){
        return fetch('https://jsonplaceholder.typicode.com/posts',
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("responseData",  responseData);
          return responseData;
        })
        .catch(error => console.warn(error));
      }
       */
      //getvals().then(response => setNombre(response[0].userId))
      //  console.log("AA ", isnombre)
      //  const name = isnombre

      return "name"
    }

  }

  const nombreEmail = (item) => {
     if(item.User == 0){
      console.log("==== Opcion 1 (USER == 0) NO TIENE ID =====")
      GetUser(item)
    /*     .then((res) => res.json())
        .then(res => {
        console.log("data", res);
        return "chema"
      }) */
        //.then((res) => res.json())


        /* .then((res) => {
        console.log("RES", res)
          if(res.length !== 0) {
            console.log( "Dentro")

            const email = res[0].alternative_email
            console.log("GETEMAIL", email)
            return email
        // setNombre(email)
          }
      
        if( res.length === 0) {
          console.log( "VACIO")
        }
      }) */
      .catch((error) => console.error(error))
      .finally(() => setLoading(false)); 
     // const as = GetUser(item)
      //console.log("ASA", email)
      //console.log("RETURN AS", email)
   
    }
    if(item.User !== 0){
      console.log("==== Opcion 2 (USER !==0 ) TIENE ID=====")
      return  "Con ID"
    } 
    //setNombre(email)
   // return email
  // return "chema"
  } 

  const GetUser = async  (item) => {
    console.log("ITEM", item)
    console.log("URL", API_URL+'/ticket/'+item.Id+'/ticket_user?expand_dropdowns=true')
    await fetch(API_URL+'/ticket/'+item.Id+'/ticket_user?expand_dropdowns=true', {
        method: 'GET',
        headers: {
          'Session-Token' :   tokenUser,
          'html' : true, 
        }
      }) .then((res) => res.json())
        .then((res) => {
          console.log("RES", res)
          return myblob(res);
          /* if(res.length !== 0) {
            const email = res[0].alternative_email
            console.log("GETEMAIL", email)
            //return email
            //setNombre(email)
            return "chema"
          }
        
          if( res.length === 0) {
            console.log( "VACIO")
          } */
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));  
  }

  const getData =  async () => {
    await fetch(API_URL+'/ticket/?order=DESC', {
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
              User: item.users_id_recipient,
              Content: item.content
            })
          });
                     
          
          
         
            console.log("INFOTICKET PUSH", arr)
           // console.log("DATA USER", isnombre)
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

  const goToNextScreen = () => {
    return navigate('DetallTicketScreen');
  }


  //Meter una funcion de return valor Status
  const renderItem = ({ item, index }) => ( 
    console.log("renderItem, ITEM", item),
    <CardTicket 
      getID={item.Id}      
      getStatus = {item.Status}
      getTitle={item.Title} 
      getDataEntry = {item.DateCreate}
      getContent = {item.Content}
      getApplicant = {myblob(item)}
      navigation  = {navigation}
      route = {route}       
      // getEntity = {element.entity}
      // getApplicant ={function12(item)}
      // getAssigned = { element.assigned} 


      /* 
      
              Id: item.id, 
              Title: item.name, 
              DateCreate: item.date_creation,
              Status: item.status,
              User: item.users_id_recipient,
              Content: item.content
      */
      
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


  /* if(arr.User == 0){
              console.log("==== Opcion 1 (USER == 0) NO TIENE ID =====")
              console.log("INFOTICKET", arr)
              //==============================================================//
                 const resp = await fetch(API_URL+'/ticket/'+item.id+'/ticket_user?expand_dropdowns=true', {
                method: 'GET',
                headers: {
                    'Session-Token' :   tokenUser,
                }}); 
                const dataUser = await resp.json();
                console.log("DATAUSER Ticket", dataUser)  *           
                console.log("URL", API_URL+'/ticket/'+get.getID+'/ticket_user?expand_dropdowns=true')
                console.log("DATAUSER", dataUser[0])
                let name = dataUser[0].alternative_email
                let id = json.entities_id
                let contents = json.content
                const dataTicket = {
                  name,
                  contents,
                  id
                } */
                //console.log("dataTicket", dataTicket)
                //setData(dataTicket)
            
          /*  if(arr.User!== 0){
              console.log("==== Opcion 2 (USER !==0 ) TIENE ID=====")
              console.log("INFOTICKET", arr)
              //==============================================================//          
              let name = json.users_id_recipient
              let id = json.entities_id
              let contents = json.content
              const dataTicket = {
               name,
               contents,
               id
              }
              console.log("dataTicket", dataTicket)
              setData(dataTicket)
             } */


  
   /*  const getData = async () => {
     const resp = await fetch(API_URL+'/ticket/?order=DESC', {
        method: 'GET',
        headers: {
            'Session-Token' :   tokenUser,
        }
      }).then((response)  => response.json())
        .then(async json => {
          console.log("JSON() / ListTicket", json)
          const data = await resp.json();
          const arr = []
          const arrayticket  = data.map((item) => { 
            const iduser = item.users_id_recipient
            console.log("ID User:", iduser) 
            if(iduser !== 0){
              console.log("==== Opcion 1 =====")
              //==============================================================//
              return arr.push({
                id: item.id, 
                title:item.name, 
                status:item.status, 
                dateEntry:item.date_creation, 
                userId:item.users_id_recipient , 
                userName:  "f2()"
              });
            }
            if(iduser == 0){
              console.log("==== Opcion 2 =====")
              //==============================================================//
              return arr.push({
                id: item.id, 
                title:item.name, 
                status:item.status, 
                dateEntry:item.date_creation, 
                userId:item.users_id_recipient , 
                userName:  "f2()"
              });
            }
          })
          console.log("isArrDate", arr) 
          setData(arr);
        })   
  }; */



 /*  const getData = async () => {
    const resp = await fetch(API_URL+'/ticket/?order=DESC', {
      method: 'GET',
      headers: {
          'Session-Token' :   tokenUser,
      }
    }); 
      const data = await resp.json();
      console.log("DataTicket", data)   
      const arr = []
      const arrayticket  = data.map((item) => {
        const iduser = item.users_id_recipient 
        console.log("Obtener ID User", iduser) 
         if(iduser !== 0){
          console.log("==== Opcion 1 =====")
          //==============================================================//

          async function f2() {
            var y = await 20;
            console.log(y); // 20
          }
         */



/*   const getUser = async (item) => {
    const iduser = item.users_id_recipient 
    const resp = await fetch(API_URL+'/user/'+iduser, {
      method: 'GET',
      headers: {
          'Accept'        :   'application/json',
          'Content-Type'  :   'application/json',
          'Session-Token' :   tokenUser,
      }});
    const dataUser = await resp.json();
    const nameUser = dataUser.name
    console.log("Nomresss", nameUser)
    
  }
 */



  /*     const getUser = async (item) => {
        const iduser = item.users_id_recipient
        console.log("Obtener USer", iduser)
        console.log("============")
        const resp = await fetch(API_URL+'/user/'+iduser, {
          method: 'GET',
          headers: {
              'Accept'        :   'application/json',
              'Content-Type'  :   'application/json',
              'Session-Token' :   tokenUser,
          }});
          const dataUser = await resp.json();   
          const nameUser = dataUser.name
          console.log("nombre", nameUser)
          return "nameUser"
        } */
   


        
 /*  const getUser = async (item) => {
    const iduser = item.users_id_recipient
    console.log("Obtener USer", iduser)
    const resp = await fetch(API_URL+'/user/'+iduser, {
      method: 'GET',
      headers: {
          'Accept'        :   'application/json',
          'Content-Type'  :   'application/json',
          'Session-Token' :   tokenUser,
      }}); 
    const data = await resp.json();
    const nombre = data.firstname + " " + data.realname
    console.log("iduserNAME", nombre)
    return nombre
  }
 */

/* 
  const getUser = async (item) => {
    const iduser = item.users_id_recipient
    console.log("Obtener USer", iduser)
    console.log("============")
    const resp = await fetch(API_URL+'/user/'+iduser, {
      method: 'GET',
      headers: {
          'Accept'        :   'application/json',
          'Content-Type'  :   'application/json',
          'Session-Token' :   tokenUser,
      }});
      const dataUser = await resp.json();   
      console.log("NAME", dataUser.name ) 
      return  new Promise((resolve, reject) => {
        const name2 = data.name
        console.log("name2", name2)
        resolve(name2)
      })
    }

  const function12 = (item) => {
    const iduser = item.users_id_recipient
    if(iduser !== 0){
          getUser(item)
        
        console.log("GETFUNCTION") 
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            fetch(API_URL+'/user/'+iduser, {
              method: 'GET',
              headers: {
                  'Accept'        :   'application/json',
                  'Content-Type'  :   'application/json',
                  'Session-Token' :   tokenUser,
              },
              cors: true
            })
              .then((response) => response.json())
              .then (async data => {
                try{
                  console.log("name", data.name)
                  resolve(data.name)
                }catch(error) {
                  console.log("error", error)
                }
              })
              .catch( error => {
                console.log("error2: ", error);         
            })
          }, 2000)
        }) 
      }
      if(iduser == 0) {
        let at;
        console.log("==== Opcion 2 =====")
        return at="Opcion2"
      }
      
    }
  

*/


/* 


  const getUser = async (item) => {
    const iduser = item.users_id_recipient
    console.log("Obtener USer", iduser)
    const resp = await fetch(API_URL+'/user/'+iduser, {
      method: 'GET',
      headers: {
          'Accept'        :   'application/json',
          'Content-Type'  :   'application/json',
          'Session-Token' :   tokenUser,
          'Content-Range' :   0-2/2,
          'Accept-Range'  :   990,
      }
    }); 
      const nombre = await resp.json();
      console.log("Data Nombre ITEM", nombre)   
      setNombre(nombre);
  }; */





         //  async function f() { 
            /* const promise = new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(API_URL+'/user/'+iduser, {
                  method: 'GET',
                  headers: {
                      'Accept'        :   'application/json',
                      'Content-Type'  :   'application/json',
                      'Session-Token' :   tokenUser,
                  },
                  cors: true   
                }).then((response) => response.json())
                  .then(async data => {
                    console.log("RESPONSE", data.name)
                    let namePromise = data.name
                    resolve(namePromise)
                  })                 
              },1000)
            }).then((namePromise) => {
              console.log("namePromise", namePromise)
              return namePromise
            }) */

           // let result =  promise; // espera hasta que la promesa se resuelva (*)
           // console.log("RESULTADO", promise)
            //return result 
        //  }           
      
   /*       const as = f().then(response => {
            const DataUser = response
            console.log("DATA88", DataUser)
           return  DataUser
          })  
          console.log("ASSA", as)  */        
          /* 
          getConexion(credentials)
                      .then(response => {
                      const DataUser = response
                      authContext.signIn(DataUser)
                    }).catch(error => console.warn(error));
          */


         /*  f().then(response => {
            const DataUser = response
            console.log("DATA88", DataUser)
            return {DataUser}
          })  */