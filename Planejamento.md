Planejamento do Projeto: ENEM CYBER-ARENA 2025
1. Visão do Produto
Um jogo educativo mobile-first para vestibulandos, combinando a densidade de conteúdo do ENEM com a mecânica viciante e rápida de jogos casuais (Forca/Wordwall). O objetivo é transformar a revisão de conceitos maçantes em uma experiência visual de alta energia ("Game Show Cyberpunk").

2. Pilares de Design & UX
Público-Alvo: Geração Z (Vestibulando 2025).

Estética: Neo-Brutalismo Digital + Cyberpunk.

Mood: Dark Mode, Neon (Lime/Pink), Glitch Effects.

Layout: Bento Grid (Blocos organizados), Botões Grandes (Táteis).

Princípio "Juiciness": O jogo deve ser responsivo. Feedback visual/sonoro imediato para cada acerto ou erro (partículas, tremores de tela, sons de baixo).

3. Stack Tecnológica
Core: Next.js (App Router).

Estilização: Tailwind CSS (com configuração de tema estendida).

Animação: Framer Motion (Vital para as viradas de letras e transições).

Ícones: Lucide React.

Estado: Zustand (Gerenciamento de vida, pontuação e timer).

Dados: JSON Estático (enem-dungeon-db).

4. Engenharia de Dados (O Coração)
Precisamos transformar o banco de questões bruto (questoes_limpas.json) em algo jogável.

4.1. Estratégia de ETL (Extract, Transform, Load)
Criar um script utilitário (utils/processQuestions.ts) para filtrar o JSON original antes do build ou em tempo de execução:

[ ] Filtro de Tamanho: Selecionar apenas questões onde resposta_correta tem entre 4 e 20 caracteres.

[ ] Sanitização: Remover acentos e caracteres especiais da resposta para a lógica de comparação (ex: "ÁGUA" vira "AGUA"), mas manter o original para exibição.

[ ] Categorização: Taggear questões por disciplina (MAT, HUM, NAT, LIN).

[ ] Geração de Dica: Usar o campo enunciado como dica. Se for muito longo, truncar ou pegar a primeira frase.

5. Funcionalidades (MVP - Mínimo Produto Viável)
Fase 1: Mecânica Base (The Core Loop)
[ ] Tela de Gameplay: Layout Bento Grid com Timer, Dica e Slots de Letras.

[ ] Lógica da Forca:

[ ] Input via teclado virtual.

[ ] Validação de letra (Existe na palavra?).

[ ] Revelação de letra correta (Animação de virada).

[ ] Penalidade por erro (Redução de Tempo ou Vidas).

[ ] Condição de Vitória/Derrota: Feedback visual claro ("LEVEL UP" ou "GAME OVER").

Fase 2: Game Feel (O "Cabuloso")
[ ] Timer Visual: Barra de progresso que "derrete" (não apenas números).

[ ] Feedback FX:

[ ] Shake na tela ao errar.

[ ] Confetes/Partículas ao acertar palavra.

[ ] Sombras Neon (Glow) nos elementos ativos.

Fase 3: Power-Ups (Diferencial Wordwall)
[ ] Sistema de Economia: Pontos acumulados por acertos.

[ ] Implementar Botões:

[ ] 🔍 Lupa: Revela 1 letra aleatória.

[ ] 🗑️ Lixeira: Elimina teclas erradas do teclado.

6. Estrutura de Diretórios Sugerida (Next.js)
Bash

/src
  /app
    /game
      page.tsx       # A Arena Principal
    layout.tsx       # UI Shell (Grid de fundo)
    page.tsx         # Tela Inicial (Menu)
  /components
    /ui              # Botões, Cards (Bento style)
    /game
      LetterSlot.tsx # O "cubo" da letra
      Keyboard.tsx   # O teclado virtual
      TimerBar.tsx   # O timer derretendo
      HintCard.tsx   # O vidro fosco com a dica
  /lib
    store.ts         # Zustand (Estado do jogo)
    utils.ts         # Lógica de limpar strings
  /data
    questions.json   # O arquivo filtrado
7. Roadmap de Execução
Configuração Inicial: Setup do Next.js + Tailwind (Configurar as cores Neon e Fontes).

Tratamento de Dados: Criar o script que lê o JSON do GitHub e devolve um array limpo de objetos para o jogo.

Componentização Estática: Construir o visual da tela (HTML/CSS) sem lógica, garantindo que o visual "Neo-Brutalista" esteja fiel.

Integração Lógica: Fazer o teclado controlar os slots de letras.

Polimento: Adicionar Framer Motion e efeitos.

8. Dinâmica de Jogo & Metagame
8.1. O Modo de Jogo: "Survival Run" (Corrida de Sobrevivência)
Em vez de fases isoladas, o jogo funciona como uma "Run" (corrida infinita). O objetivo é acertar o maior número de palavras em sequência (Streak) antes de ser eliminado.

Recurso Principal: O TEMPO (Time Bank)

O jogador começa com um banco de tempo (ex: 60 segundos).

Não existem "vidas" fixas. O tempo é a vida.

Acertou Letra: +3 segundos.

Errou Letra: -10 segundos (Penalidade severa).

Acertou a Palavra: +15 segundos e avança para a próxima.

Derrota: Quando o cronômetro chega a 00:00.

8.2. Seleção de Matérias (O "Lobby")
Ao abrir o app, o aluno vê o "Hub de Missões" (Bento Grid Style). Ele pode escolher:

Treino Específico (Filtro por Tag):

🟦 [ MAT ] Matemática

🟪 [ LIN ] Linguagens

🟧 [ HUM ] Humanas

🟩 [ NAT ] Natureza

Regra: Ganha XP normal (1x). Ideal para estudar para a prova de amanhã.

O Desafio Geral (Modo Arena):

🌈 [ MIX ] Todas as matérias misturadas aleatoriamente.

Regra: Ganha XP Dobrado (2x). É o modo competitivo.

8.3. Sistema de Classificação (Ranking "Vestibular")
Para não ficar chato com "Nível 1, 2, 3", usamos nomenclaturas baseadas na jornada acadêmica, mas com um toque futurista:

Rank E (0 XP): TRAINEE (Iniciante)

Rank D: CALOURO

Rank C: VETERANO

Rank B: MESTRE

Rank A: DOUTOR

Rank S: LENDA DO ENEM (Top 1% dos jogadores)

Visual: O Rank aparece como um crachá holográfico no perfil do usuário.

8.4. Tela de Resultados (O "Cyber-Boletim")
Quando o jogador perde (Tempo esgotado), entra a tela de "DEBRFING" (Resultados).

O Visual: Um card estilo "Recibo de Compra" ou "Relatório de Erro de Sistema".

Métricas Exibidas:

Streak Final: "Você sobreviveu a 12 questões."

Precisão: "68% de acerto nas teclas."

Matéria Crítica: "Seu ponto fraco foi: QUÍMICA" (O sistema identifica onde ele errou mais).

Call to Action (Botões):

[ REINICIAR SISTEMA ] (Jogar de novo imediatamente).

[ COMPARTILHAR FALHA ] (Gera uma imagem legal para postar no Insta/Story desafiando amigos).

8.5. Condição de Vitória (O "Jackpot")
Como é um jogo infinito, a "Vitória" é bater o próprio recorde (High Score). Mas, para dar sensação de progresso, a cada 5 Questões completadas na mesma Run, acontece um "OVERDRIVE":

A tela muda de cor.

A música acelera.

O multiplicador de pontos aumenta.

Resumo do Fluxo de Navegação (UX Flow):
Splash Screen (Logo Cyber-Arena).

Lobby: Mostra seu Rank Atual + Botões de Seleção de Matéria.

Gameplay:

Questão 1 (Fácil) -> Questão 2 (Média) -> ...

Loop: Dica -> Chute -> Feedback.

Game Over:

Animação de "SYSTEM FAILURE".

Exibe o Cyber-Boletim.

Atualiza o Rank (se ganhou XP suficiente).

Retorno ao Lobby.