import React from "react";
import { urlImagem } from "../services/api";

// Foto redonda; sem foto, mostra a inicial do nome
export default function Avatar({ foto, nome, tamanho = 40 }) {
  const inicial = (nome || "?").trim().charAt(0).toUpperCase();
  return <span className="avatar" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.42 }} aria-hidden="true">
    {foto ? <img src={urlImagem(foto, "")} alt="" /> : inicial}
  </span>;
}
