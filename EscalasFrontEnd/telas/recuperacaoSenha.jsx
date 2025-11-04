import axios from "axios";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import cores from "./estilos/cores";

export default function RecuperacaoSenha({ navigation }) {
  const [email, setEmail] = useState("");

  // Modais
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  const enviarRecuperacao = async () => {
    if (!email) {
      mostrarErro("Por favor, informe seu e-mail.");
      return;
    }

    try {
      await axios.post(
        "https://agendas-escalas-iasd-backend.onrender.com/api/resetar-senha",
        { email }
      );

      // Exibe modal de sucesso
      setModalSucesso(true);

      setTimeout(() => {
        setModalSucesso(false);
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar recuperação de senha:", error);
      const errorMsg =
        error?.response?.data?.error || "Erro ao enviar a nova senha.";
      mostrarErro(errorMsg);
    }
  };

  const mostrarErro = (mensagem) => {
    setErroMensagem(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={styles.voltarBotao}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color={cores.Titulo} />
      </TouchableOpacity>

      <Text style={styles.titulo}>Recuperar Senha</Text>
      <Text style={styles.subtitulo}>
        Digite seu e-mail para receber uma nova senha
      </Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@gmail.com"
        placeholderTextColor={cores.InputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.botao} onPress={enviarRecuperacao}>
        <Text style={styles.textoBotao}>Enviar Nova Senha</Text>
      </TouchableOpacity>

      {/* Modal de sucesso */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: cores.ModalSucesso }]}>
            <Text style={styles.modalTexto}>
              Uma nova senha foi enviada para seu e-mail!
            </Text>
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
  voltarBotao: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: cores.FundoDeTela,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 26,
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
    color: cores.InputTexto,
  },
  botao: {
    backgroundColor: cores.BotaoPadrao,
    paddingVertical: 14,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  textoBotao: {
    color: cores.BotaoTexto,
    fontWeight: "bold",
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "bold",
    color: cores.BotaoTexto,
    textAlign: "center",
  },
});
