import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import questionsData from '@/data/questions.json';

// --- TIPOS ---

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';

export type KeyboardKey = {
  char: string;
  status: 'idle' | 'correct' | 'wrong' | 'disabled'; // 'disabled' é usado pela Lixeira
};

export type Question = {
  id: string;
  discipline: string;
  topic: string;
  hint: string;
  answer: string;
};

type GameState = {
  score: number;
  timeLeft: number;
  streak: number;
  status: GameStatus;
  
  // Power-Ups (Quantidade disponível)
  powerups: {
    reveal: number; // 🔍 Lupa
    trash: number;  // 🗑️ Lixeira
  };

  currentQuestion: Question | null;
  revealedLetters: string[];
  keyboard: KeyboardKey[];
};

type GameActions = {
  startGame: () => void;
  tickTimer: () => void;
  submitGuess: (letter: string) => void;
  
  // Novas Actions de Power-Up
  useRevealPowerup: () => void;
  useTrashPowerup: () => void;
  
  resetGame: () => void;
};

// --- STORE ---

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    immer((set, get) => ({
      score: 0,
      timeLeft: 60,
      streak: 0,
      status: 'idle',
      powerups: { reveal: 3, trash: 3 }, // Começa com 3 de cada
      currentQuestion: null,
      revealedLetters: [],
      keyboard: [],

      startGame: () => {
        set((state) => {
          state.status = 'playing';
          state.score = 0;
          state.timeLeft = 60;
          state.streak = 0;
          state.powerups = { reveal: 3, trash: 3 }; // Reseta os itens na nova partida
          
          // Sorteio da Questão
          const randomIndex = Math.floor(Math.random() * questionsData.length);
          const selectedQuestion = questionsData[randomIndex];

          const newQuestion: Question = {
            id: selectedQuestion.id,
            discipline: selectedQuestion.discipline,
            topic: selectedQuestion.topic,
            hint: selectedQuestion.hint,
            answer: selectedQuestion.answer.toUpperCase()
          };

          state.currentQuestion = newQuestion;
          state.revealedLetters = Array(newQuestion.answer.length).fill('');

          // Gerador de Teclado
          const answerChars = newQuestion.answer.split('');
          const distractors = ['X', 'A', 'B', 'Z', 'M', 'R', 'S', 'T', 'L', 'C', 'V', 'P'];
          const pool = Array.from(new Set([...answerChars, ...distractors])).slice(0, 15);
          const shuffledKeys = pool.sort(() => Math.random() - 0.5);
          
          state.keyboard = shuffledKeys.map(char => ({ char, status: 'idle' }));
        });
      },

      tickTimer: () => {
        set((state) => {
          if (state.status !== 'playing') return;
          if (state.timeLeft > 0) {
            state.timeLeft -= 1;
          } else {
            state.status = 'gameover';
          }
        });
      },

      // 🔍 POWER-UP: LUPA
      useRevealPowerup: () => {
        set((state) => {
          if (state.status !== 'playing' || state.powerups.reveal <= 0 || !state.currentQuestion) return;

          // 1. Achar índices que ainda estão vazios
          const emptyIndices = state.revealedLetters
            .map((char, idx) => char === '' ? idx : -1)
            .filter(idx => idx !== -1);

          if (emptyIndices.length === 0) return;

          // 2. Escolher um aleatório
          const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const letterToReveal = state.currentQuestion.answer[randomIdx];

          // 3. Revelar no Painel
          state.revealedLetters[randomIdx] = letterToReveal;

          // 4. Marcar no Teclado como "Correto"
          const keyInBoard = state.keyboard.find(k => k.char === letterToReveal);
          if (keyInBoard) keyInBoard.status = 'correct';

          // 5. Gastar o item
          state.powerups.reveal -= 1;

          // 6. Checar Vitória (caso a lupa complete a palavra)
          if (!state.revealedLetters.includes('')) {
            state.status = 'victory';
          }
        });
      },

      // 🗑️ POWER-UP: LIXEIRA
      useTrashPowerup: () => {
        set((state) => {
          if (state.status !== 'playing' || state.powerups.trash <= 0 || !state.currentQuestion) return;

          const answer = state.currentQuestion.answer;

          // 1. Achar teclas que são distratores (não estão na resposta) e estão 'idle'
          const trashableKeys = state.keyboard.filter(
            k => !answer.includes(k.char) && k.status === 'idle'
          );

          if (trashableKeys.length === 0) return;

          // 2. Eliminar até 3 teclas aleatórias
          const keysToRemove = trashableKeys
            .sort(() => Math.random() - 0.5)
            .slice(0, 3); // Remove 3

          keysToRemove.forEach(kToRemove => {
            const key = state.keyboard.find(k => k.char === kToRemove.char);
            if (key) key.status = 'disabled'; // Nova cor visual (apagado)
          });

          // 3. Gastar o item
          state.powerups.trash -= 1;
        });
      },

      submitGuess: (letter) => {
        set((state) => {
          if (state.status !== 'playing' || !state.currentQuestion) return;

          const answer = state.currentQuestion.answer;
          const keyIndex = state.keyboard.findIndex(k => k.char === letter);

          // Se a tecla já foi desabilitada pela lixeira, ignora
          if (keyIndex !== -1 && state.keyboard[keyIndex].status === 'disabled') return;

          if (answer.includes(letter)) {
            // ACERTO
            if (keyIndex !== -1) state.keyboard[keyIndex].status = 'correct';
            
            answer.split('').forEach((char, index) => {
              if (char === letter) state.revealedLetters[index] = letter;
            });

            state.score += 10 + (state.streak * 5);
            state.streak += 1;
            state.timeLeft += 2; 

            if (!state.revealedLetters.includes('')) {
               state.status = 'victory';
            }

          } else {
            // ERRO
            if (keyIndex !== -1) state.keyboard[keyIndex].status = 'wrong';
            state.streak = 0;
            state.timeLeft -= 5;
          }
        });
      },

      resetGame: () => {
        set((state) => {
          state.status = 'idle';
          state.score = 0;
          state.timeLeft = 60;
        });
      }
    }))
  )
);