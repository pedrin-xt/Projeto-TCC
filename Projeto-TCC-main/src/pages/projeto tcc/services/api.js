const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function requisicao(caminho, opcoes = {}) {
  let token = null;
  try {
    const sessao = JSON.parse(localStorage.getItem("pataamiga_sessao") || "null");
    token = sessao?.token || null;
  } catch {
    token = null;
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes.headers || {}),
    },
  });

  const dados = await resposta.json().catch(() => ({}));

  if (resposta.status === 401 && token) localStorage.removeItem("pataamiga_sessao");

  if (!resposta.ok) {
    throw new Error(dados.mensagem || dados.erro || dados.message || "Não foi possível concluir a solicitação.");
  }

  return dados;
}

export function salvarSessao(dados) {
  const usuario = dados.usuario || dados.adotante || dados.admin || dados;
  const sessao = {
    token: dados.token || dados.accessToken || null,
    usuario,
  };
  localStorage.setItem("pataamiga_sessao", JSON.stringify(sessao));
  return sessao;
}

// ---------- atalhos ----------
const corpoJson = (corpo) => (corpo === undefined ? undefined : JSON.stringify(corpo));

export const api = {
  get: (caminho) => requisicao(caminho),
  post: (caminho, corpo) => requisicao(caminho, { method: "POST", body: corpoJson(corpo) }),
  put: (caminho, corpo) => requisicao(caminho, { method: "PUT", body: corpoJson(corpo) }),
  delete: (caminho) => requisicao(caminho, { method: "DELETE" }),
};

// Envia um arquivo (foto). Não pode usar Content-Type JSON.
export async function enviarArquivo(caminho, formData) {
  let token = null;
  try { token = JSON.parse(localStorage.getItem("pataamiga_sessao") || "null")?.token || null; } catch { token = null; }
  const resposta = await fetch(`${API_URL}${caminho}`, { method: "POST", body: formData, headers: token ? { Authorization: `Bearer ${token}` } : {} });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível enviar o arquivo.");
  return dados;
}

export function lerSessao() {
  try { return JSON.parse(localStorage.getItem("pataamiga_sessao") || "null"); } catch { return null; }
}
export function estaLogado() { return Boolean(lerSessao()?.token); }
export function ehEquipe() { return ["admin", "voluntario"].includes(lerSessao()?.usuario?.perfil); }
export function sairDaConta() { localStorage.removeItem("pataamiga_sessao"); }
// Conta da ONG vai para o painel; usuário vai para o perfil
export function destinoConta() { return ehEquipe() ? "/admin" : "/perfil"; }

// Imagens enviadas (/uploads/...) ficam na API, então precisam do endereço dela
export function urlImagem(caminho, padrao = "/assets/image/logo-pata.png") {
  if (!caminho) return padrao;
  if (/^https?:\/\//i.test(caminho)) return caminho;
  if (caminho.startsWith("/uploads/")) return `${API_URL}${caminho}`;
  return caminho.startsWith("/") ? caminho : `/${caminho}`;
}
