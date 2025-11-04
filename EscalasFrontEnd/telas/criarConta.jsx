import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import cores from "./estilos/cores";

export default function CriarConta({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [igreja, setIgreja] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  // Ministérios
  const [ministerios, setMinisterios] = useState([]);
  const [buscaMinisterio, setBuscaMinisterio] = useState("");
  const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

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

  // === Buscar ministérios conforme digita ===
  useEffect(() => {
    async function carregarMinisterios() {
      if (!buscaMinisterio) {
        setMinisterios([]);
        return;
      }
      try {
        const res = await fetch(
          `https://agendas-escalas-iasd-backend.onrender.com/api/ministerios?search=${buscaMinisterio}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setMinisterios(data);
      } catch (e) {
        console.error("Erro ao buscar ministérios:", e);
      }
    }
    carregarMinisterios();
  }, [buscaMinisterio]);

  const handleEnviar = async () => {
    if (!nome || !email || !senha || !igreja || !dataNascimento) {
      mostrarErro("Preencha todos os campos.");
      return;
    }

    // Decide qual ministério salvar
    const ministerioFinal = ministerioSelecionado
      ? ministerioSelecionado.ministerio
      : buscaMinisterio;

    if (!ministerioFinal) {
      mostrarErro("Selecione ou digite um ministério.");
      return;
    }

    // Converte dd/mm/yyyy para yyyy-mm-dd
    let dataFormatada = dataNascimento;
    if (dataNascimento.includes("/")) {
      const [dia, mes, ano] = dataNascimento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    try {
      await axios.post(
        "https://agendas-escalas-iasd-backend.onrender.com/api/usuarios",
        {
          nome,
          email,
          senha,
          igreja,
          dataNascimento: dataFormatada,
          ministerio: ministerioFinal,
        }
      );

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
        <Feather name="arrow-left" size={24} color={cores.Titulo} />
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
            color={cores.Icones}
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

      <Text style={styles.label}>IGREJA</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Igreja"
        value={igreja}
        onChangeText={setIgreja}
      />

      <Text style={styles.label}>MINISTÉRIO</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite ou pesquise ministério"
        value={buscaMinisterio}
        onChangeText={(text) => {
          setBuscaMinisterio(text);
          setMinisterioSelecionado(null); // limpa seleção ao digitar
        }}
      />
      {ministerios.length > 0 && (
        <FlatList
          data={ministerios}
          keyExtractor={(item, index) => index.toString()}
          style={styles.listaSugestoes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemSugestao}
              onPress={() => {
                setMinisterioSelecionado(item);
                setBuscaMinisterio(item.ministerio);
                setMinisterios([]);
              }}
            >
              <Text>{item.ministerio}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
        <Text style={styles.botaoTexto}>ENVIAR</Text>
      </TouchableOpacity>

      {/* Modal de sucesso */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: cores.ModalSucesso }]}>
            <Text style={styles.modalTexto}>Conta criada com sucesso!</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de erro */}
      <Modal transparent visible={modalErro} animationType="fade">
        <View style={styles.modalFundo}>
          <View style={[styles.modalContainer, { backgroundColor: cores.ModalErro}]}>
            <Text style={styles.modalTexto}>{erroMensagem}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  voltarBotao: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: cores.FundoDeTela,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: cores.Titulo,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: cores.InputPlaceholder,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.InputBorda,
    backgroundColor: cores.FundoDeTela,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 20,
  },
  listaSugestoes: {
    maxHeight: 100,
    backgroundColor: cores.FundoDeTela,
    borderWidth: 1,
    borderColor: cores.InputBorda,
    marginBottom: 15,
    borderRadius: 20,
  },
  itemSugestao: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.ListasBordas,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.InputBorda,
    backgroundColor: cores.FundoDeTela,
    borderRadius: 20,
    paddingRight: 10,
    marginBottom: 15,
  },
  olhoBotao: {
    paddingHorizontal: 5,
  },
  botao: {
    backgroundColor: cores.BotaoPadrao,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  botaoTexto: {
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
    fontSize: 18,
    fontWeight: "bold",
    color: cores.BotaoTexto,
    textAlign: "center",
  },
});
