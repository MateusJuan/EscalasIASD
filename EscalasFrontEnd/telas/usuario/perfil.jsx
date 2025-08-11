import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsuarioInferior from "../barras/usuarioinferior";
import axios from "axios";


export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [dataNascimentoEdit, setDataNascimentoEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");
  const [confirmaSenhaEdit, setConfirmaSenhaEdit] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);

  const [confirmarExcluir, setConfirmarExcluir] = useState(false);
  const [confirmarSair, setConfirmarSair] = useState(false);

  const carregarUsuario = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("usuarioLogado");
      if (jsonValue != null) {
        const usuario = JSON.parse(jsonValue);
        setUser(usuario);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    } catch (e) {
      console.error("Erro ao carregar usuário:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuario();
  }, []);

  const abrirModalEdicao = () => {
    if (user) {
      setNomeEdit(user.nome || "");
      setEmailEdit(user.email || "");
      setDataNascimentoEdit(user.dataNascimento || "");
      setSenhaEdit("");
      setConfirmaSenhaEdit("");
      setSenhaVisivel(false);
      setConfirmaSenhaVisivel(false);
      setModalVisible(true);
    }
  };

  const validarEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  {/*const validarSenhaForte = (senha) => {
    if (!senha) return true;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(senha);
  };*/}

  const salvarEdicao = async () => {
    if (!nomeEdit.trim() || !emailEdit.trim() || !dataNascimentoEdit.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!validarEmail(emailEdit)) {
      alert("Email inválido.");
      return;
    }
    {/*if (!validarSenhaForte(senhaEdit)) {
      alert("Senha fraca. Use ao menos 6 caracteres, letras maiúsculas e números.");
      return;
    }*/}
    if (senhaEdit !== confirmaSenhaEdit) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.put(
        `https://agendas-escalas-iasd-backend.onrender.com/api/usuarios/${user.id}`,
        {
          nome: nomeEdit,
          email: emailEdit,
          dataNascimento: dataNascimentoEdit,
          senha: senhaEdit ? senhaEdit : user.senha,
        }
      );

      if (response.status === 200) {
        const usuarioAtualizado = response.data;
        setUser(usuarioAtualizado);
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
        setModalVisible(false);
        alert("Dados atualizados.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar os dados.");
    }
  };

  const excluirConta = () => {
    setConfirmarExcluir(true);
  };

  const handleLogout = () => {
    setConfirmarSair(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#2e3e4e" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.header}>
          {user?.foto ? (
            <Image source={{ uri: user.foto }} style={styles.avatar} />
          ) : (
            <MaterialIcons name="account-circle" size={100} color="#555" />
          )}
          <Text style={styles.nome}>{user?.nome}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="cake" size={24} color="#2e3e4e" />
            <Text style={styles.infoText}>
              Data de Nascimento: {user?.dataNascimento}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoEditar} onPress={abrirModalEdicao}>
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Editar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={excluirConta}>
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Excluir Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de edição */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Editar Conta</Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} value={nomeEdit} onChangeText={setNomeEdit} />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={emailEdit}
                onChangeText={setEmailEdit}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput
                style={styles.input}
                value={dataNascimentoEdit}
                onChangeText={setDataNascimentoEdit}
                placeholder="DD/MM/AAAA"
              />

              <Text style={styles.label}>Nova Senha</Text>
              <View style={styles.inputSenhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  value={senhaEdit}
                  onChangeText={setSenhaEdit}
                  placeholder="********"
                  secureTextEntry={!senhaVisivel}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                  <Feather name={senhaVisivel ? "eye" : "eye-off"} size={20} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputSenhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  value={confirmaSenhaEdit}
                  onChangeText={setConfirmaSenhaEdit}
                  placeholder="********"
                  secureTextEntry={!confirmaSenhaVisivel}
                />
                <TouchableOpacity onPress={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}>
                  <Feather name={confirmaSenhaVisivel ? "eye" : "eye-off"} size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#2e3e4e" }]} onPress={salvarEdicao}>
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#999" }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação - logout */}
      <Modal visible={confirmarSair} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Deseja realmente sair do aplicativo?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#2e3e4e" }]}
                onPress={async () => {
                  await AsyncStorage.removeItem("usuarioLogado");
                  setConfirmarSair(false);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Sair</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#999" }]}
                onPress={() => setConfirmarSair(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação - excluir conta */}
      <Modal visible={confirmarExcluir} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Excluir Conta</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#a32e2e" }]}
                onPress={async () => {
                  try {
                    await axios.delete(`https://agendas-escalas-iasd-backend.onrender.com/api/usuarios/${user.id}`);
                    await AsyncStorage.removeItem("usuarioLogado");
                    setConfirmarExcluir(false);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  } catch (error) {
                    console.error(error);
                    alert("Erro ao excluir conta.");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#999" }]}
                onPress={() => setConfirmarExcluir(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <UsuarioInferior navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3ef",
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
    paddingBottom: 80, // espaço para a barra inferior
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    color: "#2e3e4e",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2e3e4e",
  },
  botaoEditar: {
    backgroundColor: "#2e3e4e",
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  botaoExcluir: {
    backgroundColor: "#a32e2e",
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
    width: "100%",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#2e3e4e",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2e3e4e",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#2e3e4e",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
  inputSenhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  inputSenha: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  iconSenha: {
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
