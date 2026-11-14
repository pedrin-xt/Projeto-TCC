import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { requisicao } from "../services/api";
import "./index.scss";
import MeuMatchNav from "../componentes/MeuMatchNav";
import { destinoConta } from "../services/api";

export default function Doar() {
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", tipo: "dinheiro", valor: "", mensagem: "" });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [ongs, setOngs] = useState([]);
  useEffect(() => { requisicao("/ongs").then(r => setOngs(r.ongs || [])).catch(() => {}); }, []);

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
    setErro("");
    setSucesso("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    if (form.tipo === "dinheiro" && (!form.valor || Number(form.valor) <= 0)) {
      setErro("Informe um valor válido para a doação.");
      return;
    }
    setCarregando(true);
    try {
      await requisicao("/doacoes", {
        method: "POST",
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          tipo: form.tipo,
          valor: form.tipo === "dinheiro" ? Number(form.valor) : null,
          mensagem: form.mensagem.trim(),
          ong_id: form.ong_id || undefined,
        }),
      });
      setSucesso("Sua intenção de doação foi registrada! Agradecemos por ajudar os animais.");
      setForm(f => ({ nome: "", email: "", tipo: "dinheiro", valor: "", mensagem: "", ong_id: f.ong_id }));
    } catch (e) {
      setErro(e.message || "Não foi possível registrar sua doação. Verifique se a API está funcionando.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-doar">
      <header className="inicio">
        <Link to="/"><img src="/assets/image/logo-pata.png" alt="Logo Pata Amiga" className="logo-pata" /></Link>
        <nav className="menu-navegacao">
          <Link to="/" className="nav-item">Início</Link>
          <Link to="/adotar" className="nav-item">Adotar</Link>
          <Link to="/doar" className="nav-item ativo">Doar</Link>
          <Link to="/sobre" className="nav-item">Sobre</Link>
          <Link to="/contato" className="nav-item">Contato</Link>
        <MeuMatchNav /></nav>
        <div className="icones-header">

          <Link to={destinoConta()} className="botao-favorito botao-perfil" aria-label="Meu perfil" title="Meu perfil"><span className="icone-perfil">♙</span></Link>
        </div>
      </header>

      {mostrarFavoritos && <div className="painel-favoritos"><div className="favoritos-vazio"><span>♡</span><h3>Meus favoritos</h3><p>Os pets que você favoritar aparecerão aqui.</p></div></div>}

      <main className="doar-container">
        <section className="doar-apresentacao">
          <div><span className="doar-etiqueta">UM GESTO DE AMOR</span><h1>Sua ajuda transforma vidas. <span>🐾</span></h1><p>Uma doação pode garantir alimentação, cuidados veterinários e acolhimento para animais que ainda esperam por uma família.</p></div>
          <img src="/assets/image/cachorro-de-lado.png" alt="Cachorro acolhido pelo projeto Pata Amiga" />
        </section>

        <section className="doar-conteudo">
          <div className="doar-texto">
            <h2>Faça parte dessa corrente de cuidado</h2>
            <p>Escolha como deseja contribuir. Nossa equipe receberá seu registro e poderá entrar em contato para combinar os próximos passos.</p>
            <div className="doar-beneficio"><span>♡</span><div><strong>Alimentação</strong><p>Ajude a manter os potinhos cheios.</p></div></div>
            <div className="doar-beneficio"><span>✚</span><div><strong>Saúde e bem-estar</strong><p>Contribua com medicamentos e atendimento veterinário.</p></div></div>
            <div className="doar-beneficio"><span>⌂</span><div><strong>Acolhimento</strong><p>Ajude a oferecer abrigo seguro e confortável.</p></div></div>
            <p className="doar-observacao">O formulário registra sua intenção de doação. Doações em dinheiro não são cobradas automaticamente pelo site.</p>
          </div>

          <section className="doar-form-card">
            <h2>Quero doar</h2><p className="doar-form-intro">Preencha os dados para registrar sua contribuição.</p>
            <form onSubmit={enviar}>
              {ongs.length > 1 && <label className="doar-campo">Para qual ONG?<select name="ong_id" value={form.ong_id || ""} onChange={alterar} required><option value="">Escolha a ONG</option>{ongs.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}</select></label>}
              <label className="doar-campo">Nome completo<input name="nome" value={form.nome} onChange={alterar} placeholder="Como podemos te chamar?" required /></label>
              <label className="doar-campo">E-mail<input type="email" name="email" value={form.email} onChange={alterar} placeholder="seu@email.com" required /></label>
              <label className="doar-campo">Tipo de doação<select name="tipo" value={form.tipo} onChange={alterar} required><option value="dinheiro">Dinheiro</option><option value="alimento">Alimentos</option><option value="medicamento">Medicamentos</option><option value="outro">Outros itens</option></select></label>
              {form.tipo === "dinheiro" && <label className="doar-campo">Valor da contribuição (R$)<input type="number" name="valor" min="0.01" step="0.01" value={form.valor} onChange={alterar} placeholder="Ex.: 50,00" required /></label>}
              <label className="doar-campo">Mensagem <span>(opcional)</span><textarea name="mensagem" value={form.mensagem} onChange={alterar} placeholder="Conte um pouco sobre sua doação ou deixe uma mensagem." rows="4" /></label>
              {erro && <p className="doar-alerta erro" role="alert">{erro}</p>}
              {sucesso && <p className="doar-alerta sucesso" role="status">{sucesso}</p>}
              <button type="submit" className="doar-enviar" disabled={carregando}>{carregando ? "Registrando..." : "Registrar doação  ➜"}</button>
            </form>
          </section>
        </section>
      </main>

      <footer className="doar-footer"><img src="/assets/image/logo-branca.png" alt="Pata Amiga" /><p>Mais que um projeto de adoção, um compromisso de amor e transformação de vidas.</p><div><Link to="/">Início</Link><Link to="/adotar">Adotar</Link><Link to="/sobre">Sobre</Link><Link to="/contato">Contato</Link></div><small>© 2026 Pata Amiga. Todos os direitos reservados.</small></footer>
    </div>
  );
}
