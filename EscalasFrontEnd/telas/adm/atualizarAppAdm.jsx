import { Text, View, Animated, Easing, Linking, TouchableOpacity } from "react-native";
import { useRef, useEffect } from "react";
import AdmInferior from "../barras/adminferior";
import { useCores, useEstilos } from "../estilos/cores";

export default function AgendaMensalUsuario({ navigation }) {
  const cores = useCores();
  const styles = useEstilos(estilosAtualizar);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const linkAPK =
    "https://github.com/MateusJuan/EscalasIASD/releases/download/V1.1/application-5a697761-d204-4f81-bca2-26a4ccefa696.apk";

  const baixarAPK = () => {
    Linking.openURL(linkAPK);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: cores.FundoDeTela }}>
      <View style={styles.container}>
        <Text style={styles.title}>📥 Atualização Disponível</Text>
        <Animated.Text style={[styles.animText, { opacity: fadeAnim }]}>
          Versão do dia 07/01/2026
        </Animated.Text>

        <TouchableOpacity style={styles.button} onPress={baixarAPK}>
          <Text style={styles.buttonText}>Baixar APK</Text>
        </TouchableOpacity>
      </View>
      <AdmInferior navigation={navigation} />
    </View>
  );
}

function estilosAtualizar(cores) {
  return {
    container: {
      flex: 1,
      backgroundColor: cores.FundoDeTela,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: cores.Titulo,
      marginBottom: 15,
      textAlign: "center",
    },
    animText: {
      fontSize: 16,
      fontWeight: "600",
      color: cores.ModalErro,
      marginBottom: 25,
    },
    button: {
      backgroundColor: cores.BotaoPadrao,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    buttonText: {
      color: cores.BotaoTexto,
      fontSize: 16,
      fontWeight: "600",
    },
  };
}
