import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, enviarArquivo, estaLogado, ehEquipe, lerSessao, sairDaConta } from "../services/api";
import { ChatPainel, useNaoLidas } from "../chat";
import FotoEditavel from "../componentes/FotoEditavel";
import Pedidos from "./Pedidos";
import "../perfil/index.scss";
import "../componentes/Compat.scss";
import "./index.scss";

// Área exclusiva da ONG: só o que envolve gerir pedidos, animais, doações, mensagens e conversas.
const FORM_VAZIO = { nome: "", especie: "Cachorro", sexo: "indefinido", porte: "medio", status: "disponivel", energia: "baixa", atencao: "pouca", espaco: "apartamento", experiencia: "iniciante", descricao: "" };
const ABAS = [["pedidos", "Pedidos"], ["animais", "Animais"], ["doacoes", "Doações"], ["mensagens", "Mensagens"], ["conversas", "Conversas"], ["historico", "Histórico"]];
const quando = (d) => (d ? new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "");
const dinheiro = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const VERBO = { animal: "o animal", pedido: "o", doacao: "a", mensagem: "a" };

export default function PainelOng() {
  const navegar = useNavigate();
  const [aba, setAba] = useState("pedidos"); const [ong, setOng] = useState(null);
  const [erro, setErro] = useState(""); const [aviso, setAviso] = useState("");
  const [animais, setAnimais] = useState([]); const [pedidos, setPedidos] = useState([]); const [doacoes, setDoacoes] = useState([]);
  const [mensagens, setMensagens] = useState([]); const [historico, setHistorico] = useState([]); const [ongs, setOngs] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO); const [editando, setEditando] = useState(null); const [foto, setFoto] = useState(null);
  const [filtroDoacao, setFiltroDoacao] = useState("pendente");
  const [minhaFoto, setMinhaFoto] = useState("");
  const naoLidas = useNaoLidas();

  const carregar = useCallback(async () => {
    setErro("");
    try {
      const minha = await api.get("/ongs/minha"); setOng(minha);
      api.get("/usuarios/eu").then(eu => setMinhaFoto(eu.foto_url || "")).catch(() => {});
      const [a, p, d, m, h, o] = await Promise.all([api.get("/pets" + (minha.id ? `?ong_id=${minha.id}` : "")), api.get("/adocao"), api.get("/doacoes"), api.get("/contato"), api.get("/historico"), api.get("/ongs")]);
      setAnimais(a.animais || []); setPedidos(p.adocoes || []); setDoacoes(d.doacoes || []);
      setMensagens(m.mensagens || []); setHistorico(h.historico || []); setOngs(o.ongs || []);
    } catch (e) { setErro(e.message || "Não foi possível carregar o painel."); }
  }, []);

  useEffect(() => {
    if (!estaLogado()) { navegar("/admin/login"); return; }
    if (!ehEquipe()) { navegar("/perfil"); return; }
    carregar();
  }, [carregar, navegar]);

  // atualiza os pedidos sozinho a cada 30 segundos (notificação de pedidos novos)
  useEffect(() => {
    if (!estaLogado() || !ehEquipe()) return undefined;
    const t = setInterval(async () => { try { const d = await api.get("/adocao"); setPedidos(d.adocoes || []); } catch { /* tenta de novo no próximo ciclo */ } }, 30000);
    return () => clearInterval(t);
  }, []);

  const novos = pedidos.filter(p => p.status === "solicitada").length;
  const naoLidasContato = mensagens.filter(m => !m.lido).length;
  const nomeOng = (id) => ongs.find(o => o.id === id)?.nome || (id ? `ONG #${id}` : "Sem ONG");

  async function tentar(fn, padrao) {
    setErro(""); setAviso("");
    try { await fn(); await carregar(); } catch (e) { setErro(e.message || padrao); }
  }

  function decidir(p, status) {
    const c = p.compatibilidade;
    if (status === "aprovada" && (c === null || c === undefined || c < 50)) {
      const texto = c === null || c === undefined ? "Este adotante ainda não respondeu o questionário de compatibilidade." : `A compatibilidade deste pedido é baixa (${c}%).`;
      if (!window.confirm(`${texto} Deseja aprovar mesmo assim?`)) return;
    }
    if (status === "recusada" && !window.confirm("Recusar este pedido de adoção?")) return;
    tentar(() => api.put(`/adocao/${p.id}`, { status }), "Não foi possível atualizar o pedido.");
  }

  function salvarAnimal(e) {
    e.preventDefault();
    tentar(async () => {
      let id = editando;
      if (editando) await api.put(`/pets/${editando}`, form); else id = (await api.post("/pets", form)).id;
      if (foto && id) { const dados = new FormData(); dados.append("foto", foto); await enviarArquivo(`/pets/${id}/foto`, dados); }
      setFoto(null); setForm(FORM_VAZIO); setEditando(null); setAviso("Animal salvo e registrado no histórico.");
    }, "Não foi possível salvar o animal.");
  }
  const apagarAnimal = (a) => { if (window.confirm(`Remover ${a.nome}? Esta ação fica registrada no histórico.`)) tentar(() => api.delete(`/pets/${a.id}`), "Não foi possível remover o animal."); };
  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const editar = (a) => { setEditando(a.id); setForm({ nome: a.nome || "", especie: a.especie || "Cachorro", sexo: a.sexo || "indefinido", porte: a.porte || "medio", status: a.status || "disponivel", energia: a.energia || "baixa", atencao: a.atencao || "pouca", espaco: a.espaco || "apartamento", experiencia: a.experiencia || "iniciante", descricao: a.descricao || "" }); };

  const doacoesFiltradas = doacoes.filter(d => filtroDoacao === "todas" || d.status === filtroDoacao);
  const total = doacoes.filter(d => d.status === "confirmada").reduce((s, d) => s + Number(d.valor || 0), 0);
  const selo = (n) => n > 0 && <i className="selo-numero">{n}</i>;
  // logo da ONG (vale para a ONG toda) e foto pessoal (vale só para esta conta)
  async function enviarLogo(arquivo) { const f = new FormData(); f.append("logo", arquivo); const r = await enviarArquivo("/ongs/minha/logo", f); setOng(o => ({ ...o, logo_url: r.logo_url })); setAviso("Logo da ONG atualizada."); }
  async function apagarLogo() { await api.delete("/ongs/minha/logo"); setOng(o => ({ ...o, logo_url: null })); setAviso("Logo da ONG removida."); }
  async function enviarMinhaFoto(arquivo) { const f = new FormData(); f.append("foto", arquivo); const r = await enviarArquivo("/usuarios/eu/foto", f); setMinhaFoto(r.foto_url); setAviso("Sua foto foi atualizada."); }
  async function apagarMinhaFoto() { await api.delete("/usuarios/eu/foto"); setMinhaFoto(""); setAviso("Sua foto foi removida."); }
  const sair = () => { sairDaConta(); navegar("/admin/login"); };

  if (!estaLogado() || !ehEquipe()) return null;

  return <main className="perfil-pagina">
    <header className="perfil-topo"><Link to="/"><img src="/assets/image/logo-pata.png" alt="Pata Amiga" /></Link><span className="ong-selo">Área da ONG</span></header>
    <section className="perfil-card">
      <div className="perfil-cabecalho"><div><p>Painel da ONG</p><h1>{ong?.nome || "Carregando..."}</h1><span>{lerSessao()?.usuario?.email}</span></div></div>
      <div className="ong-fotos">
        {ong?.id && <FotoEditavel foto={ong.logo_url} inicial={ong.nome?.charAt(0) || "O"} rotulo="Logo da ONG" ajuda="Identifica a sua ONG para os adotantes. Qualquer pessoa da equipe pode trocar." aoEnviar={enviarLogo} aoRemover={apagarLogo} />}
        <FotoEditavel foto={minhaFoto} inicial={lerSessao()?.usuario?.nome?.charAt(0) || "E"} rotulo="Sua foto" ajuda="Foto pessoal: aparece só para a sua conta." aoEnviar={enviarMinhaFoto} aoRemover={apagarMinhaFoto} />
      </div>
      <nav className="perfil-abas">{ABAS.map(([id, rotulo]) => <button type="button" key={id} className={aba === id ? "ativa" : ""} onClick={() => setAba(id)}>{rotulo}
        {id === "pedidos" && selo(novos)}{id === "mensagens" && selo(naoLidasContato)}{id === "conversas" && selo(naoLidas)}</button>)}</nav>
      {erro && <div className="perfil-alerta erro">{erro}</div>}
      {aviso && <div className="perfil-alerta sucesso">{aviso}</div>}
      {novos > 0 && <div className="perfil-alerta sucesso">Você tem {novos} {novos === 1 ? "novo pedido" : "novos pedidos"} de adoção aguardando análise.</div>}

      {aba === "pedidos" && <Pedidos adocoes={pedidos} onDecidir={decidir} />}

      {aba === "animais" && <div className="perfil-conteudo">
        <h2>{editando ? "Editar animal" : "Cadastrar animal"}</h2><p>O animal fica registrado como sendo da sua ONG e a ação entra no histórico.</p>
        <form onSubmit={salvarAnimal}>
          <div className="perfil-form-grid">
            <label>Nome<input required value={form.nome} onChange={set("nome")} /></label>
            <label>Espécie<input value={form.especie} onChange={set("especie")} /></label>
            <label>Sexo<select value={form.sexo} onChange={set("sexo")}><option value="indefinido">Não informado</option><option value="macho">Macho</option><option value="femea">Fêmea</option></select></label>
            <label>Porte<select value={form.porte} onChange={set("porte")}>{["mini", "pequeno", "medio", "grande", "gigante"].map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Status<select value={form.status} onChange={set("status")}>{["disponivel", "reservado", "adotado", "indisponivel"].map(x => <option key={x}>{x}</option>)}</select></label>
            <label>Energia<select value={form.energia} onChange={set("energia")}><option value="baixa">Baixa</option><option value="alta">Alta</option></select></label>
            <label>Atenção necessária<select value={form.atencao} onChange={set("atencao")}><option value="pouca">Pouca</option><option value="muita">Muita</option></select></label>
            <label>Espaço recomendado<select value={form.espaco} onChange={set("espaco")}><option value="apartamento">Apartamento</option><option value="casa_pequena">Casa pequena</option><option value="casa_grande">Casa grande / quintal</option></select></label>
            <label>Experiência do adotante<select value={form.experiencia} onChange={set("experiencia")}><option value="iniciante">Iniciante</option><option value="experiente">Experiente</option></select></label>
            <label>Foto (JPG, PNG ou WEBP, até 2 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFoto(e.target.files?.[0] || null)} /></label>
          </div>
          <label className="ong-campo-largo">História do animal<textarea rows="3" value={form.descricao} onChange={set("descricao")} /></label>
          <div className="ong-botoes"><button className="perfil-primario" type="submit">{editando ? "Salvar edição" : "Cadastrar animal"}</button>
            {editando && <button type="button" className="perfil-secundario" onClick={() => { setEditando(null); setForm(FORM_VAZIO); }}>Cancelar edição</button>}</div>
        </form>
        <h2 className="ong-subtitulo">Animais da sua ONG</h2>
        {animais.length === 0 && <p className="perfil-vazio">Nenhum animal cadastrado pela sua ONG.</p>}
        <div className="ong-lista">{animais.map(a => <article className="ong-linha" key={a.id}><div><strong>{a.nome}</strong><span>{a.especie} · {a.status} · {nomeOng(a.ong_id)}</span></div>
          <div className="ong-acoes-linha"><button type="button" className="perfil-secundario" onClick={() => editar(a)}>Editar</button><button type="button" className="ong-perigo" onClick={() => apagarAnimal(a)}>Excluir</button></div></article>)}</div>
      </div>}

      {aba === "doacoes" && <div className="perfil-conteudo">
        <h2>Doações recebidas</h2><p>Confirme as doações que chegaram para a sua ONG.</p>
        <div className="ong-resumo"><div><strong>{dinheiro(total)}</strong><span>Total confirmado</span></div><div><strong>{doacoes.filter(d => d.status === "pendente").length}</strong><span>Aguardando confirmação</span></div></div>
        <div className="ong-filtros">{[["pendente", "Pendentes"], ["confirmada", "Confirmadas"], ["cancelada", "Canceladas"], ["todas", "Todas"]].map(([v, r]) => <button type="button" key={v} className={filtroDoacao === v ? "ativo" : ""} onClick={() => setFiltroDoacao(v)}>{r}</button>)}</div>
        {doacoesFiltradas.length === 0 && <p className="perfil-vazio">Nenhuma doação nesta lista.</p>}
        <div className="ong-lista">{doacoesFiltradas.map(d => <article className="ong-linha" key={d.id}>
          <div><strong>{d.nome} · {d.tipo === "dinheiro" ? dinheiro(d.valor) : d.tipo}</strong><span>{d.email} · {quando(d.criado_em)} · <span className={`selo-status ${d.status === "pendente" ? "solicitada" : d.status === "confirmada" ? "aprovada" : "recusada"}`}>{d.status}</span></span>{d.mensagem && <small>“{d.mensagem}”</small>}</div>
          <div className="ong-acoes-linha">{d.status !== "confirmada" && <button type="button" className="perfil-primario" onClick={() => tentar(() => api.put(`/doacoes/${d.id}`, { status: "confirmada" }), "Não foi possível confirmar a doação.")}>Aceitar</button>}
            {d.status === "pendente" && <button type="button" className="ong-perigo" onClick={() => window.confirm("Cancelar esta doação?") && tentar(() => api.put(`/doacoes/${d.id}`, { status: "cancelada" }), "Não foi possível cancelar a doação.")}>Cancelar</button>}</div>
        </article>)}</div>
      </div>}

      {aba === "mensagens" && <div className="perfil-conteudo">
        <h2>Mensagens do formulário de contato</h2><p>Mensagens enviadas para a sua ONG por quem não tem conversa aberta.</p>
        {mensagens.length === 0 && <p className="perfil-vazio">Nenhuma mensagem recebida.</p>}
        <div className="ong-lista">{mensagens.map(c => <article className="ong-linha ong-msg" key={c.id}>
          <div><strong>{c.assunto || "Contato"} · {c.nome}{!c.lido && <i className="selo-numero">nova</i>}</strong><span>{c.email} · {quando(c.criado_em)}</span><p>{c.mensagem}</p></div>
          <div className="ong-acoes-linha">{!c.lido && <button type="button" className="perfil-secundario" onClick={() => tentar(() => api.put(`/contato/${c.id}/lido`), "Não foi possível atualizar a mensagem.")}>Marcar como lida</button>}
            <button type="button" className="ong-perigo" onClick={() => window.confirm("Apagar esta mensagem?") && tentar(() => api.delete(`/contato/${c.id}`), "Não foi possível apagar a mensagem.")}>Apagar</button></div>
        </article>)}</div>
      </div>}

      {aba === "conversas" && <div className="perfil-conteudo"><h2>Conversas com adotantes</h2><p>Responda as dúvidas de quem quer adotar os seus animais.</p><ChatPainel /></div>}

      {aba === "historico" && <div className="perfil-conteudo">
        <h2>Histórico de ações</h2><p>Quem, de qual ONG, cadastrou, atualizou, removeu ou decidiu cada item.</p>
        {historico.length === 0 && <p className="perfil-vazio">Nenhuma ação registrada ainda.</p>}
        <div className="ong-lista">{historico.map(h => <article className="ong-linha" key={h.id}><div><span><strong>{h.ong_nome || "Administração geral"}</strong> · {h.usuario_nome || "Equipe"} {h.acao} {VERBO[h.entidade] || ""} <em>{h.descricao}</em></span></div><small>{quando(h.criado_em)}</small></article>)}</div>
      </div>}

      <div className="perfil-rodape"><Link to="/">Voltar ao site</Link><button type="button" onClick={sair}>Sair da conta</button></div>
    </section>
  </main>;
}
