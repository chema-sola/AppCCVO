import { API_URL } from '../config/const';
import { Alert } from 'react-native';

export const getConexion =  async(credentials) => {
  console.log("Devolver la conexion Action", credentials)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(API_URL+'/initSession', {
        method: 'GET',
        headers: {
/*             'Accept' : 'application/json',
            'Content-Type' : 'application/json', */
            'Authorization' :  'Basic ' + credentials
        },
        cors: true   
          }).then((response) => response.json())
            .then (async data => {
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
                          
                          const DataUser = {
                            session_token, 
                            profileData, 
                            resultProfile, 
                            resultProfileCvt, 
                        }                        
                      resolve(DataUser);

                    }catch (error) {
                      Alert.alert('Error Conexión!', 'Error al cargar el perfil.', [
                      {text: 'Ok'}
                  ]);
                  throw (error);              
                } 
              }
            }).catch( error => {
                console.log(error);         
            }) 
          }, 2000);    
  });         
}      

