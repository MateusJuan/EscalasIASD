import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export const temaClaro = {
  FundoDeTela: "#f4f5f2",
  FundoCard: "#ffffff",
  FundoInput: "#f4f5f2",
  Titulo: "#111111",
  Subtitulo: "#333333",
  Texto: "#111111",
  TextoSecundario: "#667777",
  InputPlaceholder: "#888888",
  InputBorda: "#cccccc",
  InputTexto: "#111111",
  ListasBordas: "#acacac",
  BotaoPadrao: "#344656",
  BotaoTexto: "#ffffff",
  ModalFundo: "rgba(0, 0, 0, 0.5)",
  ModalErro: "#FF4C4C",
  ModalSucesso: "#4BB543",
  Icones: "#6c6c6c",
  IconesPadrao: "#ffffff",
  IconesTema: "#2e3e4e",
  Barras: "#2e3e4e",
  FundoTabela: "#e0e0e0",
  ModalContainer: "#ffffff",
  TextoPrincipal: "#111111",
};

export const temaEscuro = {
  FundoDeTela: "#1e2730",
  FundoCard: "#2b3640",
  FundoInput: "#33414c",
  Titulo: "#f2f4f5",
  Subtitulo: "#c5ccd2",
  Texto: "#f2f4f5",
  TextoSecundario: "#a8b3bb",
  InputPlaceholder: "#8b969f",
  InputBorda: "#4d5d6a",
  InputTexto: "#f2f4f5",
  ListasBordas: "#5a6b78",
  BotaoPadrao: "#3d5163",
  BotaoTexto: "#ffffff",
  ModalFundo: "rgba(0, 0, 0, 0.65)",
  ModalErro: "#FF4C4C",
  ModalSucesso: "#4BB543",
  Icones: "#a8b3bb",
  IconesPadrao: "#ffffff",
  IconesTema: "#d7dee4",
  Barras: "#24303a",
  FundoTabela: "#33424e",
  ModalContainer: "#2b3640",
  TextoPrincipal: "#f2f4f5",
};

export function obterCores(scheme) {
  return scheme === "dark" ? temaEscuro : temaClaro;
}

const TemaContext = createContext({
  cores: temaClaro,
  escuro: false,
  scheme: "light",
});

export function TemaProvider({ children }) {
  const schemeHook = useColorScheme();
  const [schemeManual, setSchemeManual] = useState(
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSchemeManual(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, []);

  const scheme = (schemeHook || schemeManual) === "dark" ? "dark" : "light";
  const escuro = scheme === "dark";
  const cores = useMemo(() => obterCores(scheme), [scheme]);
  const value = useMemo(() => ({ cores, escuro, scheme }), [cores, escuro, scheme]);
  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}

export function useCores() {
  return useTema().cores;
}

export function useEstilos(factory) {
  const cores = useCores();
  return useMemo(() => StyleSheet.create(factory(cores)), [cores, factory]);
}

const cores = new Proxy(temaClaro, {
  get(_, prop) {
    return obterCores(Appearance.getColorScheme())[prop];
  },
});

export default cores;
