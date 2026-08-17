import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useCores, useEstilos } from "./estilos/cores";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CriarConta({ navigation }) {
  const cores = useCores();
  const styles = useEstilos(estilosCriarConta);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [igreja, setIgreja] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  

  // Ministérios
  const [ministerios, setMinisterios] = useState([]);
  const [buscaMinisterio, setBuscaMinisterio] = useState("");
  const [ministerioSelecionado, setMinisterioSelecionado] = useState(null);

  // Modal de sucesso
  const [modalSucesso, setModalSucesso] = useState(false);

  // Modal de erro
  const [modalErro, setModalErro] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  // Igrejas
const [igrejas, setIgrejas] = useState([]);
const [buscaIgreja, setBuscaIgreja] = useState("");
const [igrejaSelecionada, setIgrejaSelecionada] = useState(null);


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

  // === Buscar igrejas conforme digita ===
  useEffect(() => {
    async function carregarIgrejas() {
      if (!buscaIgreja) {
        setIgrejas([]);
        return;
      }

      try {
        const res = await fetch(
          `https://agendas-escalas-iasd-backend.onrender.com/api/igrejas?search=${buscaIgreja}`
        );
        if (!res.ok) return;

        const data = await res.json();
        setIgrejas(data);
      } catch (e) {
        console.error("Erro ao buscar igrejas:", e);
      }
    }

    carregarIgrejas();
  }, [buscaIgreja]);


  const handleEnviar = async () => {
    if (!nome || !email || !senha || !buscaIgreja || !dataNascimento) {
      mostrarErro("Preencha todos os campos.");
      return;
    }

    const ministerioFinal = ministerioSelecionado
      ? ministerioSelecionado.ministerio
      : buscaMinisterio;

    if (!ministerioFinal) {
      mostrarErro("Selecione ou digite um ministério.");
      return;
    }

    let dataFormatada = dataNascimento;
    if (dataNascimento.includes("/")) {
      const [dia, mes, ano] = dataNascimento.split("/");
      dataFormatada = `${ano}-${mes}-${dia}`;
    }

    try {
      setCarregando(true);

      console.log({
        nome,
        email,
        senha,
        dataNascimento,
        ministerio: ministerioFinal,
        igreja_id: igrejaSelecionada?.id,
        igreja_nome: buscaIgreja,
      });


      await axios.post(
        "https://agendas-escalas-iasd-backend.onrender.com/api/usuarios",
        {
          nome,
          email,
          senha,
          dataNascimento: dataFormatada,
          ministerio: ministerioFinal,

          // 🔥 IGREJA CORRETA
          igreja_id: igrejaSelecionada ? igrejaSelecionada.id : null,
          igreja_nome: igrejaSelecionada ? null : buscaIgreja,
        }
      );

      mostrarSucesso();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        mostrarErro(error.response.data.error);
      } else {
        mostrarErro("Não foi possível criar a conta.");
      }
    } finally {
      setCarregando(false);
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
        placeholderTextColor={cores.InputPlaceholder}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@gmail.com"
        placeholderTextColor={cores.InputPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>SENHA</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={styles.senhaInput}
          placeholder="**********"
          placeholderTextColor={cores.InputPlaceholder}
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
        placeholderTextColor={cores.InputPlaceholder}
        value={dataNascimento}
        onChangeText={(masked) => setDataNascimento(masked)}
        keyboardType="numeric"
        maxLength={10}
      />

<View>
  <Text style={styles.label}>IGREJA</Text>
  <TextInput
    style={styles.input}
    placeholder="Digite ou pesquise igreja"
    placeholderTextColor={cores.InputPlaceholder}
    value={buscaIgreja}
    onChangeText={(text) => {
      setBuscaIgreja(text);
      setIgrejaSelecionada(null);
    }}
  />

  {igrejas.length > 0 && (
    <FlatList
      data={igrejas}
      keyExtractor={(item) => String(item.id)}
      style={styles.listaSugestoes}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemSugestao}
          onPress={() => {
            setIgrejaSelecionada(item);
            setBuscaIgreja(item.nome);
            setIgrejas([]);
          }}
        >
          <Text style={styles.itemSugestaoTexto}>{item.nome}</Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>




      <Text style={styles.label}>MINISTÉRIO</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite ou pesquise ministério"
        placeholderTextColor={cores.InputPlaceholder}
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
              <Text style={styles.itemSugestaoTexto}>{item.ministerio}</Text>
            </TouchableOpacity>
          )}
        />
      )}

    <TouchableOpacity
      style={[styles.botao, carregando && { opacity: 0.6 }]}
      disabled={carregando}
      onPress={handleEnviar}
    >
      <Text style={styles.botaoTexto}>
        {carregando ? "ENVIANDO..." : "ENVIAR"}
      </Text>
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

function estilosCriarConta(cores) {
  return {
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
    backgroundColor: cores.FundoInput,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 20,
    color: cores.InputTexto,
  },
  listaSugestoes: {
    maxHeight: 100,
    backgroundColor: cores.FundoCard,
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
  itemSugestaoTexto: {
    color: cores.Texto,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: cores.InputBorda,
    backgroundColor: cores.FundoInput,
    borderRadius: 20,
    paddingRight: 10,
    marginBottom: 15,
  },
  senhaInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: cores.InputTexto,
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
  };
}
