import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCores, useEstilos } from "../estilos/cores";

export default function UsuarioInferior({ navigation, route }) {
  const cores = useCores();
  const styles = useEstilos(estilosBarra);
  const user = route?.params?.user;

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("InicioAdm")}
      >
        <MaterialIcons name="home" size={24} color={cores.IconesPadrao} />
        <Text style={styles.footerText}>Início</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("ProgramaCultoAdm", { user })}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="list" size={28} color={cores.IconesPadrao} />
            <View style={styles.badge} />
          </View>
          <Text style={styles.footerText}>Programa do Culto</Text>
        </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AgendaMensalAdm")}
      >
        <MaterialIcons name="calendar-month" size={24} color={cores.IconesPadrao} />
        <Text style={styles.footerText}>Agenda Mensal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("PerfilAdmin")}
      >
        <MaterialIcons name="person" size={24} color={cores.IconesPadrao} />
        <Text style={styles.footerText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

function estilosBarra(cores) {
  return {
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      backgroundColor: cores.Barras,
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
      color: cores.IconesPadrao,
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
      borderColor: cores.Barras,
    },
  };
}
