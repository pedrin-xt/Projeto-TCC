
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function App() {

  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setEnviado(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setEnviado(true);

    setForm({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
  }

  return (
    <div className="pagina">

      {/* ========================= */}
      {/* BARRA INICIAL */}
      {/* ========================= */}

      <header className="inicio">

        {/* LOGO */}
        <Link to="/">
          <img
            src="./assets/image/logo-pata.png"
            alt="Logo Pata Amiga"
            className="logo-pata"
          />
        </Link>

        {/* MENU */}
        <nav className="menu-navegacao">

          <Link to="/" className="nav-item">
            Início
          </Link>

          <Link to="/adotar" className="nav-item">
            Adotar
          </Link>

          <Link to="/doar" className="nav-item">
            Doar
          </Link>

          <Link to="/sobre" className="nav-item">
            Sobre
          </Link>

          <Link to="/contato" className="nav-item ativo">
            Contato
          </Link>

        </nav>

        {/* ÍCONES */}
        <div className="icones-header">

          <Link to="/login" className="login-link">
            <img
              src="./assets/image/log-up.png"
              alt="Login"
              className="login"
            />
          </Link>

          <button
            className="botao-favorito"
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            aria-label="Ver favoritos"
          >
            <span className="coracao-verde">♡</span>
          </button>

        </div>

      </header>

      {/* ========================= */}
      {/* FAVORITOS */}
      {/* ========================= */}

      {mostrarFavoritos && (
        <div className="painel-favoritos">

          <div className="favoritos-vazio">

            <span>♡</span>

            <h3>Meus favoritos</h3>

            <p>
              Os pets que você favoritar aparecerão aqui.
            </p>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ========================= */}

      <main className="contato-container">

        <section className="titulo-contato">

          <h1>Fale Conosco </h1>

          <p>
            Tem alguma dúvida sobre o processo de adoção,
            doações ou quer ser voluntário? Nossa equipe
            responderá o mais breve possível.
          </p>

        </section>

        <div className="contato-grid">

          {/* FORMULÁRIO */}
          <section className="form-card">

            <h2>Envie uma mensagem</h2>

            <form onSubmit={handleSubmit}>

              <div className="campo">
                <label>Nome Completo</label>

                <input
                  type="text"
                  name="nome"
                  placeholder="Ex: Maria Oliveira"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label>E-mail</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Ex: maria@provedor.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label>Telefone / WhatsApp</label>

                <input
                  type="tel"
                  name="telefone"
                  placeholder="Ex: (11) 99999-9999"
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label>Assunto</label>

                <select
                  name="assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma opção...</option>
                  <option value="Adocao">Adoção</option>
                  <option value="Doacao">Doação</option>
                  <option value="Apadrinhamento">Apadrinhamento</option>
                  <option value="Voluntariado">Voluntariado</option>
                  <option value="Duvidas">Dúvidas gerais</option>
                </select>
              </div>

              <div className="campo">
                <label>Mensagem</label>

                <textarea
                  name="mensagem"
                  placeholder="Escreva sua mensagem aqui detalhadamente..."
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-enviar">
                Enviar Mensagem <span>➜</span>
              </button>

              {enviado && (
                <p className="mensagem-sucesso">
                  Mensagem registrada com sucesso!
                </p>
              )}

            </form>

          </section>

          {/* INFORMAÇÕES */}
          <div className="lado-direito">

            <section className="informacoes-card">

              <h2>Informações de Contato</h2>

              <div className="info-item">
                <span className="icone">⌖</span>

                <p>
                  Av. Paulista, 1000 - Bela Vista,
                  São Paulo - SP
                </p>
              </div>

              <div className="info-item">
                <span className="icone">☎</span>

                <p>
                  (11) 3214-9899 / (11) 98765-4321
                </p>
              </div>

              <div className="info-item">
                <span className="icone">✉</span>

                <p>
                  contato@pataamiga.org.br
                </p>
              </div>

              <div className="horario">

                <h3>Horário de Funcionamento</h3>

                <p>Segunda a Sexta: 09:00h às 18:00h</p>

                <p>Sábados e Feriados: 10:00h às 14:00h</p>

              </div>

            </section>

            {/* MAPA */}
            <section className="mapa-card">

              <h3>Como nos encontrar</h3>

              <iframe
                title="Localização PataAmiga"
                src="https://maps.google.com/maps?q=Avenida%20Paulista%2C%20Sao%20Paulo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                allowFullScreen
              />

            </section>

          </div>

        </div>

      </main>

      {/* ========================= */}
      {/* RODAPÉ */}
      {/* ========================= */}

      <footer className="footer">

        <div className="footer-conteudo">

          <div className="footer-logo">

            <img
              src="./assets/image/logo-branca.png"
              alt="PataAmiga"
            />

            <p>
              Mais que um projeto de adoção, um
              compromisso de amor e transformação
              de vidas de pets necessitados no Brasil.
            </p>

          </div>

          <div className="footer-links">

            <div>
              <h3>Menu</h3>

              <Link to="/">Início</Link>
              <Link to="/adotar">Adotar</Link>
              <Link to="/doar">Doar</Link>
              <Link to="/sobre">Sobre Nós</Link>
            </div>

            <div>
              <h3>Suporte</h3>

              <Link to="/contato">Como Funciona</Link>
              <Link to="/contato">Parceiros</Link>
              <Link to="/contato">Dúvidas Frequentes</Link>
              <Link to="/contato">Contato</Link>
            </div>

          </div>

        </div>

        <div className="footer-final">

          <p className="sla">
            © 2026 PataAmiga. Todos os direitos reservados.
            Feito com amor por pets.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;
