import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App';
import Eventos from './pages/projeto tcc/eventos/index';
import Projeto from './pages/projeto tcc/tela inicial/index';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Projeto/>} />
      <Route path='/adotar' element={<Eventos/>} />
      <Route path='/incio' element={<App/>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


