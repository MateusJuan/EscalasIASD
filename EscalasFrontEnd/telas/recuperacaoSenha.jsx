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
      <Text style={styles.titulo}>Recuperar Senha</Text>
      <Text style={styles.subtitulo}>
        Digite seu e-mail para receber uma nova senha
      </Text>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@gmail.com"
        placeholderTextColor="#aaa"
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
          <View style={[styles.modalContainer, { backgroundColor: "#4BB543" }]}>
            <Text style={styles.modalTexto}>
              Uma nova senha foi enviada para seu e-mail!
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal de erro */}
      <Modal transparent visible={modalErro} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: "#FF4C4C" }]}>
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
    backgroundColor: "#f4f5f2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 26,
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
  botao: {
    backgroundColor: "#344656",
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    color: "#fff",
    textAlign: "center",
  },
});
