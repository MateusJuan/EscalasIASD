import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdmInferior({ navigation, route }) {
  const user = route?.params?.user;

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("InicioAdm")}
      >
        <MaterialIcons name="home" size={24} color="#fff" />
        <Text style={styles.footerText}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AgendaMensalAdm")}
      >
        <MaterialIcons name="calendar-month" size={24} color="#fff" />
        <Text style={styles.footerText}>Agenda Mensal</Text>
      </TouchableOpacity>

      {/* Botão de atualização com badge corretamente posicionado */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AtualizarAppAdm")}
      >
        <View style={styles.iconWrapper}>
          <MaterialIcons name="update" size={28} color="#fff" />
          <View style={styles.badge} />
        </View>
        <Text style={styles.footerText}>Atualizar App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("PerfilAdmin")}
      >
        <MaterialIcons name="person" size={24} color="#fff" />
        <Text style={styles.footerText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#2e3e4e",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
  iconWrapper: {
    position: "relative", // necessário para posicionar o badge corretamente
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#30ff3aff", // vermelho chamativo
    borderWidth: 1,
    borderColor: "#2e3e4e", // cor do fundo do footer
  },
});