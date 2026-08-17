import { Platform } from "react-native";
import * as Device from "expo-device";
import { isRunningInExpoGo } from "expo";

export async function obterExpoPushToken() {
  if (isRunningInExpoGo() || !Device.isDevice) return null;

  const Notifications = require("expo-notifications");

  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (status !== "granted") {
    const { status: novo } = await Notifications.requestPermissionsAsync();
    finalStatus = novo;
  }

  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return (await Notifications.getExpoPushTokenAsync()).data;
}
