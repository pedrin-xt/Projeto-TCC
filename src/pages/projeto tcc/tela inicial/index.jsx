
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Index.scss';

function Index() {
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  return (
    <div className="inicial">

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

          <Link
            to="/"
            className="nav-item ativo"
          >
            Início
          </Link>

          <Link
            to="/adotar"
            className="nav-item"
          >
            Adotar
          </Link>

          <Link
            to="/doar"
            className="nav-item"
          >
            Doar
          </Link>

          <Link
            to="/sobre"
            className="nav-item"
          >
            Sobre
          </Link>

          <Link
            to="/contato"
            className="nav-item"
          >
            Contato
          </Link>

        </nav>

        {/* ÍCONES */}
        <div className="icones-header">

          {/* LOGIN */}
          <Link to="/login" className="login-link">
            <img
              src="./assets/image/log-up.png"
              alt="Login"
              className="login"
            />
          </Link>

          {/* FAVORITOS */}
          <button
            className="botao-favorito"
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            aria-label="Ver favoritos"
          >
            <span className="coracao-verde">
              ♡
            </span>
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
      {/* PRIMEIRA PARTE */}
      {/* ========================= */}

      <section className="quadrado-verde">

        <div className="texto-quadrado">

          <h1 className="lar">
            Um lar pode transformar uma vida.
          </h1>

          <p className="paragrafo">
            Milhares de pets esperam por uma família. Talvez o próximo
            encontro que você procura esteja aqui.
          </p>

        </div>


        {/* IMAGEM */}
        <div className="img-quadrado">

          <img
            src="./assets/image/cachorro-gato.jpg"
            alt="Cachorro e gato"
            className="f1"
          />

        </div>


        {/* BOTÃO ADOTAR */}
        <Link to="/adotar" className="adotar">

          🐾 Quero Adotar

          <img
            src="./assets/image/seta.png"
            alt="Seta"
            className="seta"
          />

        </Link>


        {/* BOTÃO DOAR */}
        <Link to="/doar" className="doar">
          💖 Quero Doar
        </Link>

      </section>


      {/* ========================= */}
      {/* TERCEIRA PARTE */}
      {/* ========================= */}

      <section className="quadrado-branco">

        {/* PATINHA ESQUERDA */}
        <img
          src="./assets/image/pata-esquerda.png"
          alt=""
          className="pataesquerda"
        />


        {/* PATINHA DIREITA */}
        <img
          src="./assets/image/pata-direita.png"
          alt=""
          className="patadireita"
        />


        {/* CARD ADOTE */}
        <div className="div-adotar">

          <img
            src="./assets/image/circulo pata.jpg"
            alt=""
            className="adotar-img"
          />

          <h1 className="adote-h1">
            Adote
          </h1>

          <p className="adote-p">
            Adotar um cachorro é oferecer amor, proteção e uma nova chance
            de vida a um animal que precisa de um lar e de uma família.
          </p>

        </div>


        {/* CARD DOE */}
        <div className="doe">

          <img
            src="./assets/image/coracao verde.png"
            alt=""
            className="doe-img"
          />

          <h1 className="doe-h1">
            Doe
          </h1>

          <p className="doe-p">
            Doar ajuda animais que precisam de alimento, cuidados
            veterinários, abrigo e carinho, garantindo melhores condições
            de vida e novas oportunidades.
          </p>

        </div>


        {/* CARD FAÇA A DIFERENÇA */}
        <div className="diferença">

          <img
            src="./assets/image/folha verde.png"
            alt=""
            className="diferença-img"
          />

          <h1 className="diferença-h1">
            Faça a Diferença
          </h1>

          <p className="diferença-p">
            Pequenas atitudes podem mudar completamente a vida de um animal,
            oferecendo esperança, segurança e a chance de encontrar um lar
            cheio de carinho.
          </p>

        </div>


      </section>


      {/* ========================= */}
      {/* PARTE FINAL */}
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

export default Index;