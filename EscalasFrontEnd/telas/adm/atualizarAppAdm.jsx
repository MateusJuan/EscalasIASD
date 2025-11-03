import { StyleSheet, Text, View, Animated, Easing, Linking, TouchableOpacity } from "react-native";
import { useRef, useEffect } from "react";
import AdmInferior from "../barras/adminferior";

export default function AgendaMensalUsuario({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const linkAPK =
    "https://github.com/MateusJuan/EscalasIASD/releases/download/v1.0/application-eb0f9aa2-5959-47d0-bde4-7e4b09a4ab40.apk";

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
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>📥 Atualização Disponível</Text>
        <Animated.Text style={[styles.animText, { opacity: fadeAnim }]}>
          Versão do dia 03/11/2025
        </Animated.Text>

        <TouchableOpacity style={styles.button} onPress={baixarAPK}>
          <Text style={styles.buttonText}>Baixar APK</Text>
        </TouchableOpacity>
      </View>
      <AdmInferior navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  animText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff5555",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 2, // sombra no Android
    shadowColor: "#000", // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
