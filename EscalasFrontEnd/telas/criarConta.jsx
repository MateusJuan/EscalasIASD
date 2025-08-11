// telas/CriarConta.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
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

const handleEnviar = async () => {
  if (!nome || !email || !senha || !dataNascimento) {
    Alert.alert("Erro", "Preencha todos os campos.");
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

    navigation.navigate("Login");
  } catch (error) {
    Alert.alert("Erro", "Não foi possível criar a conta.");
    console.error(error);
  }
};


  return (
    <SafeAreaView style={styles.container}>
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
        placeholder="teste@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>SENHA</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          placeholder="******"
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
        onChangeText={(masked, raw) => {
          console.log("masked:", masked, "raw:", raw);
          setDataNascimento(masked);
        }}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
        <Text style={styles.botaoTexto}>ENVIAR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
