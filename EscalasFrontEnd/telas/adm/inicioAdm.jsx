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

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [novaData, setNovaData] = useState("");
  const [novoMinisterio, setNovoMinisterio] = useState("");

  // Busca por nome
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [buscaUsuario, setBuscaUsuario] = useState("");

  function parseDataBR(dataStr) {
    const [dia, mes, ano] = dataStr.split("/");
    return new Date(ano, mes - 1, dia);
  }

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
        setModalVisible(false);
        setNovaData("");
        setNovoMinisterio("");
        setBuscaUsuario("");
        setUsuarioSelecionado(null);
      } else {
        Alert.alert("Erro", result.error || "Falha ao adicionar escala.");
      }
    } catch (e) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
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

  const escalasFiltradas = escalasUsuarioMes.filter((e) =>
    e.ministerio.toLowerCase().includes(search.toLowerCase())
  );
escalasFiltradas.sort((a, b) => a.data.getDate() - b.data.getDate());
escalasGeralMes.sort((a, b) => a.data.getDate() - b.data.getDate());

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <Image
          source={require("../../img/Logo Circular.png")}
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={16} color="#6c6c6c" style={styles.searchIcon} />
          <TextInput
            placeholder="Pesquisar ministério"
            placeholderTextColor="#6c6c6c"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

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
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15, marginTop: 20 }}>
        <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>
      </View>
      <View style={styles.tabela}>
        <View style={styles.tabelaLinhaHeader}>
          <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
          <Text style={styles.tabelaHeaderTexto}>DIA</Text>
          <Text style={styles.tabelaHeaderTexto}>MINISTÉRIO</Text>
        </View>
        <ScrollView style={{ maxHeight: 200 }}>
          {escalasFiltradas.length === 0 && (
            <Text style={{ padding: 8, textAlign: "center" }}>
              Nenhuma escala encontrada.
            </Text>
          )}
          {escalasFiltradas.map((item, index) => {
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
          })}
        </ScrollView>
      </View>

      {/* ESCALA GERAL DO MÊS + BOTÃO */}
      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15, marginTop: 20 }}>
        <Text style={styles.escalaTexto}>Escala Geral do Mês:</Text>
        <MaterialIcons
          name="add-circle"
          size={24}
          color="#2e3e4e"
          style={{ marginLeft: 8 }}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <View style={styles.tabela}>
        <View style={styles.tabelaLinhaHeader}>
          <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
          <Text style={styles.tabelaHeaderTexto}>DIA</Text>
          <Text style={styles.tabelaHeaderTexto}>PESSOA</Text>
        </View>
        <ScrollView style={{ maxHeight: 200 }}>
          {escalasGeralMes.length === 0 && (
            <Text style={{ padding: 8, textAlign: "center" }}>
              Nenhuma escala encontrada.
            </Text>
          )}
          {escalasGeralMes.map((item, index) => {
            const dataObj = item.data;
            const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });
            const dia = dataObj.getDate();
            return (
              <View key={index} style={styles.tabelaLinha}>
                <Text style={styles.tabelaTexto}>
                  {mes.charAt(0).toUpperCase() + mes.slice(1)}
                </Text>
                <Text style={styles.tabelaTexto}>{dia}</Text>
                <Text style={styles.tabelaTexto}>{item.pessoa_nome}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* MODAL */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Adicionar Escala</Text>

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
                setUsuarioSelecionado(null); // limpa seleção anterior
              }}
              placeholder="Digite o nome"
              style={styles.modalInput}
            />

            {/* Lista de sugestões aparece enquanto digita */}
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <Text style={{ color: "#d00", fontWeight: "bold" }} onPress={() => setModalVisible(false)}>Cancelar</Text>
              <Text style={{ color: "#007aff", fontWeight: "bold" }} onPress={adicionarEscala}>Salvar</Text>
            </View>
          </View>
        </View>
      )}
      {/* RODAPÉ */}
      <AdmInferior navigation={navigation} route={{ params: { user } }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3ef" },
  topo: {
    backgroundColor: "#2e3e4e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: { width: 50, height: 50, resizeMode: "contain" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 10,
    height: 35,
  },
  searchIcon: { marginRight: 5 },
  input: { flex: 1, height: "100%", fontSize: 14 },
  cardContainer: { paddingHorizontal: 20, marginTop: 20 },
  card: {
    backgroundColor: "#2e3e4e",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2e3e4e",
  },
  cardItem: { alignItems: "center", justifyContent: "center" },
  cardItemText: { marginTop: 5, alignItems: "center" },
  cardTitle: { color: "#fff", fontSize: 10 },
  cardDate: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  escalaTexto: { fontSize: 14, fontWeight: "500" },
  tabela: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#a4a4a4",
  },
  tabelaLinhaHeader: {
    flexDirection: "row",
    backgroundColor: "#3c2f2f",
    padding: 8,
  },
  tabelaLinha: {
    flexDirection: "row",
    backgroundColor: "#e0dede",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  tabelaHeaderTexto: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#000",
  },
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
});
