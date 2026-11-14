import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { requisicao, api, ehEquipe, enviarArquivo, urlImagem } from "../services/api";
import FotoEditavel from "../componentes/FotoEditavel";
import Compat, { SeloStatus } from "../componentes/Compat";
import { ChatPainel, BotaoConversar, useNaoLidas } from "../chat";
import "./index.scss";

const perfilVazio = { espaco: "", atividade: "", tempo: "", experiencia: "", criancas: "", outros_pets: "" };

function imagemAnimal(animal) {
  return urlImagem(animal.foto_url || animal.imagem);
}

export default function Perfil() {
  const navegar = useNavigate();
  const location = useLocation();
  const naoLidas = useNaoLidas();
  const abaInicial = location.state?.aba;
  const [aba, setAba] = useState(abaInicial && abaInicial !== "match" ? abaInicial : "perfil");
  const [enviando, setEnviando] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [formConta, setFormConta] = useState({ nome: "", email: "", telefone: "" });
  const [senhaForm, setSenhaForm] = useState({ senha_atual: "", senha_nova: "", confirmar: "" });
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(perfilVazio);
  const [temPerfil, setTemPerfil] = useState(false);
  const [animais, setAnimais] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [adocoes, setAdocoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const sessao = JSON.parse(localStorage.getItem("pataamiga_sessao") || "null");
    if (!sessao?.token) { navegar("/login"); return; }
    if (ehEquipe()) { navegar("/admin"); return; }
    localStorage.removeItem("pataamiga_foto_perfil");   // foto antiga guardada no navegador (era igual para todas as contas)
    carregarUsuario();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function carregarUsuario() {
    setCarregando(true); setErro("");
    try {
      const dados = await requisicao("/usuarios/eu");
      setUsuario(dados);
      setFotoPerfil(dados.foto_url || "");
      setFormConta({ nome: dados.nome || "", email: dados.email || "", telefone: dados.telefone || "" });
      const [dadosPerfil, dadosFavoritos, dadosAdocoes] = await Promise.allSettled([
        requisicao(`/adotantes/${dados.id}`), requisicao("/favoritos"), requisicao("/adocao/minhas")
      ]);
      if (dadosPerfil.status === "fulfilled") {
        setPerfil({ ...perfilVazio, ...dadosPerfil.value, criancas: String(Boolean(dadosPerfil.value.criancas)), outros_pets: String(Boolean(dadosPerfil.value.outros_pets)) });
        setTemPerfil(true);
      }
      if (dadosFavoritos.status === "fulfilled") setFavoritos(dadosFavoritos.value.animais || []);
      if (dadosAdocoes.status === "fulfilled") setAdocoes(dadosAdocoes.value.adocoes || []);
      if (abaInicial === "match") calcularMatch(dados.id, dadosPerfil.status === "fulfilled");   // veio de "Meu Match" no menu
    } catch (e) {
      setErro(e.message || "Não foi possível carregar seu perfil.");
    } finally { setCarregando(false); }
  }

  async function enviarFoto(arquivo) {
    const dados = new FormData(); dados.append("foto", arquivo);
    const r = await enviarArquivo("/usuarios/eu/foto", dados);
    setFotoPerfil(r.foto_url); setMensagem("Foto de perfil atualizada."); setErro("");
  }

  async function apagarFoto() {
    await api.delete("/usuarios/eu/foto");
    setFotoPerfil(""); setMensagem("Foto de perfil removida."); setErro("");
  }

  async function salvarDadosConta(e) {
    e.preventDefault(); setSalvando(true); setErro(""); setMensagem("");
    try {
      await requisicao("/usuarios/eu", { method: "PUT", body: JSON.stringify({ nome: formConta.nome, telefone: formConta.telefone }) });
      if (formConta.email.trim().toLowerCase() !== String(usuario.email || "").toLowerCase()) {
        if (!formConta.senha_atual_email) throw new Error("Informe sua senha atual para confirmar a troca de e-mail.");
        await requisicao("/usuarios/eu/email", { method: "PUT", body: JSON.stringify({ email: formConta.email, senha_atual: formConta.senha_atual_email }) });
      }
      const atualizado = await requisicao("/usuarios/eu"); setUsuario(atualizado);
      setFormConta({ nome: atualizado.nome || "", email: atualizado.email || "", telefone: atualizado.telefone || "" });
      setMensagem("Dados da conta atualizados com sucesso.");
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }

  async function alterarSenha(e) {
    e.preventDefault(); setErro(""); setMensagem("");
    if (senhaForm.senha_nova !== senhaForm.confirmar) { setErro("A confirmação da nova senha não confere."); return; }
    setSalvando(true);
    try {
      const r = await requisicao("/usuarios/eu/senha", { method: "PUT", body: JSON.stringify({ senha_atual: senhaForm.senha_atual, senha_nova: senhaForm.senha_nova }) });
      setMensagem(r.mensagem || "Senha alterada com sucesso."); setSenhaForm({ senha_atual: "", senha_nova: "", confirmar: "" });
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }

  async function salvarPerfil(e) {
    e.preventDefault(); setSalvando(true); setErro(""); setMensagem("");
    const corpo = { ...perfil, criancas: perfil.criancas === "true", outros_pets: perfil.outros_pets === "true" };
    try {
      if (temPerfil) await requisicao(`/adotantes/${usuario.id}`, { method: "PUT", body: JSON.stringify(corpo) });
      else await requisicao("/adotantes", { method: "POST", body: JSON.stringify(corpo) });
      setTemPerfil(true); setMensagem("Questionário salvo! Agora você pode consultar seus matches.");
    } catch (e) { setErro(e.message); }
    finally { setSalvando(false); }
  }

  async function calcularMatch(idUsuario = usuario?.id, tenho = temPerfil) {
    setErro(""); setMensagem(""); setAnimais([]);
    try {
      if (!tenho) { setAba("match"); setErro("Preencha e salve o questionário PetMatch antes de calcular a compatibilidade."); return; }
      const resultado = await requisicao(`/match/adotante/${idUsuario}`);
      setAnimais(resultado.animais || []); setAba("match");
      if (!resultado.animais?.length) setMensagem("Ainda não há animais disponíveis para comparar.");
    } catch (e) { setErro(e.message); setAba("match"); }
  }

  async function favoritar(animal) {
    try {
      const existe = favoritos.some(f => Number(f.id) === Number(animal.id));
      if (existe) {
        await requisicao(`/favoritos/${animal.id}`, { method: "DELETE" });
        setFavoritos(lista => lista.filter(f => Number(f.id) !== Number(animal.id)));
      } else {
        await requisicao(`/favoritos/${animal.id}`, { method: "POST" });
        setFavoritos(lista => [...lista, animal]);
      }
    } catch (e) { setErro(e.message); }
  }

  // pedidos de adoção
  const pedidosAtivos = adocoes.filter(a => ["solicitada", "em_analise", "aprovada"].includes(a.status)).map(a => Number(a.animal_id));

  async function solicitar(animal) {
    setEnviando(animal.id); setErro(""); setMensagem("");
    try {
      await api.post("/adocao", { animal_id: animal.id });
      const r = await api.get("/adocao/minhas"); setAdocoes(r.adocoes || []);
      setMensagem(`Solicitação enviada para ${animal.nome}! Acompanhe em "Minhas solicitações".`);
    } catch (e) { setErro(e.message); }
    finally { setEnviando(null); }
  }

  async function cancelarPedido(id) {
    if (!window.confirm("Cancelar este pedido de adoção?")) return;
    try { await api.delete(`/adocao/${id}`); setAdocoes(l => l.filter(x => x.id !== id)); }
    catch (e) { setErro(e.message); }
  }

  function acoesPedido(animal) {
    return <div className="perfil-acoes-pedido">
      {pedidosAtivos.includes(Number(animal.id))
        ? <span className="perfil-enviado">✓ Solicitação enviada</span>
        : <button type="button" className="perfil-primario" disabled={enviando === animal.id} onClick={() => solicitar(animal)}>{enviando === animal.id ? "Enviando..." : "Solicitar adoção"}</button>}
      <BotaoConversar animalId={animal.id} animalNome={animal.nome} aoIniciar={() => setAba("conversas")} />
    </div>;
  }

  async function sair() {
    localStorage.removeItem("pataamiga_sessao"); navegar("/");
  }

  if (carregando) return <main className="perfil-pagina"><section className="perfil-card"><p>Carregando seu perfil...</p></section></main>;

  return <main className="perfil-pagina">
    <header className="perfil-topo"><Link to="/"><img src="/assets/image/logo-pata.png" alt="Pata Amiga" /></Link><Link to="/adotar">Conhecer animais</Link></header>
    <section className="perfil-card">
      <div className="perfil-cabecalho"><div className="perfil-avatar-wrap"><img className="perfil-avatar-foto" src={urlImagem(fotoPerfil, "")} alt="" style={{ display: fotoPerfil ? "block" : "none" }} /><span className="perfil-avatar" style={{ display: fotoPerfil ? "none" : "grid" }}>{usuario?.nome?.charAt(0)?.toUpperCase() || "U"}</span></div><div><p>Minha conta</p><h1>Olá, {usuario?.nome || "adotante"}!</h1><span>{usuario?.email}</span></div></div>
      <nav className="perfil-abas">
        <button className={aba === "perfil" ? "ativa" : ""} onClick={() => {setAba("perfil");setErro("");setMensagem("");}}>Minha conta</button>
        <button className={aba === "seguranca" ? "ativa" : ""} onClick={() => {setAba("seguranca");setErro("");setMensagem("");}}>Segurança</button>
        <button className={aba === "petmatch" ? "ativa" : ""} onClick={() => {setAba("petmatch");setErro("");setMensagem("");}}>Questionário PetMatch</button>
        <button className={aba === "match" ? "ativa" : ""} onClick={() => calcularMatch()}>Meus Matches</button>
        <button className={aba === "favoritos" ? "ativa" : ""} onClick={() => setAba("favoritos")}>Favoritos ({favoritos.length})</button>
        <button className={aba === "adocoes" ? "ativa" : ""} onClick={() => setAba("adocoes")}>Minhas solicitações</button>
        <button className={aba === "conversas" ? "ativa" : ""} onClick={() => setAba("conversas")}>Conversas{naoLidas > 0 && <i className="selo-numero">{naoLidas}</i>}</button>
      </nav>
      {erro && <div className="perfil-alerta erro">{erro}</div>}{mensagem && <div className="perfil-alerta sucesso">{mensagem}</div>}

      {aba === "perfil" && <div className="perfil-conteudo">
        <h2>Minha conta</h2><p>Atualize suas informações pessoais e sua foto de perfil.</p>
        <FotoEditavel foto={fotoPerfil} inicial={usuario?.nome?.charAt(0) || "U"} rotulo="Foto de perfil" ajuda="JPG, PNG ou WEBP de até 2 MB. A foto fica salva na sua conta e vale em qualquer aparelho." tamanho={96} aoEnviar={enviarFoto} aoRemover={apagarFoto} />
        <form onSubmit={salvarDadosConta}><div className="perfil-dados"><label>Nome completo<input value={formConta.nome} onChange={e => setFormConta({...formConta,nome:e.target.value})} required /></label><label>E-mail<input type="email" value={formConta.email} onChange={e => setFormConta({...formConta,email:e.target.value})} required /></label><label>Telefone<input value={formConta.telefone} onChange={e => setFormConta({...formConta,telefone:e.target.value})} /></label><label>Tipo de conta<input value={usuario?.perfil || "adotante"} readOnly /></label></div>
        {formConta.email.trim().toLowerCase() !== String(usuario?.email || "").toLowerCase() && <label className="perfil-campo-senha">Senha atual para confirmar a troca de e-mail<input type="password" value={formConta.senha_atual_email || ""} onChange={e => setFormConta({...formConta,senha_atual_email:e.target.value})} required /></label>}
        <button className="perfil-primario" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar alterações"}</button></form>
        <div className="perfil-match-destaque"><div><span>🐾</span><div><strong>Encontre seu melhor amigo</strong><p>Responda ao PetMatch e descubra quais animais combinam com sua rotina.</p></div></div><button className="perfil-primario" onClick={() => setAba("petmatch")}>Acessar PetMatch</button></div>
      </div>}

      {aba === "seguranca" && <form className="perfil-conteudo" onSubmit={alterarSenha}><h2>Segurança da conta</h2><p>Para sua proteção, informe sua senha atual antes de escolher uma nova.</p><div className="perfil-dados perfil-senhas"><label>Senha atual<input type="password" autoComplete="current-password" value={senhaForm.senha_atual} onChange={e => setSenhaForm({...senhaForm,senha_atual:e.target.value})} required /></label><label>Nova senha<input type="password" autoComplete="new-password" minLength="6" value={senhaForm.senha_nova} onChange={e => setSenhaForm({...senhaForm,senha_nova:e.target.value})} required /></label><label>Confirmar nova senha<input type="password" autoComplete="new-password" minLength="6" value={senhaForm.confirmar} onChange={e => setSenhaForm({...senhaForm,confirmar:e.target.value})} required /></label></div><button className="perfil-primario" type="submit" disabled={salvando}>{salvando ? "Atualizando..." : "Alterar senha"}</button></form>}

      {aba === "petmatch" && <form className="perfil-conteudo" onSubmit={salvarPerfil}><h2>Questionário PetMatch</h2><p>Conte um pouco sobre sua rotina e sua casa. Usaremos essas respostas para encontrar animais com maior compatibilidade.</p>
        <div className="perfil-form-grid">
          <label>Como é sua moradia?<select required value={perfil.espaco} onChange={e => setPerfil({...perfil, espaco:e.target.value})}><option value="">Selecione</option><option value="apartamento">Apartamento</option><option value="casa_pequena">Casa pequena</option><option value="casa_grande">Casa com quintal / espaço amplo</option></select></label>
          <label>Como é seu nível de atividade?<select required value={perfil.atividade} onChange={e => setPerfil({...perfil, atividade:e.target.value})}><option value="">Selecione</option><option value="baixa">Baixo / tranquilo</option><option value="alta">Alto / ativo</option></select></label>
          <label>Quanto tempo você tem disponível por dia?<select required value={perfil.tempo} onChange={e => setPerfil({...perfil, tempo:e.target.value})}><option value="">Selecione</option><option value="muito">Bastante tempo</option><option value="pouco">Pouco tempo</option></select></label>
          <label>Qual sua experiência com animais?<select required value={perfil.experiencia} onChange={e => setPerfil({...perfil, experiencia:e.target.value})}><option value="">Selecione</option><option value="iniciante">Primeira adoção / iniciante</option><option value="experiente">Já tenho experiência</option></select></label>
          <label>Há crianças na residência?<select required value={perfil.criancas} onChange={e => setPerfil({...perfil, criancas:e.target.value})}><option value="">Selecione</option><option value="true">Sim</option><option value="false">Não</option></select></label>
          <label>Já existem outros animais na casa?<select required value={perfil.outros_pets} onChange={e => setPerfil({...perfil, outros_pets:e.target.value})}><option value="">Selecione</option><option value="true">Sim</option><option value="false">Não</option></select></label>
        </div><button className="perfil-primario" type="submit" disabled={salvando}>{salvando ? "Salvando..." : temPerfil ? "Atualizar questionário" : "Salvar questionário"}</button><button type="button" className="perfil-secundario" onClick={() => calcularMatch()}>Ver meus matches</button>
      </form>}

      {aba === "match" && <div className="perfil-conteudo"><h2>Seus matches</h2><p>Animais disponíveis ordenados pela compatibilidade com seu perfil.</p>{!temPerfil ? <button className="perfil-primario" onClick={() => setAba("petmatch")}>Responder questionário</button> : <button className="perfil-secundario" onClick={() => calcularMatch()}>Atualizar resultados</button>}<div className="perfil-animais">{animais.map(animal => <article className="perfil-animal" key={animal.id}><img src={imagemAnimal(animal)} alt={animal.nome} onError={e => {e.currentTarget.src="/assets/image/logo-pata.png";}}/><div className="perfil-animal-info"><span className="perfil-percentual">{animal.compatibilidade}% compatível</span><h3>{animal.nome}</h3><p>{animal.tipo || animal.especie} {animal.porte_label ? `• ${animal.porte_label}` : ""}</p><p>{animal.motivos?.join(" · ") || "Compatibilidade calculada pelo questionário"}</p><Link to="/adotar">Ver animais</Link>{acoesPedido(animal)}</div><button className="perfil-coracao" onClick={() => favoritar(animal)} aria-label="Favoritar">{favoritos.some(f => Number(f.id) === Number(animal.id)) ? "♥" : "♡"}</button></article>)}</div></div>}

      {aba === "favoritos" && <div className="perfil-conteudo"><h2>Meus favoritos</h2><p>Animais que você salvou para conhecer depois.</p>{favoritos.length ? <div className="perfil-animais">{favoritos.map(animal => <article className="perfil-animal" key={animal.id}><img src={imagemAnimal(animal)} alt={animal.nome} onError={e => {e.currentTarget.src="/assets/image/logo-pata.png";}}/><div className="perfil-animal-info"><h3>{animal.nome}</h3><p>{animal.tipo || animal.especie}</p><Link to="/adotar">Ver animais disponíveis</Link>{acoesPedido(animal)}</div><button className="perfil-coracao" onClick={() => favoritar(animal)}>♥</button></article>)}</div> : <p className="perfil-vazio">Você ainda não favoritou nenhum animal.</p>}</div>}

      {aba === "adocoes" && <div className="perfil-conteudo"><h2>Minhas solicitações de adoção</h2><p>Acompanhe o andamento dos seus pedidos. A decisão final é da ONG responsável.</p>{adocoes.length ? <div className="perfil-lista-adocoes">{adocoes.map(item => <article key={item.id}><div><strong>{item.animal_nome}</strong><span>Solicitação #{item.id} · {item.data_solicitacao ? new Date(item.data_solicitacao).toLocaleDateString("pt-BR") : "Data não informada"}</span><Compat valor={item.compatibilidade} /><BotaoConversar animalId={item.animal_id} animalNome={item.animal_nome} aoIniciar={() => setAba("conversas")} /></div><div className="perfil-adocao-lado"><SeloStatus status={item.status} />{["solicitada", "em_analise"].includes(item.status) && <button type="button" className="perfil-link-btn" onClick={() => cancelarPedido(item.id)}>Cancelar pedido</button>}</div></article>)}</div> : <p className="perfil-vazio">Você ainda não possui solicitações. <Link to="/adotar">Conheça os animais disponíveis.</Link></p>}</div>}
      {aba === "conversas" && <div className="perfil-conteudo"><h2>Conversas com a ONG</h2><p>Tire dúvidas sobre os animais e acompanhe as respostas.</p><ChatPainel /></div>}
      <div className="perfil-rodape"><Link to="/">Voltar ao início</Link><button onClick={sair}>Sair da conta</button></div>
    </section>
  </main>;
}
