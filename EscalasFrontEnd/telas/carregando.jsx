import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cores from './estilos/cores';

export default function CarregandoApp({ navigation }) {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const inicio = Date.now(); // Marca o início do carregamento
        const usuarioSalvo = await AsyncStorage.getItem('usuarioLogado');
        const tempoMinimo = 5000; // 5 segundos

        // Calcula quanto tempo se passou
        const tempoDecorrido = Date.now() - inicio;
        const tempoRestante = Math.max(tempoMinimo - tempoDecorrido, 0);

        // Aguarda o tempo restante, se necessário
        setTimeout(() => {
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
        }, tempoRestante);
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        navigation.replace('Login');
      } finally {
        setCarregando(false);
      }
    };

    verificarLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/icone.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Sistema de Escalas</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.FundoDeTela,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: cores.TextoPrincipal,
  },
});
