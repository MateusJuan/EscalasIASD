import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  async function login() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post("https://agendas-escalas-iasd-backend.onrender.com/api/login", {
        email,
        senha,
      });

      const usuario = response.data;

      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      Alert.alert("Sucesso", `Bem-vindo, ${usuario.nome}!`);

      if (usuario.tipo === "adm") {
        navigation.navigate("InicioAdm", { user: usuario });
      } else {
        navigation.navigate("InicioUsuario", { user: usuario });
      }

    } catch (error) {
      Alert.alert("Erro", "Email ou senha incorretos.");
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <Text style={styles.subtitulo}>Faça login para acessar o aplicativo</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="testes123@gmail.com"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>SENHA</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={styles.senhaInput}
          placeholder="******"
          placeholderTextColor="#aaa"
          secureTextEntry={!senhaVisivel}
          value={senha}
          onChangeText={setSenha}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={() => {
              setSenhaVisivel(!senhaVisivel);
              animarBotao();
            }}
          >
            <Feather
              name={senhaVisivel ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("RecuperarSenha")}
        style={{ alignSelf: "flex-start" }}
      >
        <Text style={styles.esqueciSenha}>ESQUECEU A SENHA?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={login}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("CriarConta")}>
        <Text style={styles.criarConta}>CRIAR CONTA</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    backgroundColor: "#f4f5f2",
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 15,
    color: "#000",
  },
  senhaContainer: {
    borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f5f2",
    borderColor: "#ccc",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  senhaInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    color: "#000",
  },
  esqueciSenha: {
    fontSize: 11,
    color: "#444",
    marginBottom: 25,
  },
  botao: {
    backgroundColor: "#344656",
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  criarConta: {
    marginTop: 20,
    fontSize: 13,
    color: "#222",
    fontWeight: "500",
    letterSpacing: 1,
  },
});
