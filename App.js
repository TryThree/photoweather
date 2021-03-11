import History from './screens/History.js';
import Camera from './screens/Camera.js';
import Editor from './screens/Editor.js';
import Viewer from './screens/Viewer.js';

import {
  Animated,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Alert,
  Share,
  Image,
  ImageBackground,
  Button,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useState,useRef, useEffect } from "react";
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Constants } from 'react-native-unimodules';



//permissions

const requestLocationPermission = async () => {
  try {


    if (Platform.Version < 23) {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log("You can use the gps");
      return true;
    } else {
      console.log("gps permission denied");

    }
  } catch (err) {
    console.warn(err);
  }
  return false;
};

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      return true;
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
        return false;

};



 //home screen function
function HomeScreen({ navigation }) {
  const[loc,setloc]=useState([0,0]);
  const[banner,setbanner]=useState('');

    useEffect(() => {
      requestLocationPermission()
  }, []);
    
   
  return (
    <View style={{ flex: 1, alignItems: 'center',backgroundColor: "#e4dee3", justifyContent: 'center'}}>

       <TouchableOpacity 
        style={styles.buttonone}
        onPress={()=>{navigation.navigate('Camera')}}>

        <Text style={{fontSize:15,fontWeight:"bold",color:Colors.white,textAlign: 'center',justifyContent: "center",alignItems: "center"}}>take a 🌥️📸</Text>
       
       </TouchableOpacity>

           
    </View>
  );
}

const Stack = createStackNavigator();

//main function
function App() {

  const [gpsPerm, setgpsPerm] = useState(0);
  const[loading,setloading] = useState(0);
  const[location,setlocation]=useState([0,0]);
  var myloc;


 

  useEffect(() => {

      if(requestLocationPermission()){
        setgpsPerm(1);
        Geolocation.getCurrentPosition( 
          (position) => {
            console.log(position);
           setlocation([position.coords.latitude,position.coords.longitude]);
              //api key :acbc5118b7e2f8e543cd734267aee9d4
            console.log('myloc :'+location);
          //  alert(JSON.parse(myloc));
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );      
      }
      else{
        alert('please allow gps permission');
      }


  }, []);



 return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerStyle: {
            backgroundColor: '#33b7fb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize:12,            
          },
        }}>
        <>
	        <Stack.Screen name="PhotoWeather" component={HomeScreen} options={ ({ navigation, route })  =>({ 
	          headerRight: () => (
	            <View style={{flex:1,flexDirection:"row",backgroundColor: "#33b7fb"}}>
	             <TouchableOpacity
	              style={{ flex:0.5,alignItems: "center",
	              backgroundColor: "#33b7fb",
	               height:'100%',padding:10}}
	              onPress={() => navigation.navigate('History')}
	             >
	             <Text style={{fontSize:12,fontWeight:"bold",color:Colors.white,textAlign: 'center',justifyContent: "center",alignItems: "center"}}>history</Text>
	             </TouchableOpacity> 
	          </View>
	            
	          ),
	       })
	        }/>
	        <Stack.Screen name="History" component={History} options={ ({ navigation, route })  =>({ 
	          headerRight: () => (<View style={{flex:1,flexDirection:"row",backgroundColor: "#fff"}}></View> )
	          })}/>
	        <Stack.Screen name="Camera" component={Camera} options={ ({ navigation, route })  =>({ 
	          headerRight: () => (<View style={{flex:1,flexDirection:"row",backgroundColor: "#fff"}}></View> )
	          })}/>
	          <Stack.Screen name="Editor" component={Editor} options={ ({ navigation, route })  =>({ 
	          headerRight: () => (<View style={{flex:1,flexDirection:"row",backgroundColor: "#33b7fb"}}>
              <TouchableOpacity
                style={{ flex:0.5,alignItems: "center",
                backgroundColor: "#33b7fb",
                 height:'100%',padding:10}}
                onPress={() => navigation.navigate('History')}
               >
               <Text style={{fontSize:12,fontWeight:"bold",color:Colors.white,textAlign: 'center',justifyContent: "center",alignItems: "center"}}>history</Text>
               </TouchableOpacity></View> )
	          })}/>
             <Stack.Screen name="Viewer" component={Viewer} options={ ({ navigation, route })  =>({ 
            headerRight: () => (<View style={{flex:1,flexDirection:"row",backgroundColor: "#bb2b9b"}}></View> )
            })}/>
               
       </>
        
      </Stack.Navigator>
    </NavigationContainer>
  );



}
const styles = StyleSheet.create({

    buttonone:{ flex:0.2,
                 alignItems: "center",
                 justifyContent:"center",
                 backgroundColor: "#8632f9",
                 height:'100%',
                 padding:10,
                 borderRadius:180,
                 shadowColor: "black",
                 shadowColor: 'rgba(0,0,0, .4)', // IOS
                 shadowOffset: { height: 1, width: 1 }, // IOS
                 shadowOpacity: 10, // IOS
                 shadowRadius: 2, //IOS
                 elevation: 10, // Android

                  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
