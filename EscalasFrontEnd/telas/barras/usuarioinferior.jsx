import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usuarioEscaladoHoje } from "../utils/escaladoHoje";
import { useCores, useEstilos } from "../estilos/cores";

export default function UsuarioInferior({ navigation, route }) {
  const cores = useCores();
  const styles = useEstilos(estilosBarra);
  const user = route?.params?.user;
  const [mostrarPrograma, setMostrarPrograma] = useState(false);

  useEffect(() => {
    let ativo = true;
    usuarioEscaladoHoje().then((escalado) => {
      if (ativo) setMostrarPrograma(!!escalado);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("InicioUsuario")}
      >
        <MaterialIcons name="home" size={24} color={cores.IconesPadrao} />
        <Text style={styles.footerText}>Início</Text>
      </TouchableOpacity>

      {mostrarPrograma && (
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("ProgramaCulto", { user })}
        >
          <View style={styles.iconWrapper}>
            <MaterialIcons name="list" size={28} color={cores.IconesPadrao} />
            <View style={styles.badge} />
          </View>
          <Text style={styles.footerText}>Programa do Culto</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("AgendaMensalUsuario")}
      >
        <MaterialIcons name="calendar-month" size={24} color={cores.IconesPadrao} />
        <Text style={styles.footerText}>Escalas do Mês</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Perfil")}
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
