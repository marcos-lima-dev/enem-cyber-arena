Com certeza\! Um `README.md` bem feito é o cartão de visitas do projeto. Ele precisa explicar não só **como rodar**, mas **qual é a alma** do jogo e as decisões técnicas inteligentes que tomamos (como o uso do Immer).

Aqui está a versão definitiva, pronta para você copiar e colar na raiz do seu projeto.

-----

# ⚡ ENEM CYBER-ARENA

  

> **"O Tempo é a sua Vida."** — Um Survival Quiz Gamificado para a Geração Z.

## 🎮 Sobre o Projeto

O **ENEM CYBER-ARENA** reinventa a revisão para o vestibular. Abandonamos a interface de "simulado de papel" para criar uma experiência de alta octanagem, inspirada em Game Shows e estética Cyberpunk.

O objetivo é testar **reflexo, vocabulário e reconhecimento de padrões** dos estudantes, transformando questões complexas do ENEM em desafios de palavras-chave rápidos e viciantes.

-----

## ✨ Diferenciais de UX (Game Design)

### 1\. Mecânica "Clutch" (Alta Tensão)

Quando o tempo resta menos de **5 segundos**, a interface entra em estado crítico (vinheta vermelha pulsante, som abafado). Acertos nesse momento geram bônus massivos ("Clutch Save"), criando momentos memoráveis de gameplay.

### 2\. Smart Keypad (UX Mobile First)

Teclados QWERTY completos em telas verticais causam erros de toque ("fat finger").

  * **Nossa Solução:** Um teclado dinâmico gerado proceduralmente a cada rodada, contendo apenas 12 a 15 teclas (letras da resposta + distratores), permitindo botões maiores e táteis.

### 3\. Progressive Disclosure (Carga Cognitiva)

Enunciados do ENEM são longos e intimidadores.

  * **Padrão:** O jogo exibe apenas a **Disciplina** e o **Tópico**.
  * **Sob Demanda:** O aluno "invoca" o enunciado completo (Dica) apenas se travar, mantendo a tela limpa e o foco na ação.

-----

## 🛠️ Tech Stack & Arquitetura

O projeto foi construído sobre uma stack moderna, focado em performance e DX (Developer Experience).

  * **Framework:** [Next.js 14](https://nextjs.org/) (App Router & Server Components)
  * **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Com Design System estendido via CSS Variables)
  * **UI Kit:** [ShadCN UI](https://ui.shadcn.com/) (Componentes acessíveis e customizáveis)
  * **Animação:** [Framer Motion](https://www.framer.com/motion/) (Transições de estado e feedback visual)
  * **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
      * **Middleware:** [Immer](https://github.com/immerjs/immer) (Para imutabilidade simplificada e lógica de jogo limpa)
  * **Ícones:** [Lucide React](https://lucide.dev/)
  * **Dados:** JSON estático tratado do repositório `enem-dungeon-db`.

-----

## 🚀 Instalação e Execução

Pré-requisitos: Node.js 18+ instalado.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/enem-cyber-arena.git
    cd enem-cyber-arena
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

    *Nota: Certifique-se de que `immer` e `zustand` foram instalados corretamente.*

3.  **Rode o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

4.  **Acesse o jogo:**
    Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador.

-----

## 📂 Estrutura de Diretórios (Destaques)

A arquitetura segue o padrão modular do Next.js App Router:

```bash
/src
  ├── /app
  │   ├── /game         # Rota principal da Arena (Gameplay)
  │   ├── layout.tsx    # Shell da aplicação (Fontes, Metadados)
  │   └── globals.css   # Variáveis de Tema (Neon Colors, Animations)
  │
  ├── /components
  │   ├── /ui           # Componentes ShadCN (Button, Card, Progress...)
  │   └── /game         # Componentes Exclusivos do Jogo
  │       ├── SmartKeyboard.tsx  # O teclado gerado logicamente
  │       ├── LetterSlot.tsx     # O "cubo" 3D da letra
  │       └── GameTimer.tsx      # A barra de tempo que "derrete"
  │
  ├── /lib
  │   └── /store
  │       └── useGameStore.ts    # Lógica do Zustand + Immer
  │
  └── /data
      └── questions.json         # Banco de questões tratado
```

-----

## 🎨 Design System (Paleta Cyber)

O tema visual é controlado via `tailwind.config.ts` e variáveis CSS.

| Cor | Hex | Uso |
| :--- | :--- | :--- |
| **Deep Black** | `#0a0a0a` | Background Principal |
| **Cyber Lime** | `#13ec80` | Ações Primárias / Acertos |
| **Neon Pink** | `#ff00ff` | Acentos / Destaques |
| **Safety Orange**| `#ff3300` | Erro / Tempo Crítico / Perigo |

-----

## 🤝 Contribuição

Este é um projeto Open Source focado em educação. Pull Requests são bem-vindos\!

1.  Fork o projeto.
2.  Crie sua Feature Branch (`git checkout -b feature/NovaMecanica`).
3.  Commit suas mudanças (`git commit -m 'Add: Novo Power-up de Lupa'`).
4.  Push para a Branch (`git push origin feature/NovaMecanica`).
5.  Abra um Pull Request.

-----

**Desenvolvido com ⚡, Next.js e muita cafeína.**