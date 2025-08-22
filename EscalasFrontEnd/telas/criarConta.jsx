import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  // Modal de sucesso
  const [modalSucesso, setModalSucesso] = useState(false);

  // Modal de erro
  const [modalErro, setModalErro] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  const mostrarErro = (mensagem) => {
    setErroMensagem(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 1000);
  };

  const mostrarSucesso = () => {
    setModalSucesso(true);
    setTimeout(() => {
      setModalSucesso(false);
      navigation.navigate("Login");
    }, 1000);
  };

  const handleEnviar = async () => {
    if (!nome || !email || !senha || !dataNascimento) {
      mostrarErro("Preencha todos os campos.");
      return;
    }

    // Converte dd/mm/yyyy para yyyy-mm-dd
    let dataFormatada = dataNascimento;
    if (dataNascimento.includes("/")) {
      const [dia, mes, ano] = dataNascimento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    try {
      await axios.post("https://agendas-escalas-iasd-backend.onrender.com/api/usuarios", {
        nome,
        email,
        senha,
        dataNascimento: dataFormatada
      });

      mostrarSucesso();
    } catch (error) {
      console.error(error);
      mostrarErro("Não foi possível criar a conta.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

    <TouchableOpacity
      style={styles.voltarBotao}
      onPress={() => navigation.goBack()}
    >
      <Feather name="arrow-left" size={24} color="#000" />
    </TouchableOpacity>

      <Text style={styles.titulo}>Criar Uma Nova Conta</Text>

      <Text style={styles.label}>NOME</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Sobrenome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>SENHA</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          placeholder="**********"
          secureTextEntry={!senhaVisivel}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          onPress={() => setSenhaVisivel(!senhaVisivel)}
          style={styles.olhoBotao}
        >
          <Feather
            name={senhaVisivel ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>DATA DE NASCIMENTO</Text>
      <MaskedTextInput
        mask="99/99/9999"
        style={styles.input}
        placeholder="dd/mm/aaaa"
        value={dataNascimento}
        onChangeText={(masked) => setDataNascimento(masked)}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
        <Text style={styles.botaoTexto}>ENVIAR</Text>
      </TouchableOpacity>

      {/* Modal de sucesso */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: "#4BB543" }]}>
            <Text style={styles.modalTexto}>Conta criada com sucesso!</Text>
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
    voltarBotao: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#f4f5f2",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f4f5f2",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    fontSize: 16,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f4f5f2",
    borderRadius: 4,
    paddingRight: 10,
    marginBottom: 15,
  },
  olhoBotao: {
    paddingHorizontal: 5,
  },
  botao: {
    backgroundColor: "#344656",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  botaoTexto: {
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
