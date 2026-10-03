# Lara Luxo Modas — Boutique de Moda Feminina (Versão Elevada)

Projeto de recriação e elevação visual e técnica da loja virtual **Lara Luxo Modas**, com estética *Haute-Couture / Editorial*, alto padrão de performance, microinterações táteis e contatos 100% fictícios para demonstração comercial.

---

## ✨ Destaques da Nova Versão (Fator Anti-IA & Elevação Visual)

1. **Direção Visual Autoral & Paleta Nobre**:
   - **Vinho Aveludado & Marsala Profundo** (`#4e0717`, `#32040d`, `#220207`) como base da marca.
   - **Rosé Gold & Champagne Metálicos** com gradientes de folha de ouro para botões primários e detalhes.
   - **Creme Seda & Papel Marfim** (`#fcf9f5`, `#f8ebe6`) proporcionando contraste quente e descansado.
   - **Purple Ban Estrito**: Zero uso de roxo neon ou clichês genéricos de IA.

2. **Tipografia Editorial de Luxo**:
   - **Bodoni Moda** (variável 400..800) para títulos imponentes de revista de alta moda.
   - **Cormorant Garamond** para toques manuscritos sofisticados.
   - **Plus Jakarta Sans** para máxima legibilidade no catálogo, checkout e mobile.

3. **Recursos de Alta Interatividade**:
   - **Arara Giratória 3D**: Carrossel 3D interativo com física de arraste, momentum de desaceleração, cabides metálicos rosé gold e projeção 2D de trilho circular para nitidez absoluta.
   - **Sacola 3D Origami**: Animação em CSS 3D da sacola da marca com lenço de papel de seda, alças e sombras dinâmicas.
   - **Sacola de Compras Inteligente (Minicart Drawer)**:
     - Barra de progresso dinâmica de frete grátis (meta de R$ 299).
     - Cronômetro de reserva de peças (15 minutos).
     - Sistema de cupons (`BEMVINDA` para 10% OFF).
     - Sugestões de upsell personalizadas ("Uma de cada, por favor?" ou "Complete o look").
     - Recálculo em tempo real com 5% de desconto no Pix.
   - **Página de Detalhes do Produto (PDP)**:
     - Galeria com slide de zoom na textura do tecido.
     - Seletores de cor e tamanho com feedback visual imediato.
     - Tabela de medidas detalhada em modal.
     - Calculadora de frete por CEP em tempo real.
     - Barra de compra fixa no celular ao rolar a página.
   - **Checkout Completo e Transparente**:
     - 3 etapas simples (Contato, Entrega e Pagamento).
     - Preenchimento e formatação automática de CEP e WhatsApp.
     - Opções de entrega (Retirada no Espaço Conceito, Entrega expressa ou Correios).
     - Pagamento via Pix com geração dinâmica de QR Code e botão de cópia com feedback toast.
     - Celebração com confetes dinâmicos em canvas puro ao concluir o pedido.
   - **Prova Social & Avaliações Reais**:
     - Seção dedicada de depoimentos de clientes com estrelas douradas e selo de compra verificada.
   - **Espaço Conceito / Loja Física**:
     - Fachada com parede ripada iluminada, foto real do provador com as touquinhas protetoras e integração com rotas do Google Maps.

---

## 📞 Contatos Fictícios Configurados

Centralizados em `src/data/contacts.js`:

| Informação | Dado Fictício |
|---|---|
| **WhatsApp** | `(11) 98765-4321` |
| **Telefone Fixo** | `(11) 3456-7890` |
| **E-mail de Atendimento** | `atendimento@laraluxomodas.com.br` |
| **Endereço Físico** | `Av. Pres. Kennedy, 7420, Galeria Boulevard, Loja 14 · Ocian, Praia Grande/SP` |
| **CEP** | `11704-000` |
| **Horário de Funcionamento** | `Segunda a Sábado: 10h às 19h30 \| Domingos e Feriados: 11h às 17h` |
| **CNPJ** | `45.892.110/0001-92` |
| **Razão Social** | `Lara Luxo Modas & Confecções Ltda.` |
| **Instagram** | `@laraluxomodas.oficial` |

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 18+ instalado.

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar em Ambiente de Desenvolvimento
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:5173/`.

### 3. Gerar Build de Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

### 4. Pré-visualizar o Build
```bash
npm run preview
```

---

## 📁 Estrutura de Arquivos

```text
resilient-meitner/
├── index.html                   # HTML semântico com SEO, fontes e containers SPA
├── package.json                 # Configuração do projeto e scripts Vite
├── public/
│   └── images/                  # 21 imagens dos looks e catálogo em formato WebP
├── src/
│   ├── main.js                  # Ponto de entrada e inicialização
│   ├── data/
│   │   ├── contacts.js          # Contatos e endereços fictícios centralizados
│   │   ├── products.js          # Catálogo completo de 19 produtos, categorias e FAQ
│   │   └── reviews.js           # Depoimentos e métricas de satisfação
│   ├── modules/
│   │   ├── state.js             # Estado reativo com persistência em localStorage
│   │   ├── utils.js             # Formatadores BRL/Pix, ícones SVG e animações
│   │   ├── cart.js              # Mecânica da sacola, cálculo de frete e cupons
│   │   ├── arara.js             # Física 3D da arara giratória com arraste por toque
│   │   ├── checkout.js          # Checkout em 3 passos, cálculo de CEP e tela de sucesso
│   │   ├── overlay.js           # Gerenciamento de gavetas, modais e scroll lock
│   │   ├── quickview.js         # Modal de escolha rápida de tamanho e tabela de medidas
│   │   ├── search.js            # Busca instantânea com sugestões
│   │   ├── router.js            # Roteador SPA hash (#/, #/loja, #/p/:slug, #/checkout)
│   │   └── ui.js                # Observadores de rolagem, timers e listeners globais
│   └── styles/
│       ├── main.css             # Agregador dos estilos
│       ├── variables.css        # Tokens de design, cores e sombras
│       ├── base.css             # Reset, tipografia e botões
│       ├── header.css           # Header com efeito vidro e topbar com ticker
│       ├── hero.css             # Hero editorial e carrossel de stories
│       ├── arara.css            # Estilos da arara giratória 3D
│       ├── catalog.css          # Cards de produtos, selos e mostruário de cores
│       ├── sections.css         # Kit bundle, liquida com cronômetro e loja física
│       ├── drawer.css           # Gaveta da sacola, busca, menu mobile e toasts
│       ├── bag3d.css            # Animação 3D origami da sacola da marca
│       ├── pdp.css              # Página de detalhes do produto e galeria com zoom
│       └── checkout.css         # Formulário de checkout e confirmação com QR Pix
```
