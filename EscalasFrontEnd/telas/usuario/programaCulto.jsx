import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UsuarioInferior from "../barras/usuarioinferior";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cores from "../estilos/cores";

// Função segura de data (mesma da tela início)
function parseDataSeguro(dataStr) {
  if (!dataStr) return null;

  const parts = dataStr.includes("/") ? dataStr.split("/") : dataStr.split("-");
  if (parts.length !== 3) return null;

  let dia, mes, ano;
  if (dataStr.includes("/")) {
    [dia, mes, ano] = parts.map(Number);
  } else {
    [ano, mes, dia] = parts.map(Number);
  }

  const isoStr = `${ano.toString().padStart(4, "0")}-${mes
    .toString()
    .padStart(2, "0")}-${dia.toString().padStart(2, "0")}T00:00:00`;

  return new Date(isoStr);
}

export default function ProgramaCulto({ navigation }) {
  const [user, setUser] = useState(null);
  const [escalas, setEscalas] = useState(null);
  const [programacao, setProgramacao] = useState(null);
  const [podeVisualizar, setPodeVisualizar] = useState(false);

  const [modalErro, setModalErro] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  const mostrarErro = (mensagem) => {
    setMensagemModal(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 2000);
  };

  // 🔹 Carregar usuário
  useEffect(() => {
    async function loadUser() {
      const jsonValue = await AsyncStorage.getItem("usuarioLogado");
      if (jsonValue) {
        setUser(JSON.parse(jsonValue));
      } else {
        mostrarErro("Faça login novamente.");
        navigation.navigate("Login");
      }
    }
    loadUser();
  }, []);

  // 🔹 Carregar escalas
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
        mostrarErro("Erro ao carregar escalas.");
        setEscalas([]);
      }
    }

    carregarEscalas();
  }, []);

  // 🔹 Verificar se pode visualizar
  useEffect(() => {
    if (!user || !escalas) return;

    const hoje = new Date();
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );

    const escaladoHoje = escalas.find(
      (e) =>
        e.pessoa_id === user.id &&
        e.data &&
        e.data.getTime() === hojeSemHora.getTime()
    );

    if (escaladoHoje) {
      setPodeVisualizar(true);

      // Aqui você pode buscar a programação do backend futuramente
      setProgramacao([
        { horario: "09:00", atividade: "Abertura" },
        { horario: "09:10", atividade: "Louvor" },
        { horario: "09:40", atividade: "Oração" },
        { horario: "10:00", atividade: "Sermão" },
        { horario: "11:00", atividade: "Encerramento" },
      ]);
    } else {
      setPodeVisualizar(false);
    }
  }, [user, escalas]);

  if (!user || escalas === null) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={cores.BotaoPadrao} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <Image
          source={require("../../img/Logo Circular.png")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Programação do Culto</Text>
      </View>

      {/* CONTEÚDO */}
      {!podeVisualizar ? (
        <View style={styles.semPermissao}>
          <MaterialIcons name="lock" size={60} color={cores.IconesPadrao} />
          <Text style={styles.textoBloqueado}>
            Você não está escalado para o culto de hoje.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.escalaTexto}>Programação de Hoje:</Text>

          <View style={styles.tabela}>
            <View style={styles.tabelaLinhaHeader}>
              <Text style={styles.tabelaHeaderTexto}>HORÁRIO</Text>
              <Text style={styles.tabelaHeaderTexto}>ATIVIDADE</Text>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {programacao.map((item, index) => (
                <View key={index} style={styles.tabelaLinha}>
                  <Text style={styles.tabelaTexto}>{item.horario}</Text>
                  <Text style={styles.tabelaTexto}>{item.atividade}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      <UsuarioInferior navigation={navigation} />

      {/* MODAL ERRO */}
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
  container: {
    flex: 1,
    backgroundColor: cores.FundoDeTela,
  },
  topo: {
    backgroundColor: cores.Barras,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.IconesPadrao,
  },
  escalaTexto: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  tabela: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: cores.FundoTabela,
  },
  tabelaLinhaHeader: {
    flexDirection: "row",
    backgroundColor: cores.Barras,
    padding: 8,
  },
  tabelaLinha: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.ListasBordas,
  },
  tabelaHeaderTexto: {
    flex: 1,
    fontWeight: "bold",
    color: cores.IconesPadrao,
    textAlign: "center",
    fontSize: 12,
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: cores.Titulo,
  },
  semPermissao: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textoBloqueado: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: cores.ModalFundo,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: cores.IconesPadrao,
    textAlign: "center",
  },
});
