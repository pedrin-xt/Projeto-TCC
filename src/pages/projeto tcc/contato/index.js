
import React, { useState } from "react";
import "./index.scss";

function App() {
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="contato-container">

        <section className="titulo-contato">
          <h1>Fale Conosco 🐾</h1>

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
                <p>(11) 3214-9899 / (11) 98765-4321</p>
              </div>

              <div className="info-item">
                <span className="icone">✉</span>
                <p>contato@pataamiga.org.br</p>
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

      {/* RODAPÉ */}
      <footer className="footer">

        <div className="footer-conteudo">

          <div className="footer-logo">
            <h2>🐾 PataAmiga</h2>

            <p>
              Mais que um projeto de adoção, um
              compromisso de amor e transformação
              de vidas de pets necessitados no Brasil.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h3>Menu</h3>
              <a href="/">Início</a>
              <a href="/adotar">Adotar</a>
              <a href="/doar">Doar</a>
              <a href="/sobre">Sobre Nós</a>
            </div>

            <div>
              <h3>Suporte</h3>
              <a href="/como-funciona">Como Funciona</a>
              <a href="/parceiros">Parceiros</a>
              <a href="/duvidas">Dúvidas Frequentes</a>
              <a href="/contato">Contato</a>
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