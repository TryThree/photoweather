import Viewer from './Viewer.js';
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
  PermissionsAndroid
} from 'react-native';
import { useState,useRef, useEffect } from "react";
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Constants } from 'react-native-unimodules';



const DATA = [
  {
    image: 'https://yt3.ggpht.com/ytc/AAUvwnj66xyzs2msrT_hkR22Ny5FiAdT-61Xg5m9vKWQVQ=s176-c-k-c0x00ffffff-no-rj'
  },
  {
    image: 'https://static.scientificamerican.com/sciam/cache/file/F7655C45-CDB1-42B6-BEF47A6B248A8801_source.jpg?w=590&h=800&DE6B0AA4-070C-4E58-8B1862CFC6DC751E'
  },
  {
    image:'file:///data/user/0/com.photoweather/cache/Camera/3cc9ce27-0243-4837-94fe-a27da88f40b1.jpg'
  }
  
];


const History = ({ navigation }) => {

  const[history,sethistory]=useState([]);

     
    //to run first time
    useEffect(() => {
   
    pullData();

    }, []);


  //storage functions
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

 const retrieveData = async ()=>{  
    try{  
      let lastimage = await AsyncStorage.getItem('last image');  
      //alert(user);  
      alert(lastimage);
      //return lastimage;
    }  
    catch(error){  
      alert(error)  
    }  
      console.log('displayData exited');
  }  
 const renderItem = ({item}) =>
  {

  // if(item.image[0]=='c'){ to check if url starts with content
    return (
      <View style={{flex:1,alignItems:'center',justifycontent:'center',marginVertical: 4,height: 100}}>
       
            <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('Viewer',{imageuri: item.image})}}>
            <Image style={{width:100,height:100,resizeMode: "stretch",}} source={{uri:item.image}} />
            </TouchableOpacity>
          
      </View>
    );
    //}
  
  };

  return (
    <>
    {/*<StatusBar barStyle="dark-content"/>*/}
  
  <View style={{flex:1}}>
        <View style={{flex:10, backgroundColor:'#ef3930'}}>       
            <View style={{flex:1, backgroundColor:'#cccccc'}}>
              <View style={{flex:10,flexDirection:'row',backgroundColor:Colors.black}}>
                  <View style={{flex:1,backgroundColor:'#cccccc'}}/>

                  <View style={{flex:25,backgroundColor:'#cccccc',justifyContent:'center'}}>
                  <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                  </View>
                  <View style={{flex:1,backgroundColor:'#cccccc'}}/>
              </View>
            </View>
        </View>
  </View>
    </>
);

}
const styles = StyleSheet.create({
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
    
    borderColor: '#000000',
    margin: 0,
    padding: 0,
    width: 100,
    height:100,
    alignItems:'center',
    justifyContent:'center',
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

export default History;
