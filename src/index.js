import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App';
import NotFound from './pages/notFound';
import Eventos from './pages/eventos/index';
import Projeto from './pages/projeto tcc/tela inicial/index';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/.' element={<App/>} />
      <Route path='*' element={<NotFound/>} />
      <Route path='/' element={<Eventos/>} />
      <Route path='/inicio' element={<Projeto/>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


