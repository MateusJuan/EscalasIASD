import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import AdmInferior from "../barras/adminferior";
import { useCores, useEstilos, useTema } from "../estilos/cores";

const API_URL = "https://agendas-escalas-iasd-backend.onrender.com/api";

function formatarData(dataStr) {
  if (!dataStr) return "-";
  const s = String(dataStr).slice(0, 10);
  const [ano, mes, dia] = s.split("-");
  if (!ano || !mes || !dia) return s;
  return `${dia}/${mes}/${ano}`;
}

export default function ProgramaCultoAdm({ navigation, route }) {
  const cores = useCores();
  const { escuro } = useTema();
  const styles = useEstilos(estilosProgramaCultoAdm);
  const user = route?.params?.user;
  const [programas, setProgramas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [programa, setPrograma] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNovo, setModalNovo] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [novoData, setNovoData] = useState(new Date());
  const [novoTipo, setNovoTipo] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function getToken() {
    return await AsyncStorage.getItem("token");
  }

  async function api(method, path, body) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Erro na requisição.");
    }
    return data;
  }

  async function carregarProgramas() {
    try {
      const data = await api("GET", "/programas");
      setProgramas(Array.isArray(data) ? data : []);
    } catch (err) {
      setProgramas([]);
      Alert.alert("Erro", err.message || "Não foi possível carregar os programas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProgramas();
  }, []);

  const partes = Array.isArray(programa?.programa_partes)
    ? programa.programa_partes
    : [];
  const funcoes = partes
    .filter((p) => p.tipo === "funcao")
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  const programacao = partes
    .filter((p) => p.tipo === "programacao")
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  async function abrirPrograma(id) {
    try {
      const data = await api("GET", `/programas/${id}`);
      setPrograma({
        ...data,
        programa_partes: Array.isArray(data.programa_partes)
          ? data.programa_partes
          : [],
      });
      setModalVisible(true);
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível abrir o programa.");
    }
  }

  async function atualizarParte(id, campo, valor) {
    try {
      await api("PUT", `/programa-partes/${id}`, { [campo]: valor });
      setPrograma((atual) => {
        if (!atual) return atual;
        return {
          ...atual,
          programa_partes: (atual.programa_partes || []).map((p) =>
            p.id === id ? { ...p, [campo]: valor } : p
          ),
        };
      });
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar a alteração.");
    }
  }

  async function criarPrograma() {
    const tipo = novoTipo.trim();
    if (!tipo) {
      Alert.alert("Atenção", "Informe o tipo do culto.");
      return;
    }

    try {
      setSalvando(true);
      const y = novoData.getFullYear();
      const m = String(novoData.getMonth() + 1).padStart(2, "0");
      const d = String(novoData.getDate()).padStart(2, "0");
      const criado = await api("POST", "/programas", {
        data: `${y}-${m}-${d}`,
        tipo,
        funcoes: {},
        programacao: [],
      });
      setModalNovo(false);
      setNovoTipo("");
      await carregarProgramas();
      const id = criado?.programa?.id;
      if (id) await abrirPrograma(id);
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao criar programa.");
    } finally {
      setSalvando(false);
    }
  }

  async function adicionarParte(tipo) {
    if (!programa) return;
    try {
      const lista = tipo === "funcao" ? funcoes : programacao;
      const ultima = lista[lista.length - 1];
      await api("POST", "/programa-partes", {
        programa_id: programa.id,
        tipo,
        titulo: tipo === "funcao" ? "Nova função" : "Novo momento",
        descricao: "",
        horario: tipo === "programacao" ? "" : null,
        ordem: (ultima?.ordem ?? (tipo === "funcao" ? 0 : 100)) + 10,
      });
      await abrirPrograma(programa.id);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível adicionar o item.");
    }
  }

  async function removerParte(id) {
    Alert.alert("Remover", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api("DELETE", `/programa-partes/${id}`);
            await abrirPrograma(programa.id);
          } catch {
            Alert.alert("Erro", "Não foi possível remover.");
          }
        },
      },
    ]);
  }

  async function excluirPrograma() {
    if (!programa) return;
    Alert.alert("Excluir programa", "Isso apaga toda a ordem deste culto.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api("DELETE", `/programas/${programa.id}`);
            setModalVisible(false);
            setPrograma(null);
            carregarProgramas();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Programação dos Cultos</Text>
        <TouchableOpacity
          onPress={() => {
            setNovoData(new Date());
            setNovoTipo("");
            setModalNovo(true);
          }}
        >
          <MaterialIcons name="add-circle" size={28} color={cores.IconesTema} />
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Crie o culto do zero e descreva como cada momento deve acontecer.
      </Text>

      {carregando ? (
        <ActivityIndicator size="large" color={cores.IconesTema} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.tabela}>
          <View style={styles.tabelaHeader}>
            <Text style={styles.headerText}>DATA</Text>
            <Text style={styles.headerText}>TIPO</Text>
          </View>
          {programas.length === 0 ? (
            <Text style={styles.vazio}>Nenhum programa cadastrado.</Text>
          ) : (
            programas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.tabelaLinha}
                onPress={() => abrirPrograma(item.id)}
              >
                <Text style={styles.tabelaTexto}>{formatarData(item.data)}</Text>
                <Text style={styles.tabelaTexto}>{item.tipo}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <Modal visible={modalNovo} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Novo programa</Text>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setMostrarCalendario(true)}
            >
              <Text style={{ color: cores.Texto }}>{novoData.toLocaleDateString("pt-BR")}</Text>
            </TouchableOpacity>
            {mostrarCalendario && (
              <DateTimePicker
                value={novoData}
                mode="date"
                display="default"
                themeVariant={escuro ? "dark" : "light"}
                onChange={(event, date) => {
                  setMostrarCalendario(Platform.OS === "ios");
                  if (event.type === "dismissed") return;
                  if (date) setNovoData(date);
                }}
              />
            )}
            <Text style={styles.label}>Tipo do culto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Culto Sábado, Culto Jovem"
              placeholderTextColor={cores.InputPlaceholder}
              value={novoTipo}
              onChangeText={setNovoTipo}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoSecundario]}
                onPress={() => setModalNovo(false)}
              >
                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={criarPrograma}
                disabled={salvando}
              >
                <Text style={styles.botaoTexto}>
                  {salvando ? "Criando..." : "Criar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalVisible} animationType="slide">
        {programa && (
          <SafeAreaView style={styles.modalContainer}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text style={styles.modalTitulo}>
                {programa.tipo} — {formatarData(programa.data)}
              </Text>

              <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.secaoTopo}>
                  <Text style={styles.blocoTitulo}>FUNÇÕES</Text>
                  <TouchableOpacity onPress={() => adicionarParte("funcao")}>
                    <Text style={styles.linkAdd}>+ Função</Text>
                  </TouchableOpacity>
                </View>
                {funcoes.length === 0 ? (
                  <Text style={styles.vazio}>
                    Nenhuma função. Toque em + Função.
                  </Text>
                ) : (
                  funcoes.map((parte) => (
                    <View key={parte.id} style={styles.parteBox}>
                      <View style={styles.parteTopo}>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          value={parte.titulo}
                          placeholder="Nome da função"
                          placeholderTextColor={cores.InputPlaceholder}
                          onChangeText={(text) =>
                            setPrograma((atual) => ({
                              ...atual,
                              programa_partes: atual.programa_partes.map((p) =>
                                p.id === parte.id ? { ...p, titulo: text } : p
                              ),
                            }))
                          }
                          onEndEditing={(e) =>
                            atualizarParte(parte.id, "titulo", e.nativeEvent.text)
                          }
                        />
                        <TouchableOpacity onPress={() => removerParte(parte.id)}>
                          <MaterialIcons name="delete" size={22} color="#a32e2e" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={parte.descricao || ""}
                        placeholder="Quem atua / orientação"
                        placeholderTextColor={cores.InputPlaceholder}
                        onChangeText={(text) =>
                          setPrograma((atual) => ({
                            ...atual,
                            programa_partes: atual.programa_partes.map((p) =>
                              p.id === parte.id ? { ...p, descricao: text } : p
                            ),
                          }))
                        }
                        onEndEditing={(e) =>
                          atualizarParte(parte.id, "descricao", e.nativeEvent.text)
                        }
                      />
                    </View>
                  ))
                )}

                <View style={styles.secaoTopo}>
                  <Text style={styles.blocoTitulo}>ORDEM DO CULTO</Text>
                  <TouchableOpacity onPress={() => adicionarParte("programacao")}>
                    <Text style={styles.linkAdd}>+ Momento</Text>
                  </TouchableOpacity>
                </View>
                {programacao.length === 0 ? (
                  <Text style={styles.vazio}>
                    Nenhum momento. Toque em + Momento.
                  </Text>
                ) : (
                  programacao.map((parte) => (
                    <View key={parte.id} style={styles.parteBox}>
                      <View style={styles.parteTopo}>
                        <TextInput
                          style={[styles.input, { width: 80 }]}
                          value={parte.horario || ""}
                          placeholder="08:45"
                          placeholderTextColor={cores.InputPlaceholder}
                          onChangeText={(text) =>
                            setPrograma((atual) => ({
                              ...atual,
                              programa_partes: atual.programa_partes.map((p) =>
                                p.id === parte.id ? { ...p, horario: text } : p
                              ),
                            }))
                          }
                          onEndEditing={(e) =>
                            atualizarParte(parte.id, "horario", e.nativeEvent.text)
                          }
                        />
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          value={parte.titulo}
                          placeholder="O que acontece"
                          placeholderTextColor={cores.InputPlaceholder}
                          onChangeText={(text) =>
                            setPrograma((atual) => ({
                              ...atual,
                              programa_partes: atual.programa_partes.map((p) =>
                                p.id === parte.id ? { ...p, titulo: text } : p
                              ),
                            }))
                          }
                          onEndEditing={(e) =>
                            atualizarParte(parte.id, "titulo", e.nativeEvent.text)
                          }
                        />
                        <TouchableOpacity onPress={() => removerParte(parte.id)}>
                          <MaterialIcons name="delete" size={22} color="#a32e2e" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={[styles.input, { minHeight: 70, textAlignVertical: "top" }]}
                        multiline
                        value={parte.descricao || ""}
                        placeholder="Como deve funcionar: quem sobe, hinos, duração..."
                        placeholderTextColor={cores.InputPlaceholder}
                        onChangeText={(text) =>
                          setPrograma((atual) => ({
                            ...atual,
                            programa_partes: atual.programa_partes.map((p) =>
                              p.id === parte.id ? { ...p, descricao: text } : p
                            ),
                          }))
                        }
                        onEndEditing={(e) =>
                          atualizarParte(parte.id, "descricao", e.nativeEvent.text)
                        }
                      />
                    </View>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity style={styles.botaoPerigo} onPress={excluirPrograma}>
                <Text style={styles.botaoTexto}>Excluir programa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoFechar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botaoTexto}>Fechar</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        )}
      </Modal>

      <AdmInferior navigation={navigation} route={{ params: { user } }} />
    </SafeAreaView>
  );
}

function estilosProgramaCultoAdm(cores) {
  return {
  container: {
    flex: 1,
    backgroundColor: cores.FundoDeTela,
    padding: 15,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: cores.Titulo,
  },
  hint: {
    color: cores.TextoSecundario,
    marginBottom: 12,
    fontSize: 13,
  },
  tabela: {
    backgroundColor: cores.FundoTabela,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabelaHeader: {
    flexDirection: "row",
    backgroundColor: cores.BotaoPadrao,
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: cores.IconesPadrao,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabelaLinha: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.ListasBordas,
  },
  tabelaTexto: {
    flex: 1,
    textAlign: "center",
    color: cores.Titulo,
  },
  vazio: {
    textAlign: "center",
    padding: 16,
    color: cores.TextoSecundario,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: cores.ModalFundo,
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: cores.ModalContainer,
    borderRadius: 12,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.FundoDeTela,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: cores.Titulo,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: cores.Texto,
  },
  secaoTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  blocoTitulo: {
    fontWeight: "bold",
    marginBottom: 5,
    color: cores.Titulo,
  },
  linkAdd: {
    color: cores.IconesTema,
    fontWeight: "700",
  },
  parteBox: {
    marginBottom: 12,
    backgroundColor: cores.FundoCard,
    padding: 10,
    borderRadius: 8,
  },
  parteTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.InputBorda,
    borderRadius: 5,
    padding: 8,
    backgroundColor: cores.FundoInput,
    color: cores.InputTexto,
    marginBottom: 4,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  botao: {
    backgroundColor: cores.Barras,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoSecundario: {
    backgroundColor: cores.FundoTabela,
  },
  botaoTexto: {
    color: cores.BotaoTexto,
    fontWeight: "bold",
    textAlign: "center",
  },
  botaoSecundarioTexto: {
    color: cores.IconesTema,
    fontWeight: "bold",
  },
  botaoFechar: {
    backgroundColor: cores.Barras,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  botaoPerigo: {
    backgroundColor: "#a32e2e",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  };
}
