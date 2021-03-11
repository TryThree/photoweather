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
import Share from 'react-native-share';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Constants } from 'react-native-unimodules';





const Viewer = ({route, navigation }) => {

  //get list of all images passed from Camera
  const[dimensions,setdimensions]=useState([0,0]);
  //const [result, setResult] = useState<string>('');
  
  const finalimage = useRef(null);

  const imageuri = route.params.imageuri; //get the image's uri passed from history.js

     useEffect(() => {
      //calculate image ratio
      Image.getSize(imageuri, (width, height) => {
      let ratio = 0;
      console.log('ratio='+ratio);
      console.log('manual ratio='+height/width);

      ratio = height/width;

      setdimensions([300,300*ratio]);
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });
     
    }, []);


   


  //share
const shareSingleImage = async () => {
    const shareOptions = {
      title: 'Share file',
      url: imageuri,
      failOnCancel: false,
    };

    try {
        console.log('before sharing uri is '+imageuri);

      const ShareResponse = await Share.open(shareOptions);
      //setResult(JSON.stringify(ShareResponse, null, 2));
      console.log('shared successfully');
    } catch (error) {
      console.log('Error =>', error);
     // setResult('error: '.concat(getErrorString(error)));
      console.log('error happened');

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
                    <ImageBackground style={{width:dimensions[0],height:dimensions[1],justifyContent:'center',}}source={{uri:imageuri}}>
                   </ImageBackground>
                  
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
                 width:100,
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

export default Viewer;
