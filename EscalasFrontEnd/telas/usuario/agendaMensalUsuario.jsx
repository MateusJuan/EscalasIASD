import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect as useEf, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsuarioInferior from "../barras/usuarioinferior";

export default function AgendaMensalUsuario({ navigation }) {
  const [escalas, setEscalas] = useState(null);
  const [user, setUser] = useState(null); // ✅ Estado do usuário logado

  // carregar escalas do backend
  useEf(() => {
    async function carregarEscalas() {
      try {
        // busca usuário logado
        const userStr = await AsyncStorage.getItem("usuarioLogado");
        const userData = userStr ? JSON.parse(userStr) : null;
        setUser(userData);

        // busca escalas do backend
        const res = await fetch(
          "https://agendas-escalas-iasd-backend.onrender.com/api/escalas"
        );
        const data = await res.json();

        // converter datas
        const escalasComData = data.map((e) => {
          let dataFormatada;
          if (e.data.includes("-")) {
            const [ano, mes, dia] = e.data.split("-").map(Number);
            dataFormatada = new Date(ano, mes - 1, dia);
          } else if (e.data.includes("/")) {
            const [dia, mes, ano] = e.data.split("/").map(Number);
            dataFormatada = new Date(ano, mes - 1, dia);
          }
          return { ...e, data: dataFormatada };
        });
        setEscalas(escalasComData);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar as escalas.");
        setEscalas([]);
      }
    }
    carregarEscalas();
  }, []);

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

  // processar escalas do mês atual
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Escalas gerais do mês atual (apenas da mesma igreja do usuário)
  const escalasMes =
    user && escalas
      ? escalas.filter(
          (e) =>
            e.data.getMonth() === mesAtual &&
            e.data.getFullYear() === anoAtual &&
            e.igreja === user.igreja
        )
      : [];

  // Normaliza o "hoje" para o início do dia
  hoje.setHours(0, 0, 0, 0);

  // Escalas futuras ou de hoje (filtradas pela igreja)
  const escalasFuturas =
    user && escalas
      ? escalas
          .filter((e) => e.data >= hoje && e.igreja === user.igreja)
          .sort((a, b) => a.data - b.data)
      : [];

  const proxima = escalasFuturas.length > 0 ? escalasFuturas[0] : null;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#2e3e4e" }}>
          Escala Mensal da Igreja
        </Text>

        {/* PRÓXIMA ESCALA */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardItem}>
              <MaterialIcons name="calendar-today" size={24} color="#fff" />
              <View style={styles.cardItemText}>
                <Text style={styles.cardTitle}>Dia da Semana</Text>
                <Text style={styles.cardDate}>
                  {proxima
                    ? proxima.data
                        .toLocaleDateString("pt-BR", { weekday: "long" })
                        .replace(/^./, (c) => c.toUpperCase())
                    : "-"}
                </Text>
              </View>
            </View>

            <View style={styles.cardItem}>
              <MaterialIcons name="calendar-month" size={24} color="#fff" />
              <View style={styles.cardItemText}>
                <Text style={styles.cardTitle}>Data</Text>
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

            <View style={styles.cardItem}>
              <MaterialIcons name="person" size={24} color="#fff" />
              <View style={styles.cardItemText}>
                <Text style={styles.cardTitle}>Nome</Text>
                <Text style={styles.cardDate}>
                  {proxima ? proxima.pessoa_nome : "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Escalas Gerais do Mês */}
        <View style={styles.tabelaWrapper}>
          <ScrollView>
            <View style={styles.tabelaLinhaHeader}>
              <Text style={styles.tabelaHeaderTexto}>DIA</Text>
              <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
              <Text style={styles.tabelaHeaderTexto}>MINISTÉRIO</Text>
              <Text style={styles.tabelaHeaderTexto}>NOME</Text>
            </View>

            {escalasMes.length === 0 ? (
              <Text style={{ textAlign: "center", margin: 10 }}>
                Nenhuma escala encontrada.
              </Text>
            ) : (
              escalasMes.map((item, index) => {
                const mes = item.data.toLocaleDateString("pt-BR", {
                  month: "long",
                });
                const dia = item.data.getDate();
                const diaSemana = item.data.toLocaleDateString("pt-BR", {
                  weekday: "long",
                });
                return (
                  <View key={index} style={styles.tabelaLinha}>
                    <Text style={styles.tabelaTexto}>
                      {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}
                    </Text>
                    <Text style={styles.tabelaTexto}>
                      {dia} / {mes}
                    </Text>
                    <Text style={styles.tabelaTexto}>{item.ministerio}</Text>
                    <Text style={styles.tabelaTexto}>{item.pessoa_nome}</Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>

      {/* Rodapé */}
      <UsuarioInferior navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f2",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  tabelaWrapper: {
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  tabelaLinhaHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2e3e4e",
    paddingVertical: 8,
  },
  tabelaHeaderTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  tabelaLinha: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  cardContainer: {
    marginTop: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#2e3e4e",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardItemText: {
    marginTop: 8,
    alignItems: "center",
  },
  cardTitle: {
    color: "#dcdcdc",
    fontSize: 12,
    fontWeight: "500",
  },
  cardDate: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },
});
