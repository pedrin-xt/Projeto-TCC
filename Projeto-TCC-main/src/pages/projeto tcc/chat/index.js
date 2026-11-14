import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, estaLogado, ehEquipe } from "../services/api";
import "./index.scss";
import "../componentes/Compat.scss";
import "../componentes/FotoEditavel.scss";
import Avatar from "../componentes/Avatar";

const quando = (d) => new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

// Quantas mensagens novas existem (número na aba). Atualiza a cada 20 s.
export function useNaoLidas() {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!estaLogado()) return undefined;
    let ativo = true;
    const buscar = () => api.get("/chat/nao-lidas").then(r => { if (ativo) setTotal(r.total); }).catch(() => {});
    buscar();
    const t = setInterval(buscar, 20000);
    return () => { ativo = false; clearInterval(t); };
  }, []);
  return total;
}

// Lista de conversas à esquerda, mensagens à direita (atualiza sozinho)
export function ChatPainel() {
  const equipe = ehEquipe();
  const [conversas, setConversas] = useState([]);
  const [atual, setAtual] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const ultimoId = useRef(0);
  const fim = useRef(null);

  const carregarLista = useCallback(() => api.get("/chat/conversas").then(r => setConversas(r.conversas || [])).catch(e => setErro(e.message)), []);
  const adicionar = useCallback((novas) => {
    if (!novas.length) return;
    ultimoId.current = Math.max(ultimoId.current, novas[novas.length - 1].id);
    setMensagens(m => { const ids = new Set(m.map(x => x.id)); return [...m, ...novas.filter(x => !ids.has(x.id))]; });
  }, []);

  useEffect(() => { carregarLista(); const t = setInterval(carregarLista, 15000); return () => clearInterval(t); }, [carregarLista]);

  useEffect(() => {
    if (!atual) return undefined;
    let ativo = true;
    ultimoId.current = 0; setMensagens([]);
    const buscar = async () => {
      try {
        const r = await api.get(`/chat/conversas/${atual}/mensagens?depois=${ultimoId.current}`);
        if (!ativo) return;
        const novas = r.mensagens || [];
        if (novas.length) { adicionar(novas); carregarLista(); }
      } catch (e) { if (ativo) setErro(e.message); }
    };
    buscar();
    const t = setInterval(buscar, 5000);
    return () => { ativo = false; clearInterval(t); };
  }, [atual, adicionar, carregarLista]);

  useEffect(() => { fim.current?.scrollIntoView?.({ block: "end" }); }, [mensagens]);

  async function enviar(e) {
    e.preventDefault();
    const t = texto.trim();
    if (!t || !atual) return;
    setEnviando(true); setErro("");
    try {
      await api.post(`/chat/conversas/${atual}/mensagens`, { texto: t });
      setTexto("");
      const r = await api.get(`/chat/conversas/${atual}/mensagens?depois=${ultimoId.current}`);
      adicionar(r.mensagens || []);
      carregarLista();
    } catch (err) { setErro(err.message); }
    finally { setEnviando(false); }
  }

  return <div className="chat">
    <aside className="chat-lista">
      {conversas.length === 0 && <p className="chat-vazio">Nenhuma conversa ainda.</p>}
      {conversas.map(c => <button type="button" key={c.id} className={atual === c.id ? "ativa" : ""} onClick={() => setAtual(c.id)}>
        <Avatar foto={equipe ? c.usuario_foto : c.ong_logo} nome={equipe ? c.usuario_nome : c.ong_nome} tamanho={38} />
        <div className="chat-item-texto">
          <strong>{equipe ? c.usuario_nome : c.ong_nome || "ONG"}</strong>
          {c.animal_nome && <small>Sobre: {c.animal_nome}</small>}
          <span>{c.ultima_texto}</span>
        </div>
        {c.nao_lidas > 0 && <i className="selo-numero">{c.nao_lidas}</i>}
      </button>)}
    </aside>
    <section className="chat-janela">
      {erro && <p className="chat-erro" role="status">{erro}</p>}
      {!atual ? <p className="chat-vazio">Escolha uma conversa para ver as mensagens.</p> : <>
        <div className="chat-msgs">
          {mensagens.map(m => <div key={m.id} className={`chat-bolha ${(m.autor_tipo === "ong") === equipe ? "minha" : "outra"}`}>
            <p>{m.texto}</p><small>{m.autor_nome} · {quando(m.criado_em)}</small>
          </div>)}
          <div ref={fim} />
        </div>
        <form className="chat-enviar" onSubmit={enviar}>
          <input maxLength={1000} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escreva sua mensagem..." />
          <button className="perfil-primario" disabled={enviando || !texto.trim()}>Enviar</button>
        </form>
      </>}
    </section>
  </div>;
}

// Botão "Conversar com a ONG": abre uma caixa de texto e começa a conversa sobre o animal
export function BotaoConversar({ animalId, animalNome, aoIniciar }) {
  const nav = useNavigate();
  const [aberto, setAberto] = useState(false); const [texto, setTexto] = useState(""); const [erro, setErro] = useState(""); const [enviando, setEnviando] = useState(false);
  if (!estaLogado() || ehEquipe()) return null;
  async function enviar(e) {
    e.preventDefault(); setEnviando(true); setErro("");
    try {
      await api.post("/chat/conversas", { animal_id: animalId, texto });
      setAberto(false); setTexto(""); setEnviando(false);
      if (aoIniciar) aoIniciar(); else nav("/perfil", { state: { aba: "conversas" } });
    } catch (err) { setErro(err.message); setEnviando(false); }
  }
  if (!aberto) return <button type="button" className="perfil-secundario" onClick={() => setAberto(true)}>Conversar com a ONG</button>;
  return <form className="chat-novo" onSubmit={enviar}>
    <label>Mensagem para a ONG{animalNome ? ` sobre ${animalNome}` : ""}<textarea required maxLength={1000} rows="3" value={texto} onChange={e => setTexto(e.target.value)} /></label>
    {erro && <p className="chat-erro" role="status">{erro}</p>}
    <div className="chat-novo-botoes"><button className="perfil-primario" disabled={enviando}>{enviando ? "Enviando..." : "Enviar"}</button><button type="button" className="perfil-secundario" onClick={() => setAberto(false)}>Cancelar</button></div>
  </form>;
}
