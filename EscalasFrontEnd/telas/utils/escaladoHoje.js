import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://agendas-escalas-iasd-backend.onrender.com/api";

function parseDataSeguro(dataStr) {
  if (!dataStr) return null;
  const s = String(dataStr).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]));
  return null;
}

function mesmaDataLocal(dataStr) {
  const d = parseDataSeguro(dataStr);
  if (!d) return false;
  const hoje = new Date();
  return (
    d.getFullYear() === hoje.getFullYear() &&
    d.getMonth() === hoje.getMonth() &&
    d.getDate() === hoje.getDate()
  );
}

export async function usuarioEscaladoHoje() {
  try {
    const json = await AsyncStorage.getItem("usuarioLogado");
    const user = json ? JSON.parse(json) : null;
    if (!user?.id) return false;

    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${API_URL}/me/escalado-hoje`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return !!data.escalado;
        }
      } catch {
        /* cai no fallback */
      }
    }

    const res = await fetch(`${API_URL}/escalas`);
    const escalas = await res.json();
    if (!Array.isArray(escalas)) return false;

    return escalas.some(
      (e) => Number(e.pessoa_id) === Number(user.id) && mesmaDataLocal(e.data)
    );
  } catch {
    return false;
  }
}
