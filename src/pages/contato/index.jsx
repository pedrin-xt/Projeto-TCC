import { Link } from 'react-router-dom';
import './index.scss';



function Contato() {
  return (
    <div className="Contato">
      
       <div className='inicial'>
      <h1>Contato</h1> 
        <div className='info'>
        Nome : <input className='name' type='text ' />
        Telefone : <input className='tell' type='text '/>
        Endereço : <input className='end' type='text'/>
             <Link className='voltar' to="/">
      <p>voltar para home</p>
      </Link>
        </div>
      </div>
     
    </div>
  );
}

export default Contato;