import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

// Notificações
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Telas
import CarregandoApp from "./telas/carregando";
import Login from "./telas/login";
import CriarConta from "./telas/criarConta";
import RecuperacaoSenha from "./telas/recuperacaoSenha";
import InicioUsuario from "./telas/usuario/inicio";
import InicioAdm from "./telas/adm/inicioAdm";
import Perfil from "./telas/usuario/perfil";
import PerfilAdmin from "./telas/adm/perfilAdm";
import AgendaMensalUsuario from "./telas/usuario/agendaMensalUsuario";
import AgendaMensalAdm from "./telas/adm/agendaMensalAdm";
import AtualizarAppUsuario from "./telas/usuario/atualizarApp";
import AtualizarAppAdm from "./telas/adm/atualizarAppAdm";

const Stack = createNativeStackNavigator();

/* =========================
   CONFIG GLOBAL DE NOTIFICAÇÃO
========================= */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* =========================
   FUNÇÃO DE NOTIFICAÇÃO
========================= */
async function notificarNovaEscala(escala) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📅 Nova escala criada",
      body: `${escala.ministerio} - ${escala.pessoa_nome}`,
    },
    trigger: null,
  });
}

/* =========================
   APP
========================= */
export default function App() {

  useEffect(() => {
  async function solicitarPermissao() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de notificação negada");
    }
  }

  solicitarPermissao();
}, []);


  useEffect(() => {
    let interval;

    async function verificarNovasEscalas() {
      try {
        const userStr = await AsyncStorage.getItem("usuarioLogado");
        if (!userStr) return;

        const user = JSON.parse(userStr);

        const res = await fetch(
          "https://agendas-escalas-iasd-backend.onrender.com/api/escalas"
        );
        const data = await res.json();

        const escalasDaIgreja = data.filter(
          (e) => e.igreja === user.igreja
        );

        const ultimaSalva = await AsyncStorage.getItem("ultimaEscalaId");
        const ultimaId = ultimaSalva ? Number(ultimaSalva) : 0;

        const novas = escalasDaIgreja.filter((e) => e.id > ultimaId);

        if (novas.length > 0) {
          const ultima = novas[novas.length - 1];

          await notificarNovaEscala(ultima);
          await AsyncStorage.setItem(
            "ultimaEscalaId",
            String(ultima.id)
          );
        }
      } catch (err) {
        console.log("Erro ao verificar escalas:", err);
      }
    }

    interval = setInterval(verificarNovasEscalas, 60000); // 1 min

    return () => clearInterval(interval);
  }, []);
    
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarregandoApp">
        <Stack.Screen
          name="CarregandoApp"
          component={CarregandoApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CriarConta"
          component={CriarConta}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecuperacaoSenha"
          component={RecuperacaoSenha}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InicioUsuario"
          component={InicioUsuario}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InicioAdm"
          component={InicioAdm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PerfilAdmin"
          component={PerfilAdmin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AgendaMensalUsuario"
          component={AgendaMensalUsuario}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AgendaMensalAdm"
          component={AgendaMensalAdm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AtualizarAppUsuario"
          component={AtualizarAppUsuario}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AtualizarAppAdm"
          component={AtualizarAppAdm}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
