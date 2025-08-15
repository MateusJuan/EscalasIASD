import { StyleSheet, Text, View, Animated, Easing, useEffect } from "react-native";
import { useRef, useEffect as useEf } from "react";
import AdmInferior from "../barras/adminferior";
export default function AgendaMensalAdm({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // valor inicial de opacidade

  useEf(() => {
    // animação de loop
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
        <Text>Nesta Tela será exibida a Agenda Mensal da Igreja</Text>
        {/* Texto animado */}
        <Animated.Text style={[styles.animText, { opacity: fadeAnim }]}>
          Tela em Desenvolvimento...
        </Animated.Text>
      </View>

      {/* RODAPÉ */}
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
  animText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff5555",
  },
});
