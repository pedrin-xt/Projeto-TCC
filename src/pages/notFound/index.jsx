import { Link } from 'react-router-dom';
import './index.css';

function NotFound() {
  return (
    <div className="notfound">
      <h1>Página não encontrada</h1>

      <img className='not'
        src="/assets/images/notfound.jpg"
        alt="Página não encontrada"
      />
        <div className='voltar'>
      <Link to="/">
        Voltar para Home
      </Link>
        </div>
    </div>
  );
}
 export default NotFound;