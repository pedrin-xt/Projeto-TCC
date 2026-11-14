import React from "react";
import { Link } from "react-router-dom";
import { estaLogado, ehEquipe } from "../services/api";

// "Meu Match" no menu do site: só aparece para quem está logado (e não é da ONG)
export default function MeuMatchNav() {
  if (!estaLogado() || ehEquipe()) return null;
  return <Link to="/perfil" state={{ aba: "match" }} className="nav-item">Meu Match</Link>;
}
