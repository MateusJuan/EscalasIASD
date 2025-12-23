import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdmInferior from "../barras/adminferior";
import axios from "axios";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modais
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState(false);
  const [confirmarSair, setConfirmarSair] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");

  // Campos de edição
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [dataNascimentoEdit, setDataNascimentoEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");
  const [confirmaSenhaEdit, setConfirmaSenhaEdit] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);
  const [igrejaEdit, setIgrejaEdit] = useState("");

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
      setIgrejaEdit(user.igreja || "");
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

  const mostrarErro = (mensagem) => {
    setErroMensagem(mensagem);
    setModalErro(true);
    setTimeout(() => setModalErro(false), 1000);
  };

  const mostrarSucesso = (mensagem = "Ação realizada com sucesso.") => {
    setErroMensagem(mensagem); // Reaproveita o mesmo campo de mensagem
    setModalSucesso(true);
    setTimeout(() => setModalSucesso(false), 1000);
  };

  const salvarEdicao = async () => {
    if (!nomeEdit.trim() || !emailEdit.trim() || !igrejaEdit.trim() || !dataNascimentoEdit.trim()) {
      mostrarErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!validarEmail(emailEdit)) {
      mostrarErro("Email inválido.");
      return;
    }
    if (senhaEdit !== confirmaSenhaEdit) {
      mostrarErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.put(
        `https://agendas-escalas-iasd-backend.onrender.com/api/usuarios/${user.id}`,
        {
          nome: nomeEdit,
          email: emailEdit,
          dataNascimento: dataNascimentoEdit,
          igreja: igrejaEdit,
          senha: senhaEdit ? senhaEdit : user.senha,
        }
      );

      if (response.status === 200) {
        const usuarioAtualizado = response.data;
        setUser(usuarioAtualizado);
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
        setModalVisible(false);
        mostrarSucesso("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error(error);
      mostrarErro("Erro ao atualizar os dados.");
    }
  };

  const excluirConta = () => setConfirmarExcluir(true);
  const handleLogout = () => setConfirmarSair(true);

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
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {user?.nome ? user.nome.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
          )}
          <Text style={styles.value}>{user?.nome || "Nome não informado"}</Text>
        </View>
        {/*Email Usuario*/}
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="#2e3e4e" />
          <Text style={styles.infoText}>
            Email: {user?.email || "Email não informado"}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          {/* Data de nascimento */}
          <View style={styles.infoItem}>
            <MaterialIcons name="cake" size={24} color="#2e3e4e" />
            <Text style={styles.infoText}>
              Data de Nascimento: {user?.dataNascimento || "Não informado"}
            </Text>
          </View>

          {/* Igreja */}
          <View style={styles.infoItem}>
            <MaterialIcons name="church" size={24} color="#2e3e4e" />
            <Text style={styles.infoText}>
              Igreja: {user?.igreja || "Igreja não informada"}
            </Text>
          </View>
          {/* Ministério */}
          <View style={styles.infoItem}>
            <MaterialIcons name="people" size={24} color="#2e3e4e" />
            <Text style={styles.infoText}>
              Ministério: {user?.ministerio || "Ministério não informado"}
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
        <Text
          style={styles.rodapeTexto}
          onPress={() =>
            Linking.openURL("https://escalasfrontend--4o14gq74br.expo.app/")
          }
        >
          Nosso Site: https://escalasfrontend--4o14gq74br.expo.app/
        </Text>
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

              <Text style={styles.label}>Igreja</Text>
              <TextInput
                style={styles.input}
                value={igrejaEdit}
                onChangeText={setIgrejaEdit}
                placeholder="Informe sua igreja"
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
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#2e3e4e" }]}
                  onPress={salvarEdicao}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#999" }]}
                  onPress={() => setModalVisible(false)}
                >
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
                    await axios.delete(
                      `https://agendas-escalas-iasd-backend.onrender.com/api/usuarios/${user.id}`
                    );
                    await AsyncStorage.removeItem("usuarioLogado");
                    setConfirmarExcluir(false);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  } catch (error) {
                    console.error(error);
                    mostrarErro("Erro ao excluir conta.");
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

      {/* Modal de sucesso */}
      <Modal transparent visible={modalSucesso} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: "#4BB543" }]}>
            <Text style={styles.modalTexto}>{erroMensagem}</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de erro */}
      <Modal transparent visible={modalErro} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: "#FF4C4C" }]}>
            <Text style={styles.modalTexto}>{erroMensagem}</Text>
          </View>
        </View>
      </Modal>

      <AdmInferior navigation={navigation} />
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
    paddingBottom: 80,
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
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2e3e4e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarLetter: {
    color: "#ccc",
    fontSize: 50,
    fontWeight: "bold",
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
  modalTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  rodapeTexto: {
  fontSize: 14,
  color: "#2e3e4e",
  textAlign: "center", // centraliza horizontalmente
  marginTop: 20,
}
});
