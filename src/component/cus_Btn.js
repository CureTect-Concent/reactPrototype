import { View, Text, StyleSheet, TouchableOpacity } from "react-native";



function Btn({ative, name, fontSize=20, onPress }){
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={{
          padding:20,
          backgroundColor: ative ? '#0B0B0B' :  "#CECECE" ,
          textAlign:"center",
          color:"white",
          fontSize:fontSize
          }}>{name}</Text>
      </TouchableOpacity>
      
    )
  }
  const styles = StyleSheet.create({
    
  });
  
  
  export default Btn