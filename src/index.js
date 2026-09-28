import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/app/App';
import Contato from './pages/contato';
import NotFound from './pages/notFound';
import Eventos from './pages/eventos/index';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/.' element={<App/>} />
      <Route path='/contato' element={<Contato/>} />
      <Route path='*' element={<NotFound/>} />
      <Route path='/' element={<Eventos/>} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


