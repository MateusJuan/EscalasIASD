import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CarregandoApp({ navigation }) {
  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuarioLogado');
        if (usuarioSalvo) {
          const usuario = JSON.parse(usuarioSalvo);
          if (usuario.tipo === 'adm') {
            navigation.replace('InicioAdm', { user: usuario });
          } else {
            navigation.replace('InicioUsuario', { user: usuario });
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        navigation.replace('Login');
      }
    };

    verificarLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/Logo Circular.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text>Sistema De Escalas</Text>
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
