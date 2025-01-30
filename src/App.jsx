import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import buscando from './assets/buscando.gif';

function App() {

  const [CNPJ, setCNPJ] = useState('')
  const [cnpjData, setData] = useState(false)
  const [infoboxState, setInfo] = useState(null)
  const [result, setResult] = useState(
    // <div id='errorLog'>
    //   <h1>CNPJ Não Encontrado</h1>
    // </div>

    // <div id="data">
    //     <div className="info-cnpj">
    //       <div className="cnpj">
    //         <h1>Número de inscrição</h1>
    //         <h2>13.389.764/0001-62</h2>
    //       </div>

    //       <div className="abertura">
    //         <h1>Data de abertura</h1>
    //         <h2>10/03/2011</h2>
    //       </div>
    //     </div>

    //     <div className="razao-social">
    //       <h1>Nome empresarial</h1>
    //       <h2>SOCIEDADE MOVIMENTO DOS FOCOLARI NORDESTE</h2>
    //     </div>

    //     <div className="nome-fantasia">
    //       <h1>Titulo do Estabelecimento (Nome Fantasia)</h1>
    //       <h2>ESCOLA SANTA MARIA</h2>
    //     </div>

    //     <div className="cnae">
    //       <h1>C-NAE</h1>
    //       <h2>88.00-6-00 - Serviços de assistência social sem alojamento</h2>
    //     </div>

    //     <h1 className="endereco-title"> Endereço</h1>
    //     <div className="endereco">
    //       <table>
    //         <tr>
    //           <td>
    //             <h1>Logradouro</h1>
    //             <h2>R AMAZONAS</h2>
    //           </td>
    //           <td>
    //             <h1>Número</h1>
    //             <h2>09</h2>
    //           </td>
    //           <td>
    //             <h1>Complemento</h1>
    //             <h2>QUADRA0 LOTE 5</h2>
    //           </td>
    //         </tr>

    //         <tr>
    //           <td>
    //             <h1>CEP</h1>
    //             <h2>53.630-465</h2>
    //           </td>
    //           <td>
    //             <h1>Bairro/Distrito</h1>
    //             <h2>SANTO ANTONIO</h2>
    //           </td>
    //           <td>
    //             <h1>Cidade/Municipio</h1>
    //             <h2>IGARASSU</h2>
    //           </td>
    //           <td>
    //             <h1>UF</h1>
    //             <h2>PE</h2>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             <h1>Endereço Eletrônico</h1>
    //             <h2>ESCRITORIO@ESCOLASANTAMARIA.ORG</h2>
    //           </td>
    //           <td>
    //             <h1>Telefone</h1>
    //             <h2>(81) 3543-4682/ (81) 3543-1383</h2>
    //           </td>
    //         </tr>
    //       </table>
    //     </div>
    // </div>

    false

  )

  const formatarInput = (value) => {
      // Formata o CNPJ conforme o usuário digita
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length <= 14) {
          formattedValue = formattedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      setCNPJ(formattedValue);

  };

  const formatarCNPJ = (cnpj) => {
      cnpj = cnpj.replace(/\D/g, '');
      if (cnpj.length <= 14) {
          return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      return cnpj;
  };
  
  const copiar = (title, value) => {
      navigator.clipboard.writeText(value.replace('&amp;', '&')).then(() => {
          info('Sucesso', title)
      })
  }

  const info = (type, msg) => {

      if (type && msg){
          const infobox = document.querySelector('#infobox')
          infobox.classList.add('show');
          setInfo(
              <>
                  <h2>{type}</h2>
                  <p>{msg}</p>
              </>
          )
          console.log('infobox acionada')

          setTimeout(() => {
              infobox.classList.remove('show');
              infobox.classList.add('close');
              setTimeout(() => {
                  infobox.classList.remove('close');
              }, 1000);
          }, 2000);
      }        
  }

  const buscarCNPJ = async (event) => {
    event.preventDefault();
    if (result){
      setResult(null)
    }

    if (CNPJ && CNPJ != ''){
      setResult(
        <div id='loading'>
          <img src={buscando} alt="" />
          <h1>Aguarde, Estamos Procurando o CNPJ...</h1>
        </div>
      )

      let cnpjLimpo = CNPJ;
      cnpjLimpo = cnpjLimpo.replace(/\D/g, '');

      try {
        const req = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`);
        const result = req.data
        
        if (result.cnpj_raiz) {
          setResult(
            <div id="data">
                <div className="info-cnpj">
                  <div className="cnpj">
                    <h1>Número de inscrição</h1>
                    <h2 onClick={() => {
                      copiar('CNPJ copiado com sucesso', formatarCNPJ(result.estabelecimento.cnpj))
                    }}>{formatarCNPJ(result.estabelecimento.cnpj)}</h2>
                  </div>

                  <div className="abertura">
                    <h1>Data de abertura</h1>
                    <h2>
                        {result.estabelecimento.data_inicio_atividade}
                    </h2>
                  </div>
                </div>

                <div className="razao-social">
                  <h1>Nome empresarial</h1>
                  <h2 onClick={() => {
                    copiar('Razão Social copiada com sucesso', result.razao_social)
                  }}>{result.razao_social}</h2>
                </div>

                {result.estabelecimento.nome_fantasia && (
                  <div className="nome-fantasia">
                    <h1>Titulo do Estabelecimento (Nome Fantasia)</h1>
                    <h2 onClick={() =>{
                      copiar('Nome Fantasia copiado com sucesso', result.estabelecimento.nome_fantasia)
                    }}>{result.estabelecimento.nome_fantasia}</h2>
                  </div>
                )}

                <div className="cnae">
                  <h1>C-NAE</h1>
                  <h2 onClick={() =>{
                    copiar('C-NAE copiado com sucesso', `${result.estabelecimento.atividade_principal.classe} - ${result.estabelecimento.atividade_principal.descricao}`)
                  }}>{result.estabelecimento.atividade_principal.classe} - {result.estabelecimento.atividade_principal.descricao}</h2>
                </div>

                <h1 className="endereco-title"> Endereço</h1>
                <div className="endereco">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <h1>Logradouro</h1>
                          <h2 onClick={() =>{
                            copiar('Logradouro copiado com sucesso', `${result.estabelecimento.tipo_logradouro} ${result.estabelecimento.logradouro}`)
                          }}>{result.estabelecimento.tipo_logradouro} {result.estabelecimento.logradouro}</h2>
                        </td>
                        <td>
                          <h1>Número</h1>
                          <h2 onClick={() => {
                            copiar('Numero do estabelecimento copiado', result.estabelecimento.numero)
                          }}>{result.estabelecimento.numero}</h2>
                        </td>
                        {result.estabelecimento.complemento && (
                          <td>
                            <h1>Complemento</h1>
                            <h2 onClick={() => {
                              copiar('Complemeto copiado com sucesso', result.estabelecimento.complemento)
                            }}>{result.estabelecimento.complemento}</h2>
                          </td>
                        )}
                        
                      </tr>

                      <tr>
                        <td>
                          <h1>CEP</h1>
                          <h2 onClick={() => {
                            copiar('CEP copiado com sucesso', result.estabelecimento.cep)
                          }}>{result.estabelecimento.cep}</h2>
                        </td>
                        <td>
                          <h1>Bairro/Distrito</h1>
                          <h2 onClick={() => {
                            copiar('Bairro copiado com sucesso', result.estabelecimento.bairro)
                          }}>{result.estabelecimento.bairro}</h2>
                        </td>
                        <td>
                          <h1>Cidade/Municipio</h1>
                          <h2 onClick={() => {
                            copiar('Cidade/Municipio Copiado Com Sucesso', result.estabelecimento.cidade.nome)
                          }}>{result.estabelecimento.cidade.nome}</h2>
                        </td>
                        <td>
                          <h1>UF</h1>
                          <h2 onClick={() => {
                            copiar('Estado copiado com sucesso', result.estabelecimento.estado.sigla)
                          }}>{result.estabelecimento.estado.sigla}</h2>
                        </td>
                      </tr>
                      <tr>
                        {result.estabelecimento.email && (
                          <td>
                            <h1>Endereço Eletrônico</h1>
                            <h2 onClick={() => {
                              copiar('Email copiado com sucesso', result.estabelecimento.email)
                            }}>{result.estabelecimento.email}</h2>
                          </td>
                        )}
                        
                        {result.estabelecimento.ddd1 && (
                          <td>
                            <h1>Telefone</h1>
                            {/* <h2>(81) 3543-4682/ (81) 3543-1383</h2> */}
                            {result.estabelecimento.ddd2 ? (
                              <h2>({result.estabelecimento.ddd1}) {result.estabelecimento.telefone1} / ({result.estabelecimento.ddd2}) {result.estabelecimento.telefone2}</h2>
                            ) : (
                              <h2>({result.estabelecimento.ddd1}) {result.estabelecimento.telefone1}</h2>
                            )}
                          </td>
                        )}
                        
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          )
        }
      } catch (error) {
        setResult(
          <div id='errorLog'>
            <h1>{error.response.data.detalhes}</h1>
          </div>
        )
      }
    }
  }

  return (
    <section id='verificar-cnpj'>
      <header>
        <nav>
          <h1>Verificar CNPJ</h1>
          <form onSubmit={buscarCNPJ}>
            <input 
              type="text" 
              name="CNPJ" 
              id="cnpjDigitado" 
              value={CNPJ}
              onChange={(e) => {
                formatarInput(e.target.value)
              }}
              placeholder='Digite aqui o CNPJ'
            />
            <input type="submit" onSubmit={buscarCNPJ} value="Buscar CNPJ" />
          </form>
        </nav>
        <footer>
          <h1>Desenvolvido por Wendell_D3v</h1>
          <h2>www.cyberscripts.com.br</h2>
        </footer>
      </header>
      <main>
        <div id="infobox">
          {infoboxState}
        </div>
        {result}
      </main>
    </section>
  )
}

export default App
