import React, { useState } from "react";
import { urlImagem } from "../services/api";
import "./FotoEditavel.scss";

const TIPOS = ["image/jpeg", "image/png", "image/webp"];

// Foto que a pessoa pode trocar ou remover. O envio é feito por quem usa o componente
// (aoEnviar / aoRemover), assim a mesma tela serve para a foto da conta e para a logo da ONG.
export default function FotoEditavel({ foto, inicial, rotulo, ajuda, tamanho = 88, aoEnviar, aoRemover }) {
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function executar(acao) {
    setErro(""); setOcupado(true);
    try { await acao(); } catch (e) { setErro(e.message || "Não foi possível concluir."); }
    finally { setOcupado(false); }
  }

  function escolher(e) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    if (!TIPOS.includes(arquivo.type)) { setErro("Envie uma imagem JPG, PNG ou WEBP."); return; }
    if (arquivo.size > 2 * 1024 * 1024) { setErro("A imagem deve ter no máximo 2 MB."); return; }
    executar(() => aoEnviar(arquivo));
  }

  return <div className="foto-editavel">
    <div className="foto-circulo" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.4 }}>
      {foto ? <img src={urlImagem(foto, "")} alt={rotulo} /> : <span>{(inicial || "?").toUpperCase()}</span>}
    </div>
    <div className="foto-info">
      <strong>{rotulo}</strong>
      {ajuda && <p>{ajuda}</p>}
      <div className="foto-botoes">
        <label className="perfil-upload">{ocupado ? "Enviando..." : foto ? "Trocar imagem" : "Escolher imagem"}
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={escolher} disabled={ocupado} />
        </label>
        {foto && <button type="button" className="perfil-link-btn" disabled={ocupado} onClick={() => executar(aoRemover)}>Remover</button>}
      </div>
      {erro && <p className="foto-erro" role="alert">{erro}</p>}
    </div>
  </div>;
}
