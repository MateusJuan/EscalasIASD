import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function CarregandoApp({navigation}) {
  useEffect(()=>{
    const timer = setTimeout(()=>{
      navigation.replace("Login")
    },3000);

    return()=> clearTimeout(timer);
  },[navigation]);
  return (
    <View style={styles.container}>
      <Image
        source={require('../img/Logo Circular.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text>IASD JARDIM COQUEIRAL</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
