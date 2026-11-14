import React from "react";
import "./Compat.scss";

export const STATUS_PEDIDO = { solicitada: "Aguardando análise", em_analise: "Em análise", aprovada: "Aprovada", recusada: "Recusada", concluida: "Concluída" };

// Barra de compatibilidade (verde = alta, amarelo = média, vermelho = baixa)
export default function Compat({ valor }) {
  if (valor === null || valor === undefined) return <small className="compat-vazia">Compatibilidade não calculada (sem questionário)</small>;
  const nivel = valor >= 70 ? "alta" : valor >= 40 ? "media" : "baixa";
  return <div className={`compat ${nivel}`}><b>{valor}% de compatibilidade</b><div className="compat-barra"><i style={{ width: `${valor}%` }} /></div></div>;
}

export function SeloStatus({ status }) {
  return <span className={`selo-status ${status}`}>{STATUS_PEDIDO[status] || status}</span>;
}
