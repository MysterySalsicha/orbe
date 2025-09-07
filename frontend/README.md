# Orbe Nerd - Frontend

Frontend do projeto Orbe Nerd desenvolvido em Next.js 15 com TypeScript, seguindo a especificação técnica fornecida.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Zustand** - Gerenciamento de estado global
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **Framer Motion** - Animações

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais e variáveis CSS
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── layout/           # Componentes de layout
│   │   └── Header.tsx    # Cabeçalho principal
│   ├── media/            # Componentes de mídia
│   │   ├── Carousel.tsx  # Carrossel de itens
│   │   └── MidiaCard.tsx # Card de mídia
│   ├── modals/           # Modais e overlays
│   │   └── SearchOverlay.tsx # Overlay de pesquisa
│   └── providers/        # Providers de contexto
│       └── AppProvider.tsx # Provider principal
├── data/                 # Dados mockados
│   └── mockData.ts       # API mockada e dados de teste
├── hooks/                # Hooks customizados
│   └── useTheme.ts       # Hook para gerenciamento de tema
├── stores/               # Stores do Zustand
│   └── appStore.ts       # Store global da aplicação
└── types/                # Definições de tipos TypeScript
    └── index.ts          # Tipos principais
```

## 🎨 Funcionalidades Implementadas

### ✅ Header Responsivo
- Logo com gradiente "Orbe Nerd"
- Navegação completa (Filmes, Animes, Séries, Jogos, Premiações, "O que tem pra hoje")
- Seletor de tema (Claro/Escuro/Sistema)
- Botão de pesquisa
- Contador de notificações
- Menu de usuário (quando logado)
- Menu mobile responsivo

### ✅ Sistema de Pesquisa
- Overlay fullscreen com blur de fundo
- Campo de busca com placeholder personalizado
- Teclado virtual funcional
- Filtros por categoria (Todos, Filmes, Séries, Animes, Jogos)
- Buscas populares da semana
- Resultados organizados por tipo de mídia
- Busca em tempo real (debounced)

### ✅ Carrosséis de Mídia
- Títulos dinâmicos baseados no mês/temporada
- Navegação temporal (《 》) para filmes e séries
- Scroll horizontal suave
- Suporte a drag/swipe
- Indicadores visuais de scroll
- Responsivo para mobile e desktop

### ✅ Cards de Mídia
- Imagens otimizadas com Next.js Image
- Informações detalhadas (título, data, plataformas)
- Menu de ações (Favoritar, Quero Assistir, etc.)
- Indicadores visuais (prêmios, pré-venda, novos episódios)
- Countdown para próximos episódios de animes
- Estados de interação do usuário
- Hover effects e animações

### ✅ Sistema de Temas
- Tema claro (Branco/Dourado)
- Tema escuro (Preto/Azul com acentos coloridos)
- Tema automático (segue o sistema)
- Transições suaves entre temas
- Persistência da preferência

### ✅ Gerenciamento de Estado
- Store global com Zustand
- Persistência de dados importantes
- Estados de loading e modais
- Gerenciamento de notificações
- Sistema de autenticação mockado

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Passos para executar

1. **Instalar dependências:**
```bash
npm install
# ou
pnpm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
# ou
pnpm dev
```

3. **Acessar a aplicação:**
```
http://localhost:3000
```

## 🔗 Integração com Backend

O frontend está preparado para integração com o backend Python. Todas as chamadas de API estão centralizadas no arquivo `src/data/mockData.ts`.

### Para integrar com seu backend:

1. **Substitua as funções mockadas** em `mockData.ts` por chamadas reais à sua API:

```typescript
// Exemplo de integração
export const api = {
  async getFilmes(): Promise<Filme[]> {
    const response = await fetch('/api/filmes');
    return response.json();
  },
  
  async getSeries(): Promise<Serie[]> {
    const response = await fetch('/api/series');
    return response.json();
  },
  
  // ... outras funções
};
```

2. **Configure as variáveis de ambiente** (crie um arquivo `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=sua_chave_api
```

3. **Atualize as URLs das imagens** no `next.config.ts` conforme necessário para seu CDN/storage.

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎯 Dados Mockados

O projeto inclui dados mockados completos para teste:
- **Filmes:** Duna: Parte Dois, Oppenheimer, etc.
- **Séries:** House of the Dragon, The Last of Us, etc.
- **Animes:** Demon Slayer, Attack on Titan, etc.
- **Jogos:** Baldur's Gate 3, Zelda, etc.
- **Usuário:** Dados de exemplo com interações
- **Notificações:** Sistema completo de notificações

## 🚀 Deploy

Para fazer deploy da aplicação:

1. **Build de produção:**
```bash
npm run build
```

2. **Iniciar servidor de produção:**
```bash
npm start
```

3. **Deploy em plataformas:**
- **Vercel:** Conecte o repositório e faça deploy automático
- **Netlify:** Upload da pasta `.next` após build
- **Docker:** Use o Dockerfile incluído no projeto

## 🔧 Customização

### Cores e Tema
As cores estão definidas em `src/app/globals.css` usando CSS custom properties. Para alterar:

```css
:root {
  --primary: #b8860b;        /* Dourado */
  --accent: #4f46e5;         /* Azul */
  /* ... outras cores */
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados ou estendidos.

## 📞 Suporte

Para dúvidas sobre a implementação ou integração com o backend, consulte:
- Documentação dos componentes (comentários no código)
- Tipos TypeScript em `src/types/index.ts`
- Especificação técnica original

---

**Desenvolvido seguindo a especificação técnica do Orbe Nerd** 🎮🎬📺
