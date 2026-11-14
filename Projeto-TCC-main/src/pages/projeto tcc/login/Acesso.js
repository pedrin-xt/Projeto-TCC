import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requisicao, salvarSessao, api } from "../services/api";
import "./index.scss";

export default function Acesso({ equipe = false }) {
  const [modo, setModo] = useState("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [ongs, setOngs] = useState([]);
  const [ongId, setOngId] = useState("");
  useEffect(() => { if (equipe) api.get("/ongs").then(r => setOngs(r.ongs || [])).catch(() => {}); }, [equipe]);
  const navegar = useNavigate();

  const cadastro = modo === "criar";

  async function enviar(evento) {
    evento.preventDefault();
    setMensagem("");
    setErro("");

    if (cadastro && (!nome.trim() || !email.trim() || !senha.trim())) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (equipe && cadastro && !codigo.trim()) {
      setErro("Informe o código de acesso fornecido pela coordenação da ONG.");
      return;
    }

    setCarregando(true);
    try {
      const rota = equipe
        ? cadastro ? "/admins/registro" : "/admins/login"
        : cadastro ? "/usuarios/registro" : "/usuarios/login";

      const corpo = equipe
        ? cadastro
          ? { nome, email, senha, telefone, codigo, ong_id: ongId || undefined }
          : { email, senha }
        : cadastro
          ? { nome, email, senha, telefone }
          : { email, senha };

      const dados = await requisicao(rota, {
        method: "POST",
        body: JSON.stringify(corpo),
      });

      if (!cadastro) {
        if (!equipe && ["admin", "voluntario"].includes((dados.usuario || dados).perfil)) {
          throw new Error("Esta conta é da ONG. Use a aba ONG para entrar.");
        }
        salvarSessao(dados);
        setMensagem(equipe
          ? "Login realizado. Acesso da equipe autorizado pela API."
          : "Login realizado com sucesso!");
        navegar(equipe ? "/admin" : "/perfil");
      } else {
        setMensagem(equipe
          ? "Cadastro da equipe realizado com sucesso. Agora você já pode entrar."
          : "Cadastro realizado com sucesso. Agora você já pode entrar.");
        setModo("entrar");
        setSenha("");
        setCodigo("");
      }
    } catch (e) {
      setErro(e.message || "Ocorreu um erro. Verifique a conexão com a API.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="acesso-pagina">
      <Link to="/" className="acesso-voltar">← Voltar ao site</Link>

      <section className="acesso-card">
        <img className="acesso-logo" src="/assets/image/logo-pata.png" alt="Pata Amiga" />
        <h1>{equipe ? "Área da equipe" : "Bem-vindo ao Pata Amiga"}</h1>
        <p className="acesso-subtitulo">
          {equipe
            ? "Acesso restrito a administradores e integrantes autorizados da ONG."
            : "Entre na sua conta ou crie seu cadastro para fazer parte dessa história."}
        </p>

        <div className="login-tipos" role="tablist" aria-label="Tipo de acesso">
          <Link to="/login" className={!equipe ? "login-tipo ativo" : "login-tipo"}>Usuário</Link>
          <Link to="/admin/login" className={equipe ? "login-tipo ativo" : "login-tipo"}>ONG</Link>
        </div>

        <div className="acesso-abas">
          <button type="button" className={modo === "entrar" ? "selecionado" : ""} onClick={() => {setModo("entrar");setErro("");setMensagem("");}}>Entrar</button>
          <button type="button" className={modo === "criar" ? "selecionado" : ""} onClick={() => {setModo("criar");setErro("");setMensagem("");}}>Criar conta</button>
        </div>

        <form onSubmit={enviar} className="acesso-formulario">
          {cadastro && (
            <label>Nome completo
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" autoComplete="name" required />
            </label>
          )}
          <label>E-mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" required />
          </label>
          {cadastro && (
            <label>Telefone <span>(opcional)</span>
              <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" autoComplete="tel" />
            </label>
          )}
          <label>Senha
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua senha" autoComplete={cadastro ? "new-password" : "current-password"} required />
          </label>
          {equipe && cadastro && ongs.length > 1 && (
            <label>ONG
              <select value={ongId} onChange={e => setOngId(e.target.value)} required>
                <option value="">Escolha a sua ONG</option>
                {ongs.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
            </label>
          )}
          {equipe && cadastro && (
            <label>Código de acesso da ONG
              <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código fornecido pela coordenação" required />
            </label>
          )}

          {equipe && cadastro && (
            <p className="login-info-equipe">
              Este cadastro cria um acesso para um integrante da equipe da ONG. É necessário informar o código de acesso configurado pela administração do sistema.
            </p>
          )}
          {erro && <p className="acesso-alerta erro" role="alert">{erro}</p>}
          {mensagem && <p className="acesso-alerta sucesso" role="status">{mensagem}</p>}
          <button className="acesso-enviar" type="submit" disabled={carregando}>
            {carregando ? "Aguarde..." : cadastro ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <p className="acesso-rodape">
          {equipe
            ? "O acesso da ONG é separado do cadastro de usuários."
            : "Ao continuar, você poderá acompanhar suas interações com o Pata Amiga."}
        </p>
      </section>
    </main>
  );
}
