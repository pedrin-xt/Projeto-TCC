import {Link} from 'react-router-dom';
import './App.css';


function App() {
  return (
    <div className="App">
      <h1>Bem-Vindos</h1>
      <img className='meme' src='./assets/image/meme.jpg' alt='logo'></img>
      
    <div>
      <Link to="/contato">
        <img className='voltar' src='./assets/image/download.jpg' alt='voltar'></img>
        
      </Link>
    </div>
    </div>
  );
}

export default App;
