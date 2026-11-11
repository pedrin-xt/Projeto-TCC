
import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function Index() {
  const [busca, setBusca] = useState("");
  const [especie, setEspecie] = useState("");
  const [porte, setPorte] = useState("");
  const [idade, setIdade] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  const animais = [
    {
      id: 1,
      nome: "Luna",
      tipo: "Gata",
      idade: "4 anos",
      porte: "Pequeno",
      imagem: "/assets/image-animais/luna.png"
    },
    {
      id: 2,
      nome: "Luke",
      tipo: "Cachorro",
      idade: "3 anos",
      porte: "Médio",
      imagem: "/assets/image-animais/luke.png"
    },
    {
      id: 3,
      nome: "Pipoca",
      tipo: "Gata",
      idade: "3 meses",
      porte: "Pequeno",
      imagem: "/assets/image-animais/pipoca.png"
    },
    {
      id: 4,
      nome: "Chico",
      tipo: "Cachorro",
      idade: "2 anos",
      porte: "Grande",
      imagem: "/assets/image-animais/chico.png"
    },
    {
      id: 5,
      nome: "Snoopy",
      tipo: "Cachorro",
      idade: "1 ano",
      porte: "Médio",
      imagem: "/assets/image-animais/snoopy.png"
    },
    {
      id: 6,
      nome: "Nina",
      tipo: "Gata",
      idade: "4 anos",
      porte: "Pequeno",
      imagem: "/assets/image-animais/nina.png"
    },
    {
      id: 7,
      nome: "Bob",
      tipo: "Cachorro",
      idade: "2 anos",
      porte: "Médio",
      imagem: "/assets/image-animais/bob.png"
    },
    {
      id: 8,
      nome: "Mel",
      tipo: "Gata",
      idade: "1 ano",
      porte: "Pequeno",
      imagem: "/assets/image-animais/mel.png"
    }
  ];

  const alternarFavorito = (id) => {
    setFavoritos((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((item) => item !== id)
        : [...anteriores, id]
    );
  };

  const animaisFiltrados = animais.filter((animal) => {
    const correspondeBusca = animal.nome
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeEspecie =
      especie === "" || animal.tipo === especie;

    const correspondePorte =
      porte === "" || animal.porte === porte;

    const correspondeIdade =
      idade === "" ||
      (idade === "Filhote" && animal.idade.includes("meses")) ||
      (idade === "Adulto" && animal.idade.includes("anos"));

    return (
      correspondeBusca &&
      correspondeEspecie &&
      correspondePorte &&
      correspondeIdade
    );
  });

  return (
    <div className="pagina-adocao">

      {/* CABEÇALHO */}
      <header className="inicio">

        <Link to="/" className="logo-pata">
          <img 
            src="/assets/image/logo-pata.png"
            alt="PataAmiga"
          />
        </Link>

        <nav className="menu-navegacao">
          <Link to="/" className="nav-item">Início</Link>
          <Link to="/adotar" className="nav-item ativo">Adotar</Link>
          <Link to="/doar" className="nav-item">Doar</Link>
          <Link to="/sobre" className="nav-item">Sobre</Link>
          <Link to="/contato" className="nav-item">Contato</Link>
        </nav>

        <div className="icones-header">

         
          <Link to="/login" className="icone-header">
            <img
              src="/assets/image/log-up.png"
              alt="Login"
            />
          </Link>

          <Link to="" className="icone-header favorito-header">
            ♡
          </Link>

        </div>

      </header>

      {/* TÍTULO E APRESENTAÇÃO */}
      <main>

        <section className="apresentacao">

          <div className="decoracao-adocao">
            <span>🐾</span>
            <strong>Adote<br />mude uma<br />vida</strong>
            <span>♡</span>
          </div>

          <div className="titulo-apresentacao">
            <h1>Encontre seu novo melhor amigo</h1>

            <div className="frase-decorativa">
            
              <p>Pequenos detalhes, grande diferença.</p>
              <span>♡</span>
            </div>
          </div>

        </section>

        {/* FILTROS */}
        <section className="area-filtros">

          <div className="barra-busca">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar por nome, espécie..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

          </div>

          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
          >
            <option value="">Espécie</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Gata">Gato</option>
          </select>

          <select
            value={porte}
            onChange={(e) => setPorte(e.target.value)}
          >
            <option value="">Porte</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Médio">Médio</option>
            <option value="Grande">Grande</option>
          </select>

          <select
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          >
            <option value="">Idade</option>
            <option value="Filhote">Filhote</option>
            <option value="Adulto">Adulto</option>
          </select>

          <button
            className="botao-filtro"
            onClick={() => {
              setBusca("");
              setEspecie("");
              setPorte("");
              setIdade("");
            }}
            title="Limpar filtros"
          >
            ↻
          </button>

        </section>

        {/* CARDS DOS ANIMAIS */}
        <section className="lista-animais">

          {animaisFiltrados.map((animal) => (

            <article className="card-animal" key={animal.id}>

              <div className="imagem-animal">

                <img
                  src={animal.imagem}
                  alt={animal.nome}
                />

                <span className="disponivel">
                  Disponível
                </span>

              </div>

              <div className="informacoes-animal">

                <div className="dados-animal">
                  <h2>{animal.nome}</h2>

                  <p>
                    {animal.tipo} • {animal.idade}
                  </p>
                </div>

                <button
                  className={`botao-favorito ${
                    favoritos.includes(animal.id) ? "selecionado" : ""
                  }`}
                  onClick={() => alternarFavorito(animal.id)}
                  aria-label={`Favoritar ${animal.nome}`}
                >
                  {favoritos.includes(animal.id) ? "♥" : "♡"}
                </button>

              </div>

            </article>

          ))}

          {animaisFiltrados.length === 0 && (
            <p className="nenhum-animal">
              Nenhum animal encontrado.
            </p>
          )}

        </section>

      </main>

      {/* RODAPÉ */}
      <footer className="rodape">

        <div className="rodape-principal">

          <div className="rodape-marca">

            <img
              src="/assets/image/logo-branca.png"
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
