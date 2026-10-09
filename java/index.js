/* ==========================================================================
   VERSÃO SIMPLES — mesma loja, código mais fácil de ler.
   O index.html e o css/index.css continuam IGUAIS (mesmos ids e classes).

   O QUE MUDOU EM RELAÇÃO À VERSÃO ANTERIOR:
   - sem "arrow functions" (=>): só function nome() { ... }
   - sem ternário (a ? b : c): só if / else
   - sem delegação de eventos: os botões têm onclick="..." direto
   - sem "decorar" função: o Pod fala dentro da própria mudarQtd()
   - sem async/await: a digitação usa setInterval (repete a cada X ms)

   PARTES (Ctrl+F no número):
   [1] Produtos   [2] Carrinho   [3] Tabelas e carrossel
   [4] Painel do carrinho   [5] Atualizar a tela
   [6] Música     [7] Tema NieR (sons, Pod, boot, mira, segredo)
   ========================================================================== */


/* ==========================================================
   [1] PRODUTOS — edite só esta lista
   ========================================================== */
/* Lista (array) de produtos. Cada { ... } é um produto com propriedades.
   DICA: o id precisa ser ÚNICO e tipo é 'figure' ou 'manga'.
   DICA: preco é número com PONTO (39.90). */
const produtos = [
    { id: 'p-2b1', tipo: 'figure', nome: '2B - NieR:Automata',  sub: 'The glory of Mankind', codigo: 22123, preco: 39.90, img: 'img/2b1.png' },
    { id: 'p-2b2', tipo: 'figure', nome: '2B - NieR:Automata',  sub: 'The glory of Mankind', codigo: 22124, preco: 49.90, img: 'img/2b2.png' },
    { id: 'p-9s1', tipo: 'figure', nome: '9S - NieR:Automata',  sub: 'The glory of Mankind', codigo: 22155, preco: 49.90, img: 'img/9s1.png' },
    { id: 'p-a23', tipo: 'figure', nome: 'A2 - NieR:Automata',  sub: 'The glory of Mankind', codigo: 22166, preco: 39.90, img: 'img/a23.png' },
    { id: 'p-a22', tipo: 'figure', nome: 'A2 - NieR:Automata',  sub: 'The glory of Mankind', codigo: 22167, preco: 39.90, img: 'img/a22.png' },
    { id: 'm-bluelock', tipo: 'manga', nome: 'Blue Lock',        sub: 'Mangá', codigo: 33101, preco: 39.90, img: 'img/blluelock.png' },
    { id: 'm-chainsaw', tipo: 'manga', nome: 'Chainsaw Man',     sub: 'Mangá', codigo: 33102, preco: 39.90, img: 'img/chainsaw].png' },
    { id: 'm-jujutsu',  tipo: 'manga', nome: 'Jujutsu Kaisen',   sub: 'Mangá', codigo: 33103, preco: 39.90, img: 'img/jujustsu.png' },
    { id: 'm-kimetsu',  tipo: 'manga', nome: 'Kimetsu no Yaiba', sub: 'Mangá', codigo: 33104, preco: 39.90, img: 'img/kimetsu.png' },
    { id: 'm-onepiece', tipo: 'manga', nome: 'One Piece',        sub: 'Mangá', codigo: 33105, preco: 39.90, img: 'img/onepiece.png' }
];

/* Atalho: pegar('abc') = document.getElementById('abc').
   DICA: se devolver null, o id não existe no HTML (confira a grafia). */
function pegar(id) {
    return document.getElementById(id);
}

/* Transforma 39.9 em "R$ 39,90". */
function moeda(numero) {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* Procura um produto na lista pelo id (percorre um por um). */
function acharProduto(id) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            return produtos[i];
        }
    }
}


/* ==========================================================
   [2] CARRINHO
   ========================================================== */
/* `carrinho` é um objeto { idDoProduto: quantidade }.
   Ex.: { 'p-2b1': 2, 'm-onepiece': 1 }
   Produto que não está no objeto = quantidade 0.
   A tela NUNCA guarda a quantidade: ela só mostra o que está aqui.
   Para mudar algo, mude o carrinho e chame atualizar(). */
let carrinho = {};

/* localStorage guarda só TEXTO no navegador (sobrevive ao F5).
   JSON.parse: texto -> objeto.   JSON.stringify: objeto -> texto. */
const salvo = localStorage.getItem('yorha-carrinho');
if (salvo) {
    carrinho = JSON.parse(salvo);
}

/* Quantidade de um produto (0 se não estiver no carrinho). */
function qtd(id) {
    if (carrinho[id]) {
        return carrinho[id];
    }
    return 0;
}

/* Soma delta à quantidade: +1 no botão +, -1 no botão −.
   É chamada pelos onclick="mudarQtd('id', 1)" dos botões. */
function mudarQtd(id, delta) {
    const antes = qtd(id);
    let nova = antes + delta;
    if (nova < 0) {
        nova = 0;                      // nunca fica negativa
    }

    if (nova === 0) {
        delete carrinho[id];           // delete remove a chave do objeto
    } else {
        carrinho[id] = nova;
    }

    // O Pod 042 comenta (a função falar está na parte [7])
    const produto = acharProduto(id);
    if (delta > 0) {
        pulsar();
        falar('Informe: ' + produto.nome + ' adicionado ao inventário.');
    } else if (antes > 0 && contarItens() === 0) {
        falar('Observação: inventário vazio. Eficiência de compra: 0%.');
    }

    atualizar();                       // sempre redesenha depois de mexer no carrinho
}

/* Remove o produto inteiro do carrinho (botão "Remover"). */
function removerTudo(id) {
    mudarQtd(id, -qtd(id));
}

/* Soma todas as quantidades do carrinho. */
function contarItens() {
    let total = 0;
    for (let i = 0; i < produtos.length; i++) {
        total = total + qtd(produtos[i].id);
    }
    return total;
}

/* Faz o botão do carrinho "pulsar" (animação do CSS, classe .pulsar).
   TRUQUE: se só colocar a classe de novo, a animação não repete.
   Remover -> ler offsetWidth (força o navegador a recalcular) -> adicionar
   faz ela rodar do zero. */
function pulsar() {
    const botao = pegar('btn-carrinho');
    botao.classList.remove('pulsar');
    void botao.offsetWidth;
    botao.classList.add('pulsar');
}


/* ==========================================================
   [3] TABELAS E CARROSSEL
   ========================================================== */
/* Devolve o HTML (texto) da linha de UM produto.
   As crases ` ` permitem várias linhas, e ${...} encaixa um valor.
   Ex.: ${p.nome} vira "2B - NieR:Automata".
   Os botões + e − chamam mudarQtd direto pelo onclick.
   O número de quantidade começa em 0; o atualizar() coloca o real. */
function linhaProduto(p) {
    return `
    <tr id="${p.id}" onmouseenter="bip(520, 0.03)">
        <td><img src="${p.img}" alt="${p.nome}" loading="lazy"></td>
        <td class="descproduto">
            <strong>${p.nome}</strong>
            <span>${p.sub}</span>
            <span>Código: ${p.codigo}</span>
        </td>
        <td>${moeda(p.preco)}</td>
        <td>
            <div class="quantidade">
                <button type="button" class="btn-menos" onclick="mudarQtd('${p.id}', -1)" aria-label="Diminuir ${p.nome}">−</button>
                <span class="qtd-valor">0</span>
                <button type="button" class="btn-mais" onclick="mudarQtd('${p.id}', 1)" aria-label="Aumentar ${p.nome}">+</button>
            </div>
        </td>
        <td class="total">${moeda(0)}</td>
    </tr>`;
}

/* Monta as duas tabelas: percorre a lista e, conforme o tipo,
   acrescenta (+=) a linha no texto certo. No fim, joga o texto no HTML.
   innerHTML = coloca HTML dentro de um elemento. */
let htmlFigures = '';
let htmlMangas = '';
for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].tipo === 'figure') {
        htmlFigures += linhaProduto(produtos[i]);
    } else {
        htmlMangas += linhaProduto(produtos[i]);
    }
}
pegar('lista-figures').innerHTML = htmlFigures;
pegar('lista-mangas').innerHTML = htmlMangas;

/* Carrossel: um link <a> por produto. href="#p-2b1" rola até a linha da
   tabela com esse id (isso é do próprio HTML, sem JS de rolagem). */
function montarGaleria(extra) {
    let html = '';
    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        html += '<a href="#' + p.id + '" ' + extra + ' aria-label="Ver ' + p.nome + '">' +
                '<img src="' + p.img + '" alt="' + p.nome + '"></a>';
    }
    return html;
}

/* POR QUE DUAS CÓPIAS? No CSS a faixa anda até -50% e volta ao início.
   Como a 2ª metade é igual à 1ª, a volta é invisível: parece infinito.
   A cópia leva tabindex="-1" (o teclado não passa por ela) e aria-hidden
   (leitor de tela ignora). */
const faixas = document.querySelectorAll('.track');
for (let i = 0; i < faixas.length; i++) {
    faixas[i].innerHTML =
        '<div class="galeria">' + montarGaleria('') + '</div>' +
        '<div class="galeria" aria-hidden="true">' + montarGaleria('tabindex="-1"') + '</div>';
    faixas[i].onclick = function (e) {
        if (e.target.closest('a')) {
            falar('Proposta: inspecionar o item selecionado.');
        }
    };
}


/* ==========================================================
   [4] PAINEL DO CARRINHO
   ========================================================== */
const painel = pegar('painel-carrinho');
const overlay = pegar('overlay');

/* Abrir/fechar = ligar e desligar classes. Quem anima é o CSS.
   REGRA: o JS troca CLASSES, o CSS cuida do VISUAL. */
function abrirCarrinho() {
    painel.classList.add('aberto');
    overlay.classList.add('ativo');
}
function fecharCarrinho() {
    painel.classList.remove('aberto');
    overlay.classList.remove('ativo');
}

pegar('btn-carrinho').onclick = abrirCarrinho;
pegar('fechar-carrinho').onclick = fecharCarrinho;
overlay.onclick = fecharCarrinho;                      // clicar fora fecha

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        fecharCarrinho();
    }
});

/* Aviso rápido que some sozinho (toast).
   clearTimeout cancela o "sumir" anterior, senão dois avisos seguidos
   fariam o segundo sumir cedo demais. 3000 = 3 segundos. */
let timerAviso;
function avisar(mensagem) {
    const toast = pegar('toast');
    toast.textContent = mensagem;
    toast.classList.add('ativo');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () {
        toast.classList.remove('ativo');
    }, 3000);
}

pegar('btn-finalizar').onclick = function () {
    if (contarItens() === 0) {
        avisar('Inventário vazio. Selecione ao menos um item.');
        return;                                        // return = sai da função aqui
    }
    carrinho = {};                                     // esvazia
    atualizar();
    fecharCarrinho();
    avisar('Pedido transmitido ao Bunker. Glória à humanidade!');
    falar('Resposta: transmissão concluída. Glória à humanidade.');
};


/* ==========================================================
   [5] ATUALIZAR — redesenha tudo a partir do carrinho
   ========================================================== */
/* Chamada toda vez que o carrinho muda. Atualiza tabelas, contador,
   painel, totais e salva no navegador. */
function atualizar() {
    let itens = 0;
    let subtotal = 0;

    // 1) Tabelas: quantidade e total de cada linha
    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        const q = qtd(p.id);
        const linha = pegar(p.id);

        linha.querySelector('.qtd-valor').textContent = q;
        linha.querySelector('.total').textContent = moeda(q * p.preco);

        if (q > 0) {
            linha.classList.add('no-carrinho');        // o CSS destaca a linha
        } else {
            linha.classList.remove('no-carrinho');
        }

        itens = itens + q;
        subtotal = subtotal + q * p.preco;
    }

    // 2) Bolinha com o número no ícone do carrinho (some quando é 0)
    const contador = pegar('carrinho-contador');
    contador.textContent = itens;
    if (itens === 0) {
        contador.classList.add('oculto');
    } else {
        contador.classList.remove('oculto');
    }

    // 3) Lista dentro do painel
    let htmlItens = '';
    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        if (qtd(p.id) > 0) {
            htmlItens += `
            <div class="item-carrinho">
                <img src="${p.img}" alt="${p.nome}">
                <div class="item-info">
                    <span class="nome">${p.nome}</span>
                    <span class="preco">${moeda(p.preco)} cada</span>
                    <div class="quantidade mini">
                        <button type="button" onclick="mudarQtd('${p.id}', -1)" aria-label="Diminuir">−</button>
                        <span class="qtd-valor">${qtd(p.id)}</span>
                        <button type="button" onclick="mudarQtd('${p.id}', 1)" aria-label="Aumentar">+</button>
                    </div>
                </div>
                <div class="item-acoes">
                    <span>${moeda(p.preco * qtd(p.id))}</span>
                    <button type="button" class="btn-remover" onclick="removerTudo('${p.id}')">Remover</button>
                </div>
            </div>`;
        }
    }
    if (itens === 0) {
        htmlItens = '<p class="carrinho-vazio">Inventário vazio.<br>Use o + nas tabelas para adicionar itens.</p>';
    }
    pegar('carrinho-itens').innerHTML = htmlItens;

    // 4) Totais (painel e rodapé)
    pegar('carrinho-subtotal').textContent = moeda(subtotal);
    pegar('rodape-subtotal').textContent = moeda(subtotal);
    if (itens === 1) {
        pegar('rodape-itens').textContent = '1 item';
    } else {
        pegar('rodape-itens').textContent = itens + ' itens';
    }

    // 5) Salva (objeto -> texto)
    localStorage.setItem('yorha-carrinho', JSON.stringify(carrinho));
}


/* ==========================================================
   [6] MÚSICA
   ========================================================== */
/* Navegadores bloqueiam som automático: a música começa no primeiro
   clique ou tecla. O botão 🔊/🔇 liga e desliga e lembra a escolha. */
const trilha = pegar('trilha');                        // a tag <audio> do HTML
const btnMusica = pegar('btn-musica');
trilha.volume = 0.3;                                   // DICA: de 0 (mudo) a 1 (máximo)

/* silenciada = "a pessoa desligou a música de propósito?" */
let silenciada = localStorage.getItem('yorha-musica') === 'off';

function tocar() {
    // play() pode ser recusado pelo navegador; o catch vazio evita erro no console
    trilha.play().catch(function () {});
}

/* O ícone do botão acompanha o estado REAL do áudio:
   onplay roda quando começa a tocar, onpause quando pausa. */
trilha.onplay = function () { btnMusica.textContent = '🔊'; };
trilha.onpause = function () { btnMusica.textContent = '🔇'; };

btnMusica.onclick = function (e) {
    e.stopPropagation();                               // não deixa o clique "subir" para o document
    if (trilha.paused) {
        silenciada = false;
        tocar();
        falar('Informe: trilha sonora ativada.');
    } else {
        silenciada = true;
        trilha.pause();
        falar('Informe: trilha sonora desativada.');
    }
    if (silenciada) {
        localStorage.setItem('yorha-musica', 'off');
    } else {
        localStorage.setItem('yorha-musica', 'on');
    }
};

/* Primeiro clique ou tecla em qualquer lugar inicia a música.
   { once: true } = o listener roda UMA vez e se remove sozinho. */
function iniciarMusica() {
    if (!silenciada && trilha.paused) {
        tocar();
    }
}
document.addEventListener('click', iniciarMusica, { once: true });
document.addEventListener('keydown', iniciarMusica, { once: true });

/* Primeira pintura da página. Sem esta chamada as tabelas ficariam
   vazias até o primeiro clique. */
atualizar();


/* ==========================================================
   [7] TEMA NIER:AUTOMATA — sons, Pod 042, boot, mira e segredo
   ========================================================== */
/* Tudo daqui para baixo é enfeite: o carrinho funciona sem isso
   (mas mudarQtd e a música chamam falar() e bip(), então deixe
   essas duas funções). */

/* "Reduzir movimento": configuração do sistema para quem se incomoda
   com animações. Se estiver ligada, pulamos as digitações. */
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- Bips de terminal (som gerado por código, sem arquivo) ----- */
/* Oscillator = gerador de onda ('square' = som de videogame antigo).
   freq = nota (maior = mais agudo). dur = duração em segundos.
   O AudioContext só é criado no primeiro bip (o navegador exige
   uma interação antes). */
let audioCtx;
function bip(freq, dur) {
    if (silenciada) {
        return;
    }
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    volume.gain.value = 0.03;                          // DICA: volume dos bips
    osc.connect(volume);                               // oscilador -> volume
    volume.connect(audioCtx.destination);              // volume -> alto-falante
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}

/* Todo clique em botão ou link toca um bip (o "+" é mais agudo).
   closest('button, a') sobe na árvore até achar um botão/link
   (ou devolve null se o clique foi em outro lugar). */
document.addEventListener('click', function (e) {
    const alvo = e.target.closest('button, a');
    if (alvo) {
        if (alvo.classList.contains('btn-mais')) {
            bip(1175, 0.05);
        } else {
            bip(740, 0.05);
        }
    }
});

/* ----- Pod 042: o balão de fala ----- */
const podFala = pegar('pod-fala');
let timerPod;
function falar(texto) {
    podFala.textContent = texto;
    podFala.classList.add('ativa');                    // o CSS mostra o balão
    clearTimeout(timerPod);
    timerPod = setTimeout(function () {
        podFala.classList.remove('ativa');
    }, 4500);                                          // some depois de 4,5 s
}

/* DICA: para uma fala nova, adicione um texto nesta lista. */
const dicas = [
    'Proposta: passe o mouse sobre um produto para selecioná-lo.',
    'Proposta: clique numa imagem do carrossel para inspecionar o item.',
    'Informe: o botão 🔊 liga e desliga a trilha sonora.',
    'Observação: colecionar é uma forma de memória. Recomendo estoque extra.',
    'Proposta: existe um protocolo secreto. Sequência: ↑ ↑ ↓ ↓ ← → ← → B A (ou W W S S A D A D B A).',
    'Resposta: não, não sou um brinquedo. Sou a Unidade de Apoio 042.'
];

/* Clicar no Pod sorteia uma dica.
   Math.random() dá um número de 0 a 0,99...; vezes o tamanho da lista e
   Math.floor (arredonda para baixo) = uma posição válida da lista. */
pegar('pod-corpo').onclick = function () {
    const sorteio = Math.floor(Math.random() * dicas.length);
    falar(dicas[sorteio]);
};

/* ----- Texto do header "digitado" ----- */
/* Pega o texto do <p>, troca quebras de linha e espaços repetidos por um
   espaço só (/\s+/g é uma "regex": \s = espaço, + = um ou mais, g = todos),
   guarda o texto completo em aria-label (leitor de tela lê tudo) e esvazia
   o <p> para a animação escrever letra por letra. */
const pHeader = document.querySelector('.conteudo-header p');
const textoHeader = pHeader.textContent.trim().replace(/\s+/g, ' ');
pHeader.setAttribute('aria-label', textoHeader);
if (reduz) {
    pHeader.textContent = textoHeader;
} else {
    pHeader.textContent = '';
}

/* setInterval repete uma função a cada X milissegundos até o clearInterval.
   A cada repetição, escreve mais uma letra. */
function digitarHeader() {
    if (reduz) {
        return;
    }
    let posicao = 0;
    pHeader.classList.add('digitando');
    const timer = setInterval(function () {
        pHeader.textContent += textoHeader[posicao];
        posicao++;
        if (posicao >= textoHeader.length) {
            clearInterval(timer);
            pHeader.classList.remove('digitando');
        }
    }, 10);                                            // DICA: 10 = ms por letra
}

/* ----- Terminal de boot ----- */
const textoBoot = [
    'YoRHa UNIT No.2 TYPE B — TERMINAL DA LOJA',
    '> Verificando sistema ........ OK',
    '> Carregando acervo: ' + produtos.length + ' itens',
    '> Sincronizando com o Bunker .. OK',
    '> Glória à humanidade.'
].join('\n');                                          // join junta as linhas com quebra (\n)

const bootLog = pegar('boot-log');
const bootBtn = pegar('boot-btn');
document.body.classList.add('travado');                // trava a rolagem enquanto o terminal aparece

function terminarBoot() {
    bootLog.textContent = textoBoot;                   // mostra o texto completo
    bootBtn.hidden = false;                            // revela o botão INICIAR
    bootBtn.focus();                                   // basta apertar Enter
}

let posicaoBoot = 0;
let timerBoot;
if (reduz) {
    terminarBoot();
} else {
    timerBoot = setInterval(function () {
        bootLog.textContent += textoBoot[posicaoBoot];
        posicaoBoot++;
        if (posicaoBoot >= textoBoot.length) {
            clearInterval(timerBoot);
            terminarBoot();
        }
    }, 20);
}

/* Clicar no terminal pula a digitação. */
pegar('boot').onclick = function () {
    clearInterval(timerBoot);
    terminarBoot();
};

/* Clicar em INICIAR: o terminal some com animação (classe .saindo),
   a rolagem é liberada e a música começa (este clique já conta como
   interação para o navegador liberar o áudio). O terminal é removido
   do HTML depois de 800 ms (tempo da animação no CSS). Depois, a
   digitação do header e a fala do Pod entram com pequenos atrasos. */
bootBtn.onclick = function () {
    pegar('boot').classList.add('saindo');
    document.body.classList.remove('travado');
    iniciarMusica();
    setTimeout(function () { pegar('boot').remove(); }, 800);
    setTimeout(digitarHeader, 500);
    setTimeout(function () {
        falar('Informe: sistema online. Sou o Pod 042. Bem-vindo à Yorha.');
    }, 1200);
};

/* ----- Mira no cursor (só com mouse) ----- */
/* A media query só é verdadeira em dispositivos com mouse de verdade;
   no celular a mira nem aparece. A mira é uma <div> que acompanha o mouse
   (clientX/clientY = posição do mouse na janela). */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const mira = pegar('mira');

    document.addEventListener('mousemove', function (e) {
        mira.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
        mira.classList.add('visivel');
    });

    // Sobre link, botão ou linha da tabela, a mira ganha a classe .alvo
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest('a, button, tr[id]')) {
            mira.classList.add('alvo');
        } else {
            mira.classList.remove('alvo');
        }
    });

    // Quando o mouse sai da janela, a mira some
    document.documentElement.addEventListener('mouseleave', function () {
        mira.classList.remove('visivel');
    });
}

/* ----- Protocolo secreto (Konami code) ----- */
/* Guardamos as ÚLTIMAS 10 teclas apertadas na lista `digitadas`.
   .push() coloca no fim; .shift() tira o primeiro;
   .join(',') junta a lista num texto, para comparar tudo de uma vez
   (comparar duas listas direto com === não funciona em JS).
   Tudo em minúsculo, então 'B' e 'b' contam igual. */
const codigoSetas = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
const codigoWasd  = 'w,w,s,s,a,d,a,d,b,a';          // para teclados sem setas
let digitadas = [];

document.addEventListener('keydown', function (e) {
    digitadas.push(e.key.toLowerCase());
    if (digitadas.length > 10) {
        digitadas.shift();
    }

    const atual = digitadas.join(',');
    if (atual === codigoSetas || atual === codigoWasd) {
        document.body.classList.add('modo-glitch');    // o CSS faz o efeito
        falar('Alerta: protocolo secreto detectado. Sistema instável.');
        bip(220, 0.4);
        setTimeout(function () {
            document.body.classList.remove('modo-glitch');
        }, 4000);                                      // dura 4 segundos
    }
});