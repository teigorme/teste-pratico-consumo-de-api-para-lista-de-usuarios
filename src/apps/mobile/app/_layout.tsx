import "@/global.css";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Slot />
      <StatusBar />
    </>
  );
}
