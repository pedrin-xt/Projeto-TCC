import React, { useState } from "react";
import Compat, { SeloStatus } from "../componentes/Compat";
import Avatar from "../componentes/Avatar";
import { urlImagem } from "../services/api";
import "../componentes/FotoEditavel.scss";

const ROTULOS = {
  espaco: { apartamento: "Apartamento", casa_pequena: "Casa pequena", casa_grande: "Casa com quintal / espaço amplo" },
  atividade: { baixa: "Baixa / tranquila", alta: "Alta / ativa" },
  tempo: { muito: "Bastante tempo", pouco: "Pouco tempo" },
  experiencia: { iniciante: "Primeira adoção", experiente: "Já tem experiência" },
};
const FILTROS = [["pendentes", "Novos e em análise"], ["aprovadas", "Aprovados"], ["encerrados", "Recusados / concluídos"], ["todos", "Todos"]];
const dataBR = (d) => (d ? new Date(d).toLocaleDateString("pt-BR") : "");
const foto = (f) => urlImagem(f);

// Pedidos recebidos pela ONG, com compatibilidade e respostas do questionário.
// A decisão (aprovar/recusar) é sempre da ONG: a compatibilidade só ajuda a avaliar.
export default function Pedidos({ adocoes, onDecidir }) {
  const [filtro, setFiltro] = useState("pendentes");
  const lista = adocoes.filter(p => filtro === "todos"
    || (filtro === "pendentes" && ["solicitada", "em_analise"].includes(p.status))
    || (filtro === "aprovadas" && p.status === "aprovada")
    || (filtro === "encerrados" && ["recusada", "concluida"].includes(p.status)));

  return <div className="perfil-conteudo">
    <h2>Pedidos de adoção</h2>
    <p>Analise cada pedido com a compatibilidade e as respostas do adotante. A decisão final é sempre da ONG.</p>
    <div className="ong-filtros">{FILTROS.map(([v, r]) => <button type="button" key={v} className={filtro === v ? "ativo" : ""} onClick={() => setFiltro(v)}>{r}</button>)}</div>
    {lista.length === 0 && <p className="perfil-vazio">Nenhum pedido nesta lista.</p>}
    <div className="ong-lista">{lista.map(p => <article className="ong-pedido" key={p.id}>
      <img src={foto(p.animal_foto)} alt={p.animal_nome} onError={e => { e.currentTarget.src = "/assets/image/logo-pata.png"; }} />
      <div className="ong-pedido-info">
        <h3>{p.animal_nome} <SeloStatus status={p.status} /></h3>
        <p className="ong-adotante"><Avatar foto={p.adotante_foto} nome={p.adotante_nome} tamanho={30} /><span><strong>{p.adotante_nome}</strong> · {p.adotante_email}{p.adotante_telefone ? ` · ${p.adotante_telefone}` : ""}</span></p>
        <p className="ong-mudo">Pedido #{p.id} · {dataBR(p.data_solicitacao)}</p>
        <Compat valor={p.compatibilidade} />
        {p.motivos?.length > 0 && <small className="ong-mudo">{p.motivos.join(" · ")}</small>}
        {p.q_espaco
          ? <dl className="ong-questionario">
              <dt>Moradia</dt><dd>{ROTULOS.espaco[p.q_espaco] || p.q_espaco}</dd>
              <dt>Atividade</dt><dd>{ROTULOS.atividade[p.q_atividade] || p.q_atividade}</dd>
              <dt>Tempo livre</dt><dd>{ROTULOS.tempo[p.q_tempo] || p.q_tempo}</dd>
              <dt>Experiência</dt><dd>{ROTULOS.experiencia[p.q_experiencia] || p.q_experiencia}</dd>
              <dt>Crianças em casa</dt><dd>{p.q_criancas ? "Sim" : "Não"}</dd>
              <dt>Outros animais</dt><dd>{p.q_outros_pets ? "Sim" : "Não"}</dd>
            </dl>
          : <small className="ong-mudo">O adotante ainda não respondeu o questionário.</small>}
        {p.observacoes && <p className="ong-obs">“{p.observacoes}”</p>}
      </div>
      <div className="ong-acoes">
        {p.status === "solicitada" && <button type="button" className="perfil-secundario" onClick={() => onDecidir(p, "em_analise")}>Iniciar análise</button>}
        {["solicitada", "em_analise"].includes(p.status) && <button type="button" className="perfil-primario" onClick={() => onDecidir(p, "aprovada")}>Aprovar</button>}
        {["solicitada", "em_analise", "aprovada"].includes(p.status) && <button type="button" className="ong-perigo" onClick={() => onDecidir(p, "recusada")}>Recusar</button>}
        {p.status === "aprovada" && <button type="button" className="perfil-primario" onClick={() => onDecidir(p, "concluida")}>Concluir adoção</button>}
      </div>
    </article>)}</div>
  </div>;
}
