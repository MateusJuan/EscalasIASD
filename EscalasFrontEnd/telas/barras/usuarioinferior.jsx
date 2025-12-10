import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const linkAPK = "https://github.com/MateusJuan/EscalasIASD/releases/download/v1.0/application-c46658a1-c0f8-4a18-aa77-b68e81aab1fb.apk"

export default function UsuarioInferior({ navigation }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("InicioUsuario")}
      >
        <MaterialIcons name="home" size={24} color="#fff" />
        <Text style={styles.footerText}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AgendaMensalUsuario")}
      >
        <MaterialIcons name="calendar-month" size={24} color="#fff" />
        <Text style={styles.footerText}>Escalas do Mês</Text>
      </TouchableOpacity>

      {/* Botão de atualização com badge corretamente posicionado */}
      {/*<TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AtualizarAppUsuario")}
      >
        <View style={styles.iconWrapper}>
          <MaterialIcons name="update" size={28} color="#fff" />
          <View style={styles.badge} />
        </View>
        <Text style={styles.footerText}>Atualizar App</Text>
      </TouchableOpacity>*/}

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Perfil")}
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
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#30ff3aff",
    borderWidth: 1,
    borderColor: "#2e3e4e",
  },
});
