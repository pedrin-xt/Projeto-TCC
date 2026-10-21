import './index.scss';





export default function Eventos (){

      function Alterou(e){
        let ev = e.target.value
        alert("Você alterou o nome:" + ev);
        
      }

      function Passou(){
        alert("Passou o Mouse Sobre ");
      }

      function Alterar(){
        alert("você selecionou uma opção");
      }
      function click(){
        alert("voçê clicou aqui!!!");
      }
      function limpo(){
        alert("voçê limpou aqui!!!");
      }
      function envia(){
        alert("voçê enviou aqui!!!");
      }
        
        
    
    return(

       

        <div className='Pagina-Eventos '>
            <div className="container">

        <h2>Cadastro de Funcionarios</h2>

        <h3>NOME DO FUNCIONARIO:</h3>
        <input className='text' onChange={Alterou}  type="text"   placeholder="Digite aqui alguma coisa"
        />
        <h3>DEPARTAMENTO:</h3>
        <select className='select' onChange={Alterar} >
          <option >Recursos Humanos</option>
          <option  >Opção 1</option>
          <option>Opção 2</option>
          <option>Opção 3</option>
        </select>

        <h3>TIPO DE DEPARTAMENTO:</h3>
        <div className="opcoes">

          <label >
            <input type="radio" name="opcao" />
            Efetivo
          </label>

          <label>
            <input type="radio" name="opcao" />
            Temporário
          </label>

          <label>
            <input type="radio" name="opcao" />
            Estragiário
          </label>

          <label>
            <input type="radio" name="opcao" />
            Jovem Aprendiz
          </label>
         

        </div>
        
        <p className='passe-mouse' onMouseMove={Passou}  >
          PASSE O MOUSE AQUI
        </p>
        <button onClick={click} className='cadastrar' >Clique aqui</button>
        <button onClick={limpo} className='cadastrar' >Limpar</button>
         <button onClick={envia} className='cadastrar' >Enviar Formulario</button>

      </div>

    </div>
    
    );
}
aiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii aiiiiiiiii