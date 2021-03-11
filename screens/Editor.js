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
import ViewShot from "react-native-view-shot";
import CameraRoll from "@react-native-community/cameraroll";
import Shareit from 'react-native-share';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Constants } from 'react-native-unimodules';





const Editor = ({route, navigation }) => {

  //get list of all images passed from Camera
  const[dimensions,setdimensions]=useState([0,0]);
  const [gpsPerm, setgpsPerm] = useState(0);
  const[location,setlocation]=useState([0,0]);
  const[history,sethistory]=useState([{image:'skskkssksksk'}]);
  
  const finalimage = useRef(null);

  const[loc,setloc]=useState([0,0]);
  const[banner,setbanner]=useState('adding current weather');

  var myloc;

  const imageuri = route.params.imageuri; //get the image's uri

      //to run on first time 
     useEffect(() => {
      //calculate image ratio
      Image.getSize(imageuri, (width, height) => {
      let ratio = 0;
      ratio = height/width;
      setdimensions([300,300*ratio]);
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });
      //accessing location details
      getPosition();
      pullData();
    }, []);


     //gets fired after getposition func succesfully updates loc state
     useEffect(()=>{
      getWeatherAsync();
     },[loc]);


//storage functions


const putData= async(x)=> {  

try{
    let newarray = [...history,{ image: x}];
    let stringh = JSON.stringify(newarray);
    AsyncStorage.setItem('history',stringh);  
    console.log('putdata inserted'+stringh);
  }catch(err){
 
    let newarray = [{ image: x}];
    let stringh = JSON.stringify(newarray);
    AsyncStorage.setItem('history',stringh);  
  }

  }  

const pullData = async ()=>{  
    try{  
      let h = await AsyncStorage.getItem('history'); 
      let backtoarray = JSON.parse(h);
      sethistory(backtoarray);
    }  
    catch(error){  
      alert(error)  
    }  

      console.log('displayData exited');
  }       


const savepic =()=>{

  console.log('entered takeapic '+finalimage.current);
  finalimage.current.capture().then(uri => {
       saveCameraRoll(uri);
       shareImage(uri)
    })
};

async function saveCameraRoll(uri) {
  if (!(await hasStoragePermission())) {
    return;
  }

  CameraRoll.save(uri).then(url=>{
    putData(url);
    });
  console.log('saved in camera roll');
};


const shareImage = async (uri) => {
    const shareOptions = {
      title: 'Share file',
      url: uri,
      failOnCancel: false,
    };

    try {
        console.log('before sharing uri is '+imageuri);

      const ShareResponse = await Shareit.open(shareOptions);
      console.log('shared successfully');
    } catch (error) {
      console.log('Error =>', error);
      console.log('error happened');

    }
  };

//handling permissions
async function hasStoragePermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

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

//getting gps coordinates

  const getPosition= async ()=>{

        if(requestLocationPermission()){
              Geolocation.getCurrentPosition((position) => {
                 setloc([position.coords.latitude,position.coords.longitude]);
                },
                (error) => {
                  console.log(error.code, error.message);  
                  alert('oops there seems to be an error with your GPS');
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              );
            }
            else{
              alert('please allow gps permission');
            }
  }   

//getting city name/weather data and info from api
 const getWeatherAsync = async () => {

  if(loc[0]!=0){
  try {
    let response = await fetch(
      'http://api.openweathermap.org/geo/1.0/reverse?lat='+loc[0]+'&lon='+loc[1]+'&limit=5&appid=acbc5118b7e2f8e543cd734267aee9d4'
    );
    let json = await response.json();
 

    let response2 = await fetch(
      'http://api.openweathermap.org/data/2.5/onecall?lat='+loc[0]+'&lon='+loc[1]+'&units=metric&exclude=hourly,daily,minutely&appid=acbc5118b7e2f8e543cd734267aee9d4'
    );
    let json1 = await response2.json();
    let weather=Math.floor(json1.current.weather[0].id/100);
    let message='';
    switch(weather) {
      case 2:
      message+='🌩️';
      break;
      case 3:
    message+='🌧️';
    break;
      case 5:
    message+='🌧️';
    break;
      case 6:
      message+='❄️';
      break;
      case 7:
      message+='unclear visibility';
      break;
      case 8:
      (json1.current.weather[0].id%100==0)?message+='☀️':message+='☁️';
      break;

    default:
    message+='🌤️';
  } 
  message +=' '+json1.current.temp+'c in '+json[0].name+' ';
  setbanner(message);
  } catch (error) {
    console.error(error);alert(' oops found an error please make sure your GPS is enabled');

  }
}else{
console.log('entered else due to state update delay');
}

};

   
  return (
    <>
    {/*<StatusBar barStyle="dark-content"/>*/}
  
  <View style={{flex:1}}>
        <View style={{flex:10, backgroundColor:'#ef3930'}}>       
            <View style={{flex:1, backgroundColor:'#ef3930'}}>
              <View style={{flex:10,flexDirection:'row',backgroundColor:Colors.black}}>
                  <View style={{flex:1,backgroundColor:'#e3e2e0'}}/>

                  <View style={{flex:25,backgroundColor:'#e3e2e0',justifyContent:'center',alignItems: "center"}}>
                  <ViewShot ref={finalimage}>
                    <ImageBackground style={{width:dimensions[0],height:dimensions[1],justifyContent:'center',}}source={{uri:imageuri}}>
                    <View style={{flex:0.1,justifyContent:'center',backgroundColor:Colors.white,opacity:0.4}}>                   
                     <Text>{banner}</Text>
                    </View>
                   </ImageBackground>
                  </ViewShot>
                  <View style={{flex:1,justifyContent: "flex-end",alignItems: "center"}}>
                   <TouchableOpacity 
                    style={styles.buttonone}
                    onPress={()=>{savepic();}
                    }>
                    <Text style={{fontSize:13,fontWeight:"bold",color:Colors.white,textAlign: 'center',justifyContent: "flex-end",alignItems: "center"}}>Save&Share</Text>
                    </TouchableOpacity>
                  </View>
                  </View>
                  <View style={{flex:1,backgroundColor:'#e3e2e0'}}/>
              </View>
            </View>
        </View>
  </View>
    </>
);

}
const styles = StyleSheet.create({

    buttonone:{ 
                 alignItems: "center",
                 backgroundColor: "#bb2b9b",
                 height:50,
                 width:120,
                 padding:10,
                 borderRadius:10,
                 shadowColor: 'rgba(0,0,0, .4)', // IOS
                 shadowOffset: { height: 1, width: 1 }, // IOS
                 shadowOpacity: 1, // IOS
                 shadowRadius: 1, //IOS
                 elevation: 5, // Android

                  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    padding: 5,
    width: '70%',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    margin: 5,
    padding: 5,
    width: '70%',
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Editor;
