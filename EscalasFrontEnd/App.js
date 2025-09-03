import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarregandoApp from "./telas/carregando";
import Login from "./telas/login"
import CriarConta from "./telas/criarConta";
import RecuperacaoSenha from './telas/recuperacaoSenha';
import InicioUsuario from "./telas/usuario/inicio";
import InicioAdm from "./telas/adm/inicioAdm";
import Perfil from "./telas/usuario/perfil";
import PerfilAdmin from "./telas/adm/perfilAdm";
import AgendaMensalUsuario from './telas/usuario/agendaMensalUsuario';
import AgendaMensalAdm from "./telas/adm/agendaMensalAdm";
import AtualizarAppUsuario from "./telas/usuario/atualizarApp";
import AtualizarAppAdm from "./telas/adm/atualizarAppAdm"
const Stack = createNativeStackNavigator();

export default function App() {
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
