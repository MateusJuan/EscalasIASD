import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CarregandoApp from "./telas/carregando";
import Login from "./telas/login"
import CriarConta from "./telas/criarConta";
import InicioUsuario from "./telas/usuario/inicio";
import InicioAdm from "./telas/adm/inicioAdm";
import Perfil from "./telas/usuario/perfil";
import PerfilAdm from "./telas/adm/perfilAdm";

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
          name="PerfilAdm"
          component={PerfilAdm}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
