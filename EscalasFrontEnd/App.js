import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { isRunningInExpoGo } from "expo";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TemaProvider, useTema } from "./telas/estilos/cores";

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
const isExpoGo = isRunningInExpoGo();

export async function notificarNovaEscala(escala) {
  if (isExpoGo) return;
  const { notificarNovaEscala: enviar } = require("./telas/utils/notificacoes");
  return enviar(escala);
}

export default function App() {
  useEffect(() => {
    if (isExpoGo) return;

    async function configurarNotificacoes() {
      try {
        const { configurarHandler, registrarPush } = require("./telas/utils/notificacoes");
        configurarHandler();
        await registrarPush();
      } catch (err) {
        console.error("❌ Erro ao configurar notificações:", err.message);
      }
    }

    configurarNotificacoes();
  }, []);

  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AppNavegacao />
      </TemaProvider>
    </SafeAreaProvider>
  );
}

function AppNavegacao() {
  const { cores, escuro } = useTema();
  const navTheme = {
    ...(escuro ? DarkTheme : DefaultTheme),
    colors: {
      ...(escuro ? DarkTheme.colors : DefaultTheme.colors),
      background: cores.FundoDeTela,
      card: cores.Barras,
      text: cores.Titulo,
      primary: cores.BotaoPadrao,
      border: cores.ListasBordas,
    },
  };

  return (
    <>
      <StatusBar style={escuro ? "light" : "dark"} backgroundColor={cores.Barras} />
      <NavigationContainer theme={navTheme}>
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
    </>
  );
}