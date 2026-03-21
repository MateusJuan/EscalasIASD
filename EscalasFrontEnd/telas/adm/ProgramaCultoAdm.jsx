import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import AdmInferior from "../barras/adminferior";


const API_URL = "https://agendas-escalas-iasd-backend.onrender.com/api";

export default function ProgramaCultoAdm({ navigation, route }) {
  const [programas, setProgramas] = useState([]);
  const [programaSelecionado, setProgramaSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [novoPrograma, setNovoPrograma] = useState(null);
  const [modalCriarVisible, setModalCriarVisible] = useState(false);
 const user = route?.params?.user;

  useEffect(() => {
    carregarProgramas();
  }, []);

  async function getToken() {
    return await AsyncStorage.getItem("token");
  }

  async function carregarProgramas() {
    const token = await getToken();

    const res = await fetch(`${API_URL}/programas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProgramas(data);
  }

  async function abrirPrograma(id) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/programas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProgramaSelecionado(data);
    setModalVisible(true);
  }

  async function atualizarParte(id, campo, valor) {
    const token = await getToken();

    await fetch(`${API_URL}/programa-partes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [campo]: valor }),
    });

    abrirPrograma(programaSelecionado.id);
  }

  async function criarProgramaComEstrutura(date) {
    try {
      const token = await getToken();
      const dataFormatada = date.toISOString().split("T")[0];

      // 🔹 Busca sonoplasta na escala
      const escalaRes = await fetch(
        `${API_URL}/escalas?data=${dataFormatada}&ministerio=Sonoplastia`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const escalaData = await escalaRes.json();
      const sonoplasta = escalaData[0]?.nome || "Não definido";

      // 🔹 Cria programa padrão
      const res = await fetch(`${API_URL}/programas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: dataFormatada,
          tipo: "Culto Sábado",
          estruturaPadrao: true,
          sonoplasta,
        }),
      });

      if (!res.ok) {
        Alert.alert("Erro", "Erro ao criar programa.");
        return;
      }

      carregarProgramas();
    } catch (err) {
      Alert.alert("Erro", "Falha ao conectar com servidor.");
    }
  }

  async function prepararNovoPrograma(date) {
  try {
    const token = await getToken();
    const dataFormatada = date.toISOString().split("T")[0];

    // 🔹 Buscar sonoplasta
    const escalaRes = await fetch(
      `${API_URL}/escalas?data=${dataFormatada}&ministerio=Sonoplastia`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const escalaData = await escalaRes.json();
    const sonoplasta = escalaData[0]?.nome || "";

    // 🔹 Montar estrutura local
    setNovoPrograma({
      data: dataFormatada,
      tipo: "Culto Sábado",
      funcoes: {
        sonoplasta,
        regente: "",
        escalaSabatina: "",
        diaconos: "",
        louvorEspecial1: "",
        adoracaoInfantil: "",
        pregador: "",
      },
      programacao: [
        { horario: "08:45", titulo: "Minutos prévios - 2 hinos" },
        { horario: "09:00", titulo: "Boas vindas" },
        { horario: "09:05", titulo: "Louvor especial" },
        { horario: "09:10", titulo: "Informativo" },
        { horario: "09:15", titulo: "Escola Sabatina" },
        { horario: "10:00", titulo: "Hino + Oração" },
        { horario: "10:05", titulo: "Anúncios" },
        { horario: "10:10", titulo: "Louvor especial" },
        { horario: "10:15", titulo: "Provai e Vede" },
        { horario: "10:20", titulo: "Louvor especial" },
        { horario: "10:25", titulo: "Adoração Infantil" },
        { horario: "10:35", titulo: "Hino Congregacional" },
        { horario: "10:40", titulo: "Sermão" },
      ],
    });

    setModalCriarVisible(true);
  } catch (err) {
    Alert.alert("Erro", "Erro ao preparar programa.");
  }
}

async function salvarNovoPrograma() {
  try {
    const token = await getToken();

    const res = await fetch(`${API_URL}/programas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(novoPrograma),
    });

    if (!res.ok) {
      Alert.alert("Erro", "Erro ao salvar programa.");
      return;
    }

    setModalCriarVisible(false);
    setNovoPrograma(null);
    carregarProgramas();
  } catch (err) {
    Alert.alert("Erro", "Falha ao salvar.");
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Programação dos Cultos</Text>

        <MaterialIcons
          name="add-circle"
          size={28}
          color="#2e3e4e"
          onPress={() => setMostrarCalendario(true)}
        />
      </View>

      {/* LISTA */}
      <View style={styles.tabela}>
        <View style={styles.tabelaHeader}>
          <Text style={styles.headerText}>DATA</Text>
          <Text style={styles.headerText}>TIPO</Text>
        </View>

        {programas.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.tabelaLinha}
            onPress={() => abrirPrograma(item.id)}
          >
            <Text style={styles.tabelaTexto}>
              {new Date(item.data).toLocaleDateString("pt-BR")}
            </Text>
            <Text style={styles.tabelaTexto}>{item.tipo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CALENDÁRIO */}
      {mostrarCalendario && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display="default"
            onChange={(event, date) => {
            setMostrarCalendario(false);
            if (date) {
                prepararNovoPrograma(date);
            }
            }}
        />
      )}

      {/* MODAL DETALHES */}
      <Modal visible={modalVisible} animationType="slide">
        {programaSelecionado && (
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
              Programa -{" "}
              {new Date(programaSelecionado.data).toLocaleDateString("pt-BR")}
            </Text>

            <ScrollView>
              {/* FUNÇÕES */}
              <Text style={styles.blocoTitulo}>FUNÇÕES</Text>
              {programaSelecionado.programa_partes
                .filter((p) => p.tipo === "funcao")
                .map((parte) => (
                  <View key={parte.id} style={styles.parteBox}>
                    <Text style={styles.parteLabel}>{parte.titulo}</Text>
                    <TextInput
                      style={styles.input}
                      value={parte.descricao || ""}
                      onChangeText={(text) =>
                        atualizarParte(parte.id, "descricao", text)
                      }
                    />
                  </View>
                ))}

              {/* PROGRAMAÇÃO */}
              <Text style={styles.blocoTitulo}>PROGRAMAÇÃO</Text>
              {programaSelecionado.programa_partes
                .filter((p) => p.tipo === "programacao")
                .sort((a, b) => a.ordem - b.ordem)
                .map((parte) => (
                  <View key={parte.id} style={styles.parteBox}>
                    <Text style={styles.horario}>{parte.horario}</Text>
                    <TextInput
                      style={styles.input}
                      value={parte.titulo}
                      onChangeText={(text) =>
                        atualizarParte(parte.id, "titulo", text)
                      }
                    />
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Fechar
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </Modal>

      <Modal visible={modalCriarVisible} animationType="slide">
        {novoPrograma && (
            <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>
                Novo Programa -{" "}
                {new Date(novoPrograma.data).toLocaleDateString("pt-BR")}
            </Text>

            <ScrollView>

                <Text style={styles.blocoTitulo}>FUNÇÕES</Text>

                {Object.keys(novoPrograma.funcoes).map((key) => (
                <View key={key} style={styles.parteBox}>
                    <Text style={styles.parteLabel}>{key}</Text>
                    <TextInput
                    style={styles.input}
                    value={novoPrograma.funcoes[key]}
                    onChangeText={(text) =>
                        setNovoPrograma({
                        ...novoPrograma,
                        funcoes: {
                            ...novoPrograma.funcoes,
                            [key]: text,
                        },
                        })
                    }
                    />
                </View>
                ))}

                <Text style={styles.blocoTitulo}>PROGRAMAÇÃO</Text>

                {novoPrograma.programacao.map((item, index) => (
                <View key={index} style={styles.parteBox}>
                    <Text style={styles.horario}>{item.horario}</Text>
                    <TextInput
                    style={styles.input}
                    value={item.titulo}
                    onChangeText={(text) => {
                        const novaProg = [...novoPrograma.programacao];
                        novaProg[index].titulo = text;
                        setNovoPrograma({
                        ...novoPrograma,
                        programacao: novaProg,
                        });
                    }}
                    />
                </View>
                ))}

            </ScrollView>

            <TouchableOpacity
                style={styles.botaoFechar}
                onPress={salvarNovoPrograma}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Salvar Programa
                </Text>
            </TouchableOpacity>
            </SafeAreaView>
        )}
        </Modal>

     <AdmInferior navigation={navigation} route={{ params: { user } }} />  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3ef",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabela: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tabelaHeader: {
    flexDirection: "row",
    backgroundColor: "#344656",
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  tabelaLinha: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  blocoTitulo: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  parteBox: {
    marginBottom: 10,
  },
  parteLabel: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  horario: {
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  botaoFechar: {
    backgroundColor: "#2e3e4e",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
});
