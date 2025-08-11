import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AdmInferior from "../barras/adminferior";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InicioAdm({ navigation, route }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [escalas, setEscalas] = useState(null);
  const [search, setSearch] = useState("");

  // Modal - campos usados para adicionar/editar escala
  const [modalVisible, setModalVisible] = useState(false);
  const [novaData, setNovaData] = useState("");
  const [novoMinisterio, setNovoMinisterio] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [buscaUsuario, setBuscaUsuario] = useState("");

  // Estado para escala selecionada para edição
  const [escalaSelecionada, setEscalaSelecionada] = useState(null);

  function parseDataBR(dataStr) {
    const [dia, mes, ano] = dataStr.split("/");
    return new Date(ano, mes - 1, dia);
  }

  // Carrega usuário logado no AsyncStorage se não vier via rota
  useEffect(() => {
    async function loadUser() {
      if (!user) {
        try {
          const jsonValue = await AsyncStorage.getItem("usuarioLogado");
          if (jsonValue != null) {
            setUser(JSON.parse(jsonValue));
          } else {
            Alert.alert("Usuário não encontrado", "Faça login novamente.");
            navigation.navigate("Login");
          }
        } catch (e) {
          Alert.alert("Erro", "Falha ao carregar usuário.");
          navigation.navigate("Login");
        }
      }
    }
    loadUser();
  }, []);

  // Carrega escalas do backend sempre que modal é fechado (para atualizar lista)
  useEffect(() => {
    async function carregarEscalas() {
      try {
        const res = await fetch(
          "https://agendas-escalas-iasd-backend.onrender.com/api/escalas"
        );
        const data = await res.json();
        const escalasComData = data.map((e) => ({
          ...e,
          data: parseDataBR(e.data),
        }));
        setEscalas(escalasComData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as escalas.");
        setEscalas([]);
      }
    }
    carregarEscalas();
  }, [modalVisible]);

  // Carrega lista de usuários para selecionar ao adicionar/editar escala
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const res = await fetch(
          "https://agendas-escalas-iasd-backend.onrender.com/api/usuarios"
        );
        const data = await res.json();
        setUsuarios(data);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os usuários.");
      }
    }
    carregarUsuarios();
  }, []);

  // Função para adicionar nova escala (POST)
  async function adicionarEscala() {
    if (!novaData || !usuarioSelecionado || !novoMinisterio) {
      Alert.alert("Erro", "Preencha todos os campos e selecione um usuário.");
      return;
    }

    try {
      const res = await fetch(
        "https://agendas-escalas-iasd-backend.onrender.com/api/escalas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: novaData,
            ministerio: novoMinisterio,
            pessoa_id: usuarioSelecionado.id,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Sucesso", "Escala adicionada com sucesso!");
        fecharModal();
      } else {
        Alert.alert("Erro", result.error || "Falha ao adicionar escala.");
      }
    } catch (e) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  }

  // Função para abrir modal para editar escala
  function abrirEditarEscala(escala) {
    setEscalaSelecionada(escala);
    setNovaData(escala.data.toLocaleDateString("pt-BR"));
    setNovoMinisterio(escala.ministerio);
    const usuario = usuarios.find((u) => u.id === escala.pessoa_id) || null;
    setUsuarioSelecionado(usuario);
    setBuscaUsuario(usuario?.nome || "");
    setModalVisible(true);
  }

  // Função para atualizar escala (PUT)
  async function atualizarEscala() {
    if (!novaData || !usuarioSelecionado || !novoMinisterio) {
      Alert.alert("Erro", "Preencha todos os campos e selecione um usuário.");
      return;
    }
    if (!escalaSelecionada) return;

    try {
      const res = await fetch(
        `https://agendas-escalas-iasd-backend.onrender.com/api/escalas/${escalaSelecionada.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: novaData,
            ministerio: novoMinisterio,
            pessoa_id: usuarioSelecionado.id,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Sucesso", "Escala atualizada com sucesso!");
        fecharModal();
      } else {
        Alert.alert("Erro", result.error || "Falha ao atualizar escala.");
      }
    } catch (e) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  }

  // Função para excluir escala (DELETE)
  async function deletarEscala() {
    if (!escalaSelecionada) return;

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta escala?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `https://agendas-escalas-iasd-backend.onrender.com/api/escalas/${escalaSelecionada.id}`,
                {
                  method: "DELETE",
                }
              );
              const result = await res.json();

              if (res.ok) {
                Alert.alert("Sucesso", "Escala excluída com sucesso!");
                fecharModal();
              } else {
                Alert.alert("Erro", result.error || "Falha ao excluir escala.");
              }
            } catch {
              Alert.alert("Erro", "Erro ao conectar com o servidor.");
            }
          },
        },
      ]
    );
  }

  // Função para fechar modal e limpar estados
  function fecharModal() {
    setModalVisible(false);
    setNovaData("");
    setNovoMinisterio("");
    setBuscaUsuario("");
    setUsuarioSelecionado(null);
    setEscalaSelecionada(null);
  }

  if (!user || !user.id) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 50, textAlign: "center" }}>
          Usuário não encontrado. Por favor, faça login novamente.
        </Text>
      </View>
    );
  }

  if (escalas === null) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2e3e4e" />
      </View>
    );
  }

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const escalasUsuarioMes = escalas.filter(
    (e) =>
      e.pessoa_id === user.id &&
      e.data.getMonth() === mesAtual &&
      e.data.getFullYear() === anoAtual
  );

  const futuras = escalasUsuarioMes.filter((e) => e.data >= hoje);
  futuras.sort((a, b) => a.data - b.data);
  const proxima = futuras[0] || escalasUsuarioMes[0] || null;

  const escalasGeralMes = escalas.filter(
    (e) => e.data.getMonth() === mesAtual && e.data.getFullYear() === anoAtual
  );

  // Filtra escalas do usuário pelo ministério usando search
  const escalasFiltradas = escalasUsuarioMes.filter((e) =>
    e.ministerio.toLowerCase().includes(search.toLowerCase())
  );

  // Filtra escalas gerais pelo nome da pessoa usando search
  const escalasGeralFiltradas = escalasGeralMes.filter((e) =>
    e.pessoa_nome.toLowerCase().includes(search.toLowerCase())
  );

  // Ordena as listas filtradas pela data
  escalasFiltradas.sort((a, b) => a.data.getDate() - b.data.getDate());
  escalasGeralFiltradas.sort((a, b) => a.data.getDate() - b.data.getDate());

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <Image
          source={require("../../img/Logo Circular.png")}
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={16}
            color="#6c6c6c"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Pesquisar ministério ou nome"
            placeholderTextColor="#6c6c6c"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* CONTEÚDO COM SCROLL */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* CARD COM PRÓXIMA ESCALA */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardItem}>
              <MaterialIcons name="calendar-month" size={24} color="#fff" />
              <View style={styles.cardItemText}>
                <Text style={styles.cardTitle}>Próximo Dia Escalado</Text>
                <Text style={styles.cardDate}>
                  {proxima ? proxima.data.toLocaleDateString("pt-BR") : "-"}
                </Text>
              </View>
            </View>
            <View style={styles.cardItem}>
              <MaterialIcons name="church" size={24} color="#fff" />
              <View style={styles.cardItemText}>
                <Text style={styles.cardTitle}>Ministério</Text>
                <Text style={styles.cardDate}>
                  {proxima ? proxima.ministerio : "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MINHA ESCALA MENSAL */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 15,
            marginTop: 20,
          }}
        >
          <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>
        </View>
        <View style={[styles.tabela, { maxHeight: 200 }]}>
          <View style={styles.tabelaLinhaHeader}>
            <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
            <Text style={styles.tabelaHeaderTexto}>DIA</Text>
            <Text style={styles.tabelaHeaderTexto}>MINISTÉRIO</Text>
          </View>
          {escalasFiltradas.length === 0 ? (
            <Text style={{ padding: 8, textAlign: "center" }}>
              Nenhuma escala encontrada.
            </Text>
          ) : (
            escalasFiltradas.map((item, index) => {
              const dataObj = item.data;
              const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });
              const dia = dataObj.getDate();
              return (
                <View key={index} style={styles.tabelaLinha}>
                  <Text style={styles.tabelaTexto}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </Text>
                  <Text style={styles.tabelaTexto}>{dia}</Text>
                  <Text style={styles.tabelaTexto}>{item.ministerio}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* ESCALA GERAL DO MÊS + BOTÃO */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 15,
            marginTop: 20,
          }}
        >
          <Text style={styles.escalaTexto}>Escala Geral do Mês:</Text>
          <MaterialIcons
            name="add-circle"
            size={24}
            color="#2e3e4e"
            style={{ marginLeft: 8 }}
            onPress={() => {
              // Limpa estados para adicionar nova escala
              setEscalaSelecionada(null);
              setNovaData("");
              setNovoMinisterio("");
              setBuscaUsuario("");
              setUsuarioSelecionado(null);
              setModalVisible(true);
            }}
          />
        </View>
        <View style={styles.tabela}>
          <View style={styles.tabelaLinhaHeader}>
            <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>MÊS</Text>
            <Text style={[styles.tabelaHeaderTexto, { flex: 1 }]}>DIA</Text>
            <Text style={[styles.tabelaHeaderTexto, { flex: 2 }]}>PESSOA</Text>
            <Text style={[styles.tabelaHeaderTexto, { flex: 0.5 }]}>Editar</Text>
          </View>
          {escalasGeralFiltradas.length === 0 && (
            <Text style={{ padding: 8, textAlign: "center" }}>
              Nenhuma escala encontrada.
            </Text>
          )}
          {escalasGeralFiltradas.map((item, index) => {
            const dataObj = item.data;
            const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });
            const dia = dataObj.getDate();
            return (
              <View
                key={index}
                style={[
                  styles.tabelaLinha,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>
                  {mes.charAt(0).toUpperCase() + mes.slice(1)}
                </Text>
                <Text style={[styles.tabelaTexto, { flex: 1 }]}>{dia}</Text>
                <Text style={[styles.tabelaTexto, { flex: 2 }]}>
                  {item.pessoa_nome}
                </Text>
                <TouchableOpacity
                  onPress={() => abrirEditarEscala(item)}
                  style={{ flex: 0.5, alignItems: "center" }}
                >
                  <MaterialIcons name="edit" size={20} color="#2e3e4e" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* MODAL ADICIONAR/EDITAR ESCALA */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
            >
              {escalaSelecionada ? "Editar Escala" : "Adicionar Escala"}
            </Text>

            <Text>Data (dd/mm/aaaa):</Text>
            <TextInput
              value={novaData}
              onChangeText={setNovaData}
              placeholder="Ex: 02/10/2025"
              style={styles.modalInput}
            />

            <Text>Nome do Usuário:</Text>
            <TextInput
              value={buscaUsuario}
              onChangeText={(text) => {
                setBuscaUsuario(text);
                setUsuarioSelecionado(null);
              }}
              placeholder="Digite o nome"
              style={styles.modalInput}
            />

            {/* Lista de sugestões enquanto digita */}
            {buscaUsuario.length > 0 && !usuarioSelecionado && (
              <ScrollView
                style={{
                  maxHeight: 100,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  backgroundColor: "#f9f9f9",
                }}
              >
                {usuarios
                  .filter((u) =>
                    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase())
                  )
                  .map((u) => (
                    <TouchableOpacity
                      key={u.id}
                      onPress={() => {
                        setUsuarioSelecionado(u);
                        setBuscaUsuario(u.nome);
                      }}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ddd",
                      }}
                    >
                      <Text>{u.nome}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}

            <Text>Ministério:</Text>
            <TextInput
              value={novoMinisterio}
              onChangeText={setNovoMinisterio}
              placeholder="Ex: Sonoplastia"
              style={styles.modalInput}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <Text
                style={{ color: "#d00", fontWeight: "bold" }}
                onPress={fecharModal}
              >
                Cancelar
              </Text>

              {escalaSelecionada ? (
                <>
                  <Text
                    style={{ color: "#007aff", fontWeight: "bold" }}
                    onPress={atualizarEscala}
                  >
                    Salvar
                  </Text>
                  <Text
                    style={{ color: "#d00", fontWeight: "bold" }}
                    onPress={deletarEscala}
                  >
                    Excluir
                  </Text>
                </>
              ) : (
                <Text
                  style={{ color: "#007aff", fontWeight: "bold" }}
                  onPress={adicionarEscala}
                >
                  Salvar
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* BARRA INFERIOR */}
      <AdmInferior navigation={navigation} user={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#2e3e4e",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  searchContainer: {
    flex: 1,
    marginLeft: 15,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    top: 12,
    left: 8,
    zIndex: 1,
  },
  input: {
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingLeft: 30,
    fontSize: 14,
    color: "#000",
  },
  cardContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#2e3e4e",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardItemText: {
    marginLeft: 8,
  },
  cardTitle: {
    color: "#bbb",
    fontSize: 14,
  },
  cardDate: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  escalaTexto: {
    fontWeight: "bold",
    fontSize: 18,
  },
  tabela: {
    marginHorizontal: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  tabelaLinhaHeader: {
    flexDirection: "row",
    backgroundColor: "#2e3e4e",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabelaHeaderTexto: {
    color: "#fff",
    fontWeight: "bold",
    flex: 1,
  },
  tabelaLinha: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabelaTexto: {
    flex: 1,
    color: "#333",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});
