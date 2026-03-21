import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Platform } from "react-native";

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
import ProgramaCulto from "./telas/usuario/programaCulto";
import ProgramaCultoAdm from "./telas/adm/ProgramaCultoAdm";

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
   FUNÇÃO DE NOTIFICAÇÃO LOCAL
   (útil para disparar do próprio app)
========================= */
export async function notificarNovaEscala(escala) {
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
    async function configurarNotificacoes() {
      try {
        // 1. Solicitar permissão
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.warn("⚠️ Permissão de notificação negada");
          return;
        }

        // 2. Canal Android (obrigatório para Android 8+)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Escalas",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: true,
          });
        }

        // 3. Pegar token Expo Push
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
        console.log("✅ Expo Push Token:", expoPushToken);

        // 4. Salvar no AsyncStorage para usar na tela de login
        await AsyncStorage.setItem("expo_push_token", expoPushToken);

      } catch (err) {
        console.error("❌ Erro ao configurar notificações:", err.message);
      }
    }

    configurarNotificacoes();
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CriarConta"
          component={CriarConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperacaoSenha"
          component={RecuperacaoSenha}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InicioUsuario"
          component={InicioUsuario}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InicioAdm"
          component={InicioAdm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PerfilAdmin"
          component={PerfilAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgendaMensalUsuario"
          component={AgendaMensalUsuario}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgendaMensalAdm"
          component={AgendaMensalAdm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AtualizarAppUsuario"
          component={AtualizarAppUsuario}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AtualizarAppAdm"
          component={AtualizarAppAdm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProgramaCulto"
          component={ProgramaCulto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProgramaCultoAdm"
          component={ProgramaCultoAdm}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}