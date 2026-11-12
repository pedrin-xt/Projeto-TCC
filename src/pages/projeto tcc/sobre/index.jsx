
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

function Sobre() {
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  return (
    <div className="sobre">

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

          <Link to="/sobre" className="nav-item ativo">
            Sobre
          </Link>

          <Link to="/contato" className="nav-item">
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
      {/* NOSSA MISSÃO */}
      {/* ========================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <h1>
              Nossa missão: conectar corações e transformar histórias,
              criando novos começos. 🐾
            </h1>

            <p>
              Nascemos do sonho de dar voz a quem não pode falar.
              No PataAmiga, trabalhamos todos os dias para transformar
              a realidade do abandono animal no Brasil, aproximando
              protetores e responsáveis de famílias que desejam abrir
              as portas de casa e oferecer um lar cheio de carinho e amor.
            </p>

          </div>

          <div className="hero-image">

            <img
              src="/assets/image/cachorro2.jpg"
              alt=""
            />

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* COMO TUDO COMEÇOU */}
      {/* ========================= */}

      <section className="story">

        <div className="story-image">

          <img
            src="/assets/image/cachorro.jpg"
            alt=""
          />

        </div>

        <div className="story-text">

          <h2>Como tudo começou</h2>

          <p>
            Tudo começou com um pequeno grupo de voluntários que
            dedicava os fins de semana ao resgate de animais
            abandonados. Com o tempo, percebemos que resgatar era
            apenas o primeiro passo. Também era preciso criar uma
            ponte segura, transparente e responsável entre os abrigos,
            os protetores e as famílias que sonhavam em adotar.
          </p>

          <p>
            Hoje, o PataAmiga é uma plataforma que centraliza
            informações de saúde, comportamento e história de
            centenas de pets, facilitando processos responsáveis
            de adoção e educando novos tutores sobre bem-estar animal.
          </p>

        </div>

      </section>

      {/* ========================= */}
      {/* NOSSOS NÚMEROS */}
      {/* ========================= */}

      <section className="stats">

        <h2>Nossos números de orgulho</h2>

        <div className="stats-container">

          <div className="stat-card">
            <strong>1.200+</strong>
            <span>Pets Adotados</span>
          </div>

          <div className="stat-card">
            <strong>250+</strong>
            <span>Voluntários Ativos</span>
          </div>

          <div className="stat-card">
            <strong>5+ Anos</strong>
            <span>Mapeando Caminhos</span>
          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* RODAPÉ */}
      {/* ========================= */}

      <footer className="rodape">

        <div className="rodape-principal">

          <div className="rodape-marca">

            <img
              src="./assets/image/logo-branca.png"
              alt="PataAmiga"
            />

            <p>
              Mais que um projeto de adoção, um compromisso de amor,
              cuidado e transformação de vidas de pets necessitados
              em todo o Brasil.
            </p>

          </div>

          <div className="rodape-links">

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

        <div className="rodape-final">
          © 2026 PataAmiga. Todos os direitos reservados.
        </div>

      </footer>

    </div>
  );
}

export default Sobre;
