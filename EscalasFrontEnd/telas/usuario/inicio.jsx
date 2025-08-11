import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UsuarioInferior from "../barras/usuarioinferior";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InicioUsuario({ navigation, route }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [escalas, setEscalas] = useState(null);
  const [search, setSearch] = useState("");

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

        const escalasComData = data.map((e) => {
          const [dia, mes, ano] = e.data.split("/");
          return {
            ...e,
            data: new Date(ano, mes - 1, dia),
          };
        });

        setEscalas(escalasComData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as escalas.");
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

      {/* RODAPÉ */}
      <UsuarioInferior navigation={navigation} />
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
});
