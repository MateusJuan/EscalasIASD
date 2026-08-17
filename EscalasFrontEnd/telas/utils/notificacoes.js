import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getNotifications() {
  return require("expo-notifications");
}

export function configurarHandler() {
  const Notifications = getNotifications();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registrarPush() {
  const Notifications = getNotifications();

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("⚠️ Permissão de notificação negada");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Escalas",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true,
    });
  }

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
  console.log("✅ Expo Push Token:", expoPushToken);
  await AsyncStorage.setItem("expo_push_token", expoPushToken);
}

export async function notificarNovaEscala(escala) {
  const Notifications = getNotifications();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📅 Nova escala criada",
      body: `${escala.ministerio} - ${escala.pessoa_nome}`,
    },
    trigger: null,
  });
}
