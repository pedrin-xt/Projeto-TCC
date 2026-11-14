import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './pages/app/App';
import Eventos from './pages/projeto tcc/adotar/index';
import Projeto from './pages/projeto tcc/tela inicial/index';
import Contato from './pages/projeto tcc/contato/index';
import Sobre from './pages/projeto tcc/sobre/index';
import Doar from './pages/projeto tcc/doar/index';
import Login from './pages/projeto tcc/login/index';
import LoginAdmin from './pages/projeto tcc/admin/Login';
import Perfil from './pages/projeto tcc/perfil';
import PainelOng from './pages/projeto tcc/admin';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';

// Páginas de usuário (doar, contato) não abrem para contas da ONG: elas vão para o painel
const SoUsuario = ({ children }) => {
  let perfil = null;
  try { perfil = JSON.parse(localStorage.getItem('pataamiga_sessao') || 'null')?.usuario?.perfil; } catch { perfil = null; }
  return ['admin', 'voluntario'].includes(perfil) ? <Navigate to="/admin" replace /> : children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Projeto/>} />
      <Route path='/adotar' element={<Eventos/>} />
      <Route path='/incio' element={<App/>} />
      <Route path='/contato' element={<SoUsuario><Contato/></SoUsuario>} />
      <Route path='/sobre' element={<Sobre/>}/>
      <Route path='/doar' element={<SoUsuario><Doar/></SoUsuario>}/>
      <Route path='/login' element={<Login/>} />
      <Route path='/admin/login' element={<LoginAdmin/>} />
      <Route path='/perfil' element={<Perfil/>} />
      <Route path='/admin' element={<PainelOng/>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


