import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UsuarioInferior from "../barras/usuarioinferior";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para criar datas de forma segura
function parseDataSeguro(dataStr) {
  if (!dataStr) return null;

  const parts = dataStr.includes("/") ? dataStr.split("/") : dataStr.split("-");
  if (parts.length !== 3) return null;

  let dia, mes, ano;
  if (dataStr.includes("/")) {
    // Formato dd/mm/yyyy
    [dia, mes, ano] = parts.map(Number);
  } else {
    // Formato yyyy-mm-dd
    [ano, mes, dia] = parts.map(Number);
  }

  // Cria data usando string ISO para evitar ajuste automático
  const isoStr = `${ano.toString().padStart(4, "0")}-${mes
    .toString()
    .padStart(2, "0")}-${dia.toString().padStart(2, "0")}T00:00:00`;
  const data = new Date(isoStr);

  return data;
}

export default function InicioUsuario({ navigation, route }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [escalas, setEscalas] = useState(null);
  const [search, setSearch] = useState("");

  // Modais de erro/sucesso
  const [modalErro, setModalErro] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  const mostrarErro = (mensagem) => {
    setMensagemModal(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 1000);
  };

  const mostrarSucesso = (mensagem) => {
    setMensagemModal(mensagem);
    setModalSucesso(true);
    setTimeout(() => setModalSucesso(false), 1000);
  };

  // Carregar usuário logado
  useEffect(() => {
    async function loadUser() {
      if (!user) {
        try {
          const jsonValue = await AsyncStorage.getItem("usuarioLogado");
          if (jsonValue != null) {
            setUser(JSON.parse(jsonValue));
          } else {
            mostrarErro("Usuário não encontrado. Faça login novamente.");
            setTimeout(() => navigation.navigate("Login"), 2000);
          }
        } catch (e) {
          mostrarErro("Falha ao carregar usuário.");
          setTimeout(() => navigation.navigate("Login"), 2000);
        }
      }
    }
    loadUser();
  }, []);

  // Carregar escalas
  useEffect(() => {
    async function carregarEscalas() {
      try {
        const res = await fetch(
          "https://agendas-escalas-iasd-backend.onrender.com/api/escalas"
        );
        const data = await res.json();

        const escalasComData = data.map((e) => ({
          ...e,
          data: parseDataSeguro(e.data),
        }));

        setEscalas(escalasComData);
      } catch (error) {
        mostrarErro("Não foi possível carregar as escalas.");
        setEscalas([]);
      }
    }

    carregarEscalas();
  }, []);

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
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
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
      e.data &&
      e.data.getMonth() === mesAtual &&
      e.data.getFullYear() === anoAtual
  );

  const futuras = escalasUsuarioMes.filter((e) => e.data >= hoje);
  futuras.sort((a, b) => a.data - b.data);
  const proxima = futuras[0] || escalasUsuarioMes[0] || null;

  const escalasFiltradas = escalasUsuarioMes.filter((e) =>
    e.ministerio.toLowerCase().includes(search.toLowerCase())
  );

  escalasFiltradas.sort((a, b) => a.data.getDate() - b.data.getDate());

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
      <Text style={styles.escalaTexto}>Minha Escala Mensal:</Text>
      <View style={styles.tabela}>
        <View style={styles.tabelaLinhaHeader}>
            <Text style={styles.tabelaHeaderTexto}>DIA DA SEMANA</Text>
            <Text style={styles.tabelaHeaderTexto}>DATA</Text>
            <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
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
            const dia = dataObj.getDate();
            const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });

            const diasSemana = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
            const diaSemana = diasSemana[dataObj.getDay()];

            return (
              <View key={index} style={styles.tabelaLinha}>
                <Text style={styles.tabelaTexto}>{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</Text>
                <Text style={styles.tabelaTexto}>{dia}</Text>
                <Text style={styles.tabelaTexto}>{mes.charAt(0).toUpperCase() + mes.slice(1)}</Text>
                <Text style={styles.tabelaTexto}>{item.ministerio}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* RODAPÉ */}
      <UsuarioInferior navigation={navigation} />

      {/* MODAIS DE ERRO E SUCESSO */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: "#4BB543" }]}>
            <Text style={styles.modalTexto}>{mensagemModal}</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalErro} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: "#FF4C4C" }]}>
            <Text style={styles.modalTexto}>{mensagemModal}</Text>
          </View>
        </View>
      </Modal>
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
  escalaTexto: { marginTop: 20, marginLeft: 15, fontSize: 14, fontWeight: "500" },
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
