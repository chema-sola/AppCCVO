import React, {useEffect} from 'react';
import { View, StyleSheet, ScrollView, Text, } from 'react-native';
import {
  useTheme,
  Avatar,
  Colors
} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../components/context';
import { API_URL } from '../src/config/const';


const ProfileScreen = (route, navigation , test,  data, props) => {
  const { colors } = useTheme();
  const {Data} = React.useContext(AuthContext);
  const [Email, setEmail] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);


  const tokenUser = Data.propsData.session_token
  const perfil = Data.propsData.resultProfileCvt
  
  console.log("DATA", Data)

  useEffect(() => {
    getEmail();
  });
  //http://cau.vallesoriental.cat/apirest.php/User/1310/Useremail?expand_dropdowns=true

  const getEmail =  async () => {
    await fetch(API_URL+'/User/'+Data.propsData.resultProfileCvt.id+'/Useremail?expand_dropdowns=true', {
       method: 'GET',
       headers: {
         'Session-Token' :   tokenUser,
         'html' : true, 
       }
     }).then((response) => response.json())
       .then (async json => setEmail(json[0].email))
       .catch((error) => console.error(error))
       .finally(() => setLoading(false));       
   }

  //const { itemId } = route.params;
  //console.log("ITEMS", itemId)
  //https://dev.to/bruino/3-utiles-apis-generadoras-de-avatar-p6



    return (    
      <View style={styles.container}>
        <View style={styles.cardTop}>
          <View style={styles.cardImage}>
            <Avatar.Image style={styles.avatar}
                source={{
                    uri: 'https://ui-avatars.com/api/?name=' + perfil.realname + 'now&background=0D8ABC&color=fff&size=128'
                }}
                size={100}
            />
          </View>      
        </View >
        <View style={styles.card}>
          <View style={styles.textinfo}>        
            <Text style={[styles.cardTitle, {color: colors.text}]} > Información </Text> 
          </View>
          <ScrollView>

            <View style={styles.cardInfo}>
            <Text style={[styles.text_title, {color: colors.text}]}>Usuario</Text>
              <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={25}
                />
                <Text style={[styles.text_sub, {color: colors.text}]}> {Data !== null ? (perfil.name)  : " " } </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.text_title, {color: colors.text}]}>Apellido</Text>
              <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={25}
                />
                <Text style={[styles.text_sub, {color: colors.text}]}> {Data !== null ? (perfil.realname)  : " " }  </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.text_title, {color: colors.text}]}>Nombre</Text>
              <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={25}
                />
                <Text style={[styles.text_sub, {color: colors.text}]}> {Data !== null ? (perfil.firstname)  : " " }  </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.text_title, {color: colors.text}]}>Correo</Text>
              <View style={styles.action}>
                <FontAwesome 
                    name="at"
                    color={colors.text}
                    size={25}
                />
                <Text style={[styles.text_sub, {color: colors.text}]}> {Email} </Text>
              </View>
            </View>
          </ScrollView>  
        </View>


      </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  cardTop: {
    backgroundColor: '#7DC8C1',
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  cardImage: {
    borderRadius: 60,
    borderColor: Colors.white,
    borderWidth: 5,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: "#64A09A", 
  },
  card: {
    flex: 1, 
    //marginVertical: 10,
    backgroundColor: '#7DC8C1',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '100%',
  },
  cardInfo: {
    fontFamily: 'monospace',
    marginVertical: 10,
  },
  cardTitle: {
    alignItems: 'center', 
    justifyContent: 'center',
    fontFamily: 'monospace',
    marginTop: 0,
    backgroundColor: '#7DC8C1',
    borderRadius: 50,
    fontSize: 20,
  },
  textinfo:  {
    alignItems: 'center', 
    justifyContent: 'center',
  },
  text_title: {
    marginBottom: 10,
    color: Colors.text,
    fontSize: 15,
  },
  text_sub: {
    marginLeft: 15,
    color: Colors.text,
    fontFamily: 'monospace',
    fontSize: 15,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
 
});
