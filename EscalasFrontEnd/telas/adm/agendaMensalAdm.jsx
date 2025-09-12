import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect as useEf, useState } from "react";
import AdmInferior from "../barras/adminferior";

export default function AgendaMensalAdm({ navigation }) {
  const [escalas, setEscalas] = useState(null);

  // carregar escalas do backend
  useEf(() => {
    async function carregarEscalas() {
      try {
        const res = await fetch("https://agendas-escalas-iasd-backend.onrender.com/api/escalas");
        const data = await res.json();
        // converter datas
        const escalasComData = data.map((e) => {
          const [ano, mes, dia] = e.data.split("-").map(Number);
          return { ...e, data: new Date(ano, mes - 1, dia) };
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2e3e4e" />
      </View>
    );
  }

  // processar escalas do mês atual
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const escalasMes = escalas
    .filter((e) => e.data.getMonth() === mesAtual && e.data.getFullYear() === anoAtual)
    .sort((a, b) => a.data - b.data);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 16 }}>Escala Mensal da Igreja</Text>

        {/* Escala Geral do Mês */}
        <View style={styles.tabelaWrapper}>
          <ScrollView>
            <View style={styles.tabelaLinhaHeader}>
              <Text style={styles.tabelaHeaderTexto}>DIA</Text>
              <Text style={styles.tabelaHeaderTexto}>MÊS</Text>
              <Text style={styles.tabelaHeaderTexto}>MINISTÉRIO</Text>
              <Text style={styles.tabelaHeaderTexto}>NOME</Text>
            </View>
            {escalasMes.length === 0 ? (
              <Text style={{ textAlign: "center", margin: 10 }}>Nenhuma escala encontrada.</Text>
            ) : (
              escalasMes.map((item, index) => {
                const mes = item.data.toLocaleDateString("pt-BR", { month: "long" });
                const dia = item.data.getDate();
                const diaSemana = item.data.toLocaleDateString("pt-BR", { weekday: "long" });
                return (
                  <View key={index} style={styles.tabelaLinha}>
                    <Text style={styles.tabelaTexto}>
                      {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}
                    </Text>
                    <Text style={styles.tabelaTexto}>{dia} / {mes}</Text>
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
      <AdmInferior navigation={navigation} />
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
    overflow: "hidden", // evita que o conteúdo vaze da borda arredondada
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
});
