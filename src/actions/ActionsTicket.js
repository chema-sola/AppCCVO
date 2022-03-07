import { API_URL } from '../config/const';

export const getDataTicket = async (credentials) => {
  
        const tokenUser = credentials
        const resp = await fetch(API_URL+'/ticket/?order=DESC', {
              method: 'GET',
              headers: {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json',
                  'Session-Token' :  tokenUser,
              }
        }); 
        const data = await resp.json();       
          try{
            resolve(data);  

          }catch (error) {
            console.log(error);  
          }
        

    
}             
 

   


//  return new Promise((resolve, reject) => {