import { useState, useEffect } from 'react';
import axios from 'axios'
import loadingImage from '../assets/imgs/loading.svg'
import copy from '../assets/imgs/copy.svg'
import '../assets/css/cnpj.css'

function Home(){

    const [cnpj, setCNPJ] = useState('')
    const [error, setError] = useState(null)
    const [loadingState, setState] = useState(false)
    const [resultado, setRes] = useState(null)
    const [infoboxState, setInfo] = useState(null)

    useEffect(() =>{
        document.title = 'Verificar CNPJ'
    }, [])
    
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

    const copiarCNPJS = () => {
        const cnpj = document.querySelector("#CNPJ").innerHTML;
        navigator.clipboard.writeText(cnpj).then(() => {
            info('Sucesso', 'CNPJ Copiado Com Sucesso')
        })
    }

    const copiarNOME = () => {
        const nome = document.querySelector('#NOME').innerHTML
        navigator.clipboard.writeText(nome.replace('&amp;', '&')).then(() => {
            info('Sucesso', 'Nome Da Empresa Copiado Com Sucesso')
        })
    }
    
    const copiarNOMEF = () => {
        const nomeF = document.querySelector('#NomeF').innerHTML
        navigator.clipboard.writeText(nomeF.replace('&amp;', '&')).then(() => {
            info('Sucesso', 'Nome Fantasia Da Empresa Copiado Com Sucesso')
        })
    }
    
    const copiarCNAE = () => {
        const cnae = document.querySelector('#CNAE').innerHTML
        navigator.clipboard.writeText(cnae.replace('&amp;', '&')).then(() => {
            info('Sucesso', 'C-NAE Copiado Com Sucesso')
        })
    }
    

    const pegarCNPJ = async (event) => {
        event.preventDefault();
        if (resultado){
            setRes(null)
        }
        setError(null)
        setState(true)

        if (cnpj && cnpj != ''){
            let cnpjLimpo = cnpj;
            cnpjLimpo = cnpjLimpo.replace(/\D/g, '');
            
            try{
                const req = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpjLimpo}`);
                const result = req.data
                
                if (result.cnpj_raiz) {
                    setState(false)
                    setRes(
                        <div id="result">
                            <p>CNPJ:</p>
                            <span id='CNPJ'>{formatarCNPJ(result.estabelecimento.cnpj)}</span>
                            <button id='copiar' onClick={copiarCNPJS}><img src={copy} width = '30'/> Copiar</button>
                            <br />
                            <br />
                            <p>Nome Da Empresa</p>
                            <span id='NOME'>{result.razao_social}</span>
                            <button id='copiar' onClick={copiarNOME}><img src={copy} width = '30'/> Copiar</button>
                            <br />
                            <br />
                            <p>Nome Fantasia</p>
                            <span id='NomeF'>{result.estabelecimento.nome_fantasia}</span>
                            <button id='copiar' onClick={copiarNOMEF}><img src={copy} width = '30'/> Copiar</button>
                            <br />
                            <br />
                            <p>C-NAE</p>
                            <span id='CNAE'>{result.estabelecimento.atividade_principal.classe} - ${result.estabelecimento.atividade_principal.descricao}</span>
                            <button id='copiar' onClick={copiarCNAE}><img src={copy} width = '30'/> Copiar</button>
                        </div>
                    )
                }else{
                    setState(false)
                    console.log('erro')
                }

                
            }catch (err) {
                setState(false)
                console.log('erro #1')
                setError(err.response.data.detalhes)
            }
        }
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

            setTimeout(() => {
                infobox.classList.remove('show');
                infobox.classList.add('close');
                setTimeout(() => {
                    infobox.classList.remove('close');
                }, 1000);
            }, 2000);
        }        
    }

    return (
        <>
            
            <header>
                <h1>Verificar CNPJ</h1>
                <p>Desenvolvido por WendellD3v</p>

                <form id="formulario" 
                    onSubmit={pegarCNPJ}
                >
                    
                    <input 
                        type="text" 
                        name="CNPJ" 
                        id="cnpjDigitado"
                        value={cnpj}
                        onChange={(e) => {
                            formatarInput(e.target.value);
                        }}
                        placeholder="Digite aqui o CNPJ"
                    />

                </form>

                <button 
                    type='submit'
                    onClick={pegarCNPJ}
                >
                    Buscar CNPJ
                </button>
            </header>
            <section>
                <div id="infobox">
                    {infoboxState}
                </div>

                {error && (
                    <>
                        <p id='error'>{error}</p>
                    </>
                )}

                {loadingState && (
                    <>
                        <div className="loading">
                            <img id='carregando' src={loadingImage} width='200'/>
                            <h2>Procurando o CNPJ, Aguarde..</h2>
                        </div>
                    </>
                )}

                
                {resultado && (
                    <div id="resultado">
                        {resultado}
                    </div>
                )}
            </section>
            
        </>
    );
}

export default Home;