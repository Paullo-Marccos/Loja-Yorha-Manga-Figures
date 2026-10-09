/* ==========================================================
   PRODUTOS — edite só esta lista (tabelas e carrossel nascem dela)
   tipo: 'figure' ou 'manga'
   ========================================================== */
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

const $ = id => document.getElementById(id);
const moeda = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ===== Estado: { 'p-2b1': 2, ... } — única fonte de verdade ===== */
let carrinho = {};
try { carrinho = JSON.parse(localStorage.getItem('yorha-carrinho')) || {}; } catch (e) { carrinho = {}; }

const qtd = id => carrinho[id] || 0;

function mudarQtd(id, delta) {
    const nova = Math.max(0, qtd(id) + delta);
    if (nova === 0) delete carrinho[id]; else carrinho[id] = nova;
    if (delta > 0) pulsar();
    atualizar();
}

function pulsar() {
    const b = $('btn-carrinho');
    b.classList.remove('pulsar');
    void b.offsetWidth;                      // reinicia a animação
    b.classList.add('pulsar');
}

/* ===== Tabelas ===== */
function linhaProduto(p) {
    return `
    <tr id="${p.id}">
        <td><img src="${p.img}" alt="${p.nome}" loading="lazy"></td>
        <td class="descproduto">
            <strong>${p.nome}</strong>
            <span>${p.sub}</span>
            <span>Código: ${p.codigo}</span>
        </td>
        <td>${moeda(p.preco)}</td>
        <td>
            <div class="quantidade" data-id="${p.id}">
                <button type="button" class="btn-menos" aria-label="Diminuir ${p.nome}">−</button>
                <span class="qtd-valor">0</span>
                <button type="button" class="btn-mais" aria-label="Aumentar ${p.nome}">+</button>
            </div>
        </td>
        <td class="total">${moeda(0)}</td>
    </tr>`;
}

$('lista-figures').innerHTML = produtos.filter(p => p.tipo === 'figure').map(linhaProduto).join('');
$('lista-mangas').innerHTML  = produtos.filter(p => p.tipo === 'manga').map(linhaProduto).join('');

// Um único listener para todos os botões + e −
document.querySelector('.tabelas').addEventListener('click', e => {
    const btn = e.target.closest('button');
    const box = e.target.closest('.quantidade');
    if (!btn || !box) return;
    mudarQtd(box.dataset.id, btn.classList.contains('btn-mais') ? 1 : -1);
});

/* ===== Carrossel: cada imagem leva à linha do produto ===== */
const galeria = produtos.map(p =>
    `<a href="#${p.id}" aria-label="Ver ${p.nome}"><img src="${p.img}" alt="${p.nome}"></a>`
).join('');

document.querySelectorAll('.track').forEach(track => {
    // Duas cópias iguais: o -50% do @keyframes cria o loop sem pulo
    track.innerHTML =
        `<div class="galeria">${galeria}</div>` +
        `<div class="galeria" aria-hidden="true">${galeria.replace(/<a /g, '<a tabindex="-1" ')}</div>`;
});

/* ===== Painel do carrinho ===== */
const painel = $('painel-carrinho');
const overlay = $('overlay');

function abrirCarrinho()  { painel.classList.add('aberto');    overlay.classList.add('ativo'); }
function fecharCarrinho() { painel.classList.remove('aberto'); overlay.classList.remove('ativo'); }

$('btn-carrinho').addEventListener('click', abrirCarrinho);
$('fechar-carrinho').addEventListener('click', fecharCarrinho);
overlay.addEventListener('click', fecharCarrinho);
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharCarrinho(); });

$('carrinho-itens').addEventListener('click', e => {
    const btn = e.target.closest('button[data-acao]');
    if (!btn) return;
    const { id, acao } = btn.dataset;
    if (acao === 'mais') mudarQtd(id, 1);
    if (acao === 'menos') mudarQtd(id, -1);
    if (acao === 'remover') mudarQtd(id, -qtd(id));
});

$('btn-finalizar').addEventListener('click', () => {
    if (!Object.keys(carrinho).length) return avisar('Inventário vazio. Selecione ao menos um item.');
    carrinho = {};
    atualizar();
    fecharCarrinho();
    avisar('Pedido transmitido ao Bunker. Glória à humanidade!');
});

let timerAviso;
function avisar(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('ativo');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => t.classList.remove('ativo'), 3000);
}

/* ===== Redesenha tudo a partir do estado ===== */
function atualizar() {
    let itens = 0, subtotal = 0;

    produtos.forEach(p => {
        const q = qtd(p.id);
        const linha = $(p.id);
        linha.querySelector('.qtd-valor').textContent = q;
        linha.querySelector('.total').textContent = moeda(q * p.preco);
        linha.classList.toggle('no-carrinho', q > 0);
        itens += q;
        subtotal += q * p.preco;
    });

    const contador = $('carrinho-contador');
    contador.textContent = itens;
    contador.classList.toggle('oculto', itens === 0);

    $('carrinho-itens').innerHTML = itens === 0
        ? '<p class="carrinho-vazio">Inventário vazio.<br>Use o + nas tabelas para adicionar itens.</p>'
        : produtos.filter(p => qtd(p.id)).map(p => `
            <div class="item-carrinho">
                <img src="${p.img}" alt="${p.nome}">
                <div class="item-info">
                    <span class="nome">${p.nome}</span>
                    <span class="preco">${moeda(p.preco)} cada</span>
                    <div class="quantidade mini">
                        <button type="button" data-acao="menos" data-id="${p.id}" aria-label="Diminuir">−</button>
                        <span class="qtd-valor">${qtd(p.id)}</span>
                        <button type="button" data-acao="mais" data-id="${p.id}" aria-label="Aumentar">+</button>
                    </div>
                </div>
                <div class="item-acoes">
                    <span>${moeda(p.preco * qtd(p.id))}</span>
                    <button type="button" class="btn-remover" data-acao="remover" data-id="${p.id}">Remover</button>
                </div>
            </div>`).join('');

    $('carrinho-subtotal').textContent = moeda(subtotal);
    $('rodape-subtotal').textContent = moeda(subtotal);
    $('rodape-itens').textContent = itens + (itens === 1 ? ' item' : ' itens');

    try { localStorage.setItem('yorha-carrinho', JSON.stringify(carrinho)); } catch (e) {}
}

/* ===== Música =====
   Navegadores bloqueiam som automático: ela começa no primeiro clique/tecla
   na página. O botão 🔊/🔇 liga e desliga (e lembra a sua escolha). */
const trilha = $('trilha');
const btnMusica = $('btn-musica');
trilha.volume = 0.3;                         // DICA: de 0 (mudo) a 1 (máximo)

let silenciada = false;
try { silenciada = localStorage.getItem('yorha-musica') === 'off'; } catch (e) {}

function marcarBotao() {
    const tocando = !trilha.paused;
    btnMusica.textContent = tocando ? '🔊' : '🔇';
    btnMusica.setAttribute('aria-pressed', tocando);
}

function tocar() {
    return trilha.play().then(marcarBotao).catch(() => {});
}

btnMusica.addEventListener('click', e => {
    e.stopPropagation();
    if (trilha.paused) { silenciada = false; tocar(); } else { silenciada = true; trilha.pause(); marcarBotao(); }
    try { localStorage.setItem('yorha-musica', silenciada ? 'off' : 'on'); } catch (err) {}
});

function iniciarNoPrimeiroToque() {
    if (!silenciada && trilha.paused) tocar();
}
['pointerdown', 'keydown'].forEach(ev =>
    document.addEventListener(ev, function uma(e) {
        if (btnMusica.contains(e.target)) return;   // o botão cuida de si mesmo
        iniciarNoPrimeiroToque();
        document.removeEventListener(ev, uma);
    })
);

atualizar();
marcarBotao();

/* ==========================================================
   TEMA NIER:AUTOMATA — boot, Pod 042, mira, sons e segredo
   ========================================================== */
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esperar = ms => new Promise(r => setTimeout(r, ms));
const temBoot = !!$('boot');                  // sem o HTML do terminal, nada trava

/* ----- Sons de interface (blips de terminal). Respeitam o botão 🔊/🔇 ----- */
let audioCtx;
function bip(freq = 740, dur = 0.05) {
    if (silenciada) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator(), vol = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        vol.gain.value = 0.03;                       // DICA: volume dos blips
        osc.connect(vol).connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
}
document.addEventListener('click', e => {
    const alvo = e.target.closest('button, a');
    if (alvo) bip(alvo.classList.contains('btn-mais') ? 1175 : 740);
});

/* ----- Pod 042 ----- */
const podFala = $('pod-fala');
let timerPod;
function falar(txt) {
    if (!podFala) return;
    podFala.textContent = txt;
    podFala.classList.add('ativa');
    clearTimeout(timerPod);
    timerPod = setTimeout(() => podFala.classList.remove('ativa'), 4500);
}
const dicas = [
    'Proposta: passe o mouse sobre um produto para selecioná-lo.',
    'Proposta: clique numa imagem do carrossel para inspecionar o item.',
    'Informe: o botão 🔊 liga e desliga a trilha sonora.',
    'Observação: colecionar é uma forma de memória. Recomendo estoque extra.',
    'Proposta: existe um protocolo secreto. Sequência: ↑ ↑ ↓ ↓ ← → ← → B A (ou W W S S A D A D B A).',
    'Resposta: não, não sou um brinquedo. Sou a Unidade de Apoio 042.'
];
$('pod-corpo')?.addEventListener('click', () => falar(dicas[Math.floor(Math.random() * dicas.length)]));

const _mudarQtd = mudarQtd;
mudarQtd = function (id, delta) {
    const antes = Object.keys(carrinho).length;
    _mudarQtd(id, delta);
    const p = produtos.find(x => x.id === id);
    if (delta > 0) falar(`Informe: ${p.nome} adicionado ao inventário.`);
    else if (antes && !Object.keys(carrinho).length) falar('Observação: inventário vazio. Eficiência de compra: 0%.');
};
document.querySelector('.tabelas').addEventListener('mouseover', e => {
    const tr = e.target.closest('tr[id]');
    if (tr && tr !== window._ultimaLinha) { window._ultimaLinha = tr; bip(520, 0.03); }
});
document.querySelectorAll('.track').forEach(t => t.addEventListener('click', e => {
    if (e.target.closest('a')) falar('Proposta: inspecionar o item selecionado.');
}));
btnMusica.addEventListener('click', () => falar(trilha.paused ? 'Informe: trilha sonora desativada.' : 'Informe: trilha sonora ativada.'));
$('btn-finalizar').addEventListener('click', () => {
    if ($('toast').textContent.includes('transmitido')) falar('Resposta: transmissão concluída. Glória à humanidade.');
});

/* ----- Texto do header "digitado" ----- */
const pHeader = document.querySelector('.conteudo-header p');
const textoHeader = pHeader.textContent.trim().replace(/\s+/g, ' ');
pHeader.setAttribute('aria-label', textoHeader);
pHeader.textContent = (reduz || !temBoot) ? textoHeader : '';
async function digitar() {
    if (reduz) return;
    pHeader.classList.add('digitando');
    for (const ch of textoHeader) { pHeader.textContent += ch; await esperar(10); }  // DICA: 10 = ms por letra
    pHeader.classList.remove('digitando');
}

/* ----- Terminal de boot ----- */
const linhasBoot = [
    'YoRHa UNIT No.2 TYPE B — TERMINAL DA LOJA',
    '> Verificando sistema ........ OK',
    `> Carregando acervo: ${produtos.length} itens`,
    '> Sincronizando com o Bunker .. OK',
    '> Glória à humanidade.',
    ''
];
let pularBoot = false;
if (temBoot) document.body.classList.add('travado');
$('boot')?.addEventListener('click', () => { pularBoot = true; });

async function rodarBoot() {
    const log = $('boot-log');
    for (const linha of linhasBoot) {
        for (const ch of linha) {
            log.textContent += ch;
            if (!reduz && !pularBoot) await esperar(14);
        }
        log.textContent += '\n';
        if (!reduz && !pularBoot) await esperar(140);
    }
    const btn = $('boot-btn');
    btn.hidden = false;
    btn.focus();
}
$('boot-btn')?.addEventListener('click', () => {
    $('boot').classList.add('saindo');
    document.body.classList.remove('travado');
    if (!silenciada && trilha.paused) tocar();
    setTimeout(() => $('boot').remove(), 800);
    setTimeout(digitar, 500);
    setTimeout(() => falar('Informe: sistema online. Sou o Pod 042. Bem-vindo à Yorha.'), 1200);
});
if (temBoot) rodarBoot();

/* ----- Mira no cursor (só com mouse) ----- */
if (matchMedia('(hover: hover) and (pointer: fine)').matches && $('mira')) {
    const mira = $('mira');
    document.addEventListener('mousemove', e => {
        mira.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        mira.classList.add('visivel');
    });
    document.addEventListener('mouseover', e => mira.classList.toggle('alvo', !!e.target.closest('a, button, tr[id]')));
    document.documentElement.addEventListener('mouseleave', () => mira.classList.remove('visivel'));
}

/* ----- Protocolo secreto (Konami code) ----- */
// Duas versões da sequência: com setas e com WASD (para teclados 60%, sem setas)
const konamis = [
    ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
    ['w','w','s','s','a','d','a','d','b','a']
];
let seq = [];
document.addEventListener('keydown', e => {
    seq.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    seq = seq.slice(-10);
    if (konamis.some(k => seq.join() === k.join())) {
        document.body.classList.add('modo-glitch');
        falar('Alerta: protocolo secreto detectado. Sistema instável.');
        bip(220, 0.4);
        setTimeout(() => document.body.classList.remove('modo-glitch'), 4000);
    }
});