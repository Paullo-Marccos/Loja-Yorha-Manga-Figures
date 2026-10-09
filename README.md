⚔️ Loja Yorha Manga & Figures

"Everything that lives is designed to end. We are perpetually trapped in a never-ending spiral of life and death. Is it a curse? Or some kind of punishment?"

— 2B

Uma aplicação web interativa e temática inspirada no universo de NieR:Automata. O projeto simula o terminal de vendas da YoRHa, permitindo a navegação e compra de action figures e mangás com uma experiência imersiva repleta de efeitos visuais, áudio dinâmico e easter eggs.

🚀 Demonstração das Funcionalidades

🖥️ Terminal de Boot Customizado: Animação de entrada estilo linha de comando simulando a inicialização do sistema da Unidade YoRHa.

🤖 Pod 042 Integrado: Assistente virtual interativo que fornece dicas, status das ações no carrinho e comentários sobre o sistema.

🛒 Gestão de Inventário (Carrinho):

Adição e remoção dinâmica de itens.

Atualização do valor total em tempo real.

Persistência de dados local via localStorage.

Painel lateral estilo Drawer (deslizante).

🎵 Trilha Sonora & Efeitos Sonoros:

Trilha de fundo com controle de áudio (ligar/desligar com memória de preferência).

Feedback sonoro sintético (blips de áudio via Web Audio API) ao interagir com botões e itens.

🎡 Carrossel Infinito: Exibição dinâmica em alta velocidade de produtos com destaque ao passar o cursor.

🎯 HUD e Interface Temática:

Cursor customizado no estilo retículo/mira de combate.

Linhas de varredura CRT sobrepostas.

Efeito de digitação (typing effect) nas descrições.

🎮 Easter Egg (Protocolo Secreto): Suporte à sequência do clássico Konami Code (↑ ↑ ↓ ↓ ← → ← → B A ou W W S S A D A D B A) ativando um modo de emergência/glitch no sistema.

🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web fundamentais, sem a necessidade de frameworks externos, garantindo alta performance e leveza:

HTML5: Estrutura semântica e acessibilidade (aria-labels, role="status").

CSS3:

Layout flexível com Flexbox e CSS Grid.

Variáveis CSS (Custom Properties) para consistência visual.

Animações e transições fluidas (@keyframes).

Suporte a acessibilidade com media query @media (prefers-reduced-motion).

JavaScript (Vanilla ES6+):

Manipulação assíncrona com async/await para sequências do terminal.

Manipulação de estado e DOM em tempo real.

Web Audio API para geração de efeitos sonoros em tempo real.

Web Storage API (localStorage) para salvar itens do carrinho e preferências do usuário.

📂 Estrutura de Pastas

.
├── index.html          # Estrutura principal do HTML
├── css/
│   └── index.css       # Estilização completa e temas visuais
├── java/
│   └── index.js        # Lógica de negócios, carrinho e efeitos de áudio
├── img/                # Imagens dos produtos e backgrounds
│   ├── logoyorha.png
│   ├── 2bbackground.png
│   └── ... (imagens de figures e mangás)
└── audio/              # Trilha sonora do projeto
    └── trilha.mp3


💻 Como Executar o Projeto

Clone o repositório:

git clone https://github.com/Paullo-Marccos/yorha-manga-figures.git


Navegue até a pasta do projeto:

cd yorha-manga-figures


Abra o projeto:

Basta abrir o arquivo index.html em qualquer navegador web de sua preferência, ou utilizar uma extensão como o Live Server no VS Code.

👤 Autor

Desenvolvido por Paullo-Marccos

Glória à Humanidade. 🗡️
