import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Modal,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "./estilos/cores";
import { SafeAreaView } from "react-native-safe-area-context";

//notificações:
import { obterExpoPushToken } from "./utils/notifications_Push_Token";


export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Modal de sucesso
  const [modalSucesso, setModalSucesso] = useState(false);
  const [usuarioNome, setUsuarioNome] = useState("");

  // Modal de erro
  const [modalErro, setModalErro] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

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

//função login com token de notificação push:
  async function login() {
    if (!email || !senha) {
      mostrarErro("Preencha todos os campos.");
      return;
    }

    try {
      let expo_push_token = null;

        try {
          expo_push_token = await obterExpoPushToken();
        } catch (e) {
          console.log("Erro ao obter push token:", e);
        }


        const response = await axios.post(
          "https://agendas-escalas-iasd-backend.onrender.com/api/login",
          {
            email,
            senha,
            expo_push_token, // pode ir null
          }
        );

      console.log("RESPOSTA LOGIN:", response.data);


      // PEGAR OS DADOS AQUI
      const { token, user: usuario } = response.data;

      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      await AsyncStorage.setItem("token", token);

      setUsuarioNome(usuario.nome);
      setModalSucesso(true);

      setTimeout(() => {
        setModalSucesso(false);

        if (usuario.tipo === "adm") {
          navigation.replace("InicioAdm");
        } else {
          navigation.replace("InicioUsuario");
        }
      }, 2000);

    } catch (error) {
      console.log("ERRO LOGIN:", error);
      mostrarErro("Email ou senha incorretos.");
    }
  }

  const mostrarErro = (mensagem) => {
    setErroMensagem(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <Text style={styles.subtitulo}>Faça login para acessar o aplicativo</Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="testes123@gmail.com"
        placeholderTextColor={cores.InputPlaceholder}
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
          placeholderTextColor={cores.InputPlaceholder}
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
              color={cores.Icones}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("RecuperacaoSenha")}
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

      {/* Modal de sucesso */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: cores.ModalSucesso }]}>
            <Text style={styles.modalTexto}>Bem-vindo(a), {usuarioNome}!</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de erro */}
      <Modal transparent visible={modalErro} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: cores.ModalErro }]}>
            <Text style={styles.modalTexto}>{erroMensagem}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.FundoDeTela,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: cores.Titulo,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.Subtitulo,
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: cores.InputPlaceholder,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    backgroundColor: cores.FundoDeTela,
    borderColor: cores.InputBorda,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 15,
    borderRadius: 20,
    color: cores.Titulo,
  },
  senhaContainer: {
    borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.FundoDeTela,
    borderColor: cores.InputBorda,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 20,
  },
  senhaInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    color: cores.Titulo,
  },
  esqueciSenha: {
    fontSize: 11,
    color: cores.Subtitulo,
    marginBottom: 25,
  },
  botao: {
    backgroundColor: cores.BotaoPadrao,
    padding: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: cores.BotaoTexto,
    fontWeight: "bold",
    fontSize: 16,
  },
  criarConta: {
    marginTop: 20,
    fontSize: 13,
    color: cores.Titulo,
    fontWeight: "500",
    letterSpacing: 1,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: cores.ModalFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.BotaoTexto,
    textAlign: "center",
  },
});
