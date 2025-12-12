import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import questionsData from '@/data/questions.json';

// --- TIPOS ---
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';
export type FilterMode = 'MIX' | 'HUM' | 'NAT' | 'LIN'; // 👈 NOVOS MODOS

export type KeyboardKey = {
  char: string;
  status: 'idle' | 'correct' | 'wrong' | 'disabled';
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
  filterMode: FilterMode; // 👈 Estado do Filtro
  
  powerups: {
    reveal: number;
    trash: number;
  };

  currentQuestion: Question | null;
  revealedLetters: string[];
  keyboard: KeyboardKey[];
};

type GameActions = {
  startGame: () => void;
  setFilterMode: (mode: FilterMode) => void; // 👈 Action para mudar o modo
  tickTimer: () => void;
  submitGuess: (letter: string) => void;
  useRevealPowerup: () => void;
  useTrashPowerup: () => void;
  resetGame: () => void;
};

// --- MAPA DE CATEGORIAS ---
// Agrupa as tags do JSON nas grandes áreas
const CATEGORY_MAP: Record<string, string[]> = {
  'HUM': ['HIST', 'GEO', 'FILO', 'SOC'],
  'NAT': ['MAT', 'FIS', 'QUIM', 'BIO'],
  'LIN': ['LIN', 'LIT', 'ING', 'ESP', 'ART', 'EDF']
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    immer((set, get) => ({
      score: 0,
      timeLeft: 60,
      streak: 0,
      status: 'idle',
      filterMode: 'MIX', // Padrão: Mistureba
      powerups: { reveal: 3, trash: 3 },
      currentQuestion: null,
      revealedLetters: [],
      keyboard: [],

      // Action simples para trocar o modo no menu
      setFilterMode: (mode) => {
        set((state) => { state.filterMode = mode; });
      },

      startGame: () => {
        set((state) => {
          state.status = 'playing';
          state.score = 0;
          state.timeLeft = 60;
          state.streak = 0;
          state.powerups = { reveal: 3, trash: 3 };
          
          // 1. FILTRAGEM INTELIGENTE 🧠
          let pool = questionsData;

          if (state.filterMode !== 'MIX') {
            const allowedTags = CATEGORY_MAP[state.filterMode];
            // Filtra o JSON apenas com as disciplinas da área escolhida
            const filtered = questionsData.filter(q => allowedTags.includes(q.discipline));
            
            // Se tiver questões suficientes, usa o filtro. Se não (fallback), usa tudo.
            if (filtered.length > 0) {
              pool = filtered;
            }
          }

          // 2. Sorteio (usando o pool filtrado)
          const randomIndex = Math.floor(Math.random() * pool.length);
          const selectedQuestion = pool[randomIndex];

          // 3. Montagem da Questão
          const newQuestion: Question = {
            id: selectedQuestion.id,
            discipline: selectedQuestion.discipline,
            topic: selectedQuestion.topic,
            hint: selectedQuestion.hint,
            answer: selectedQuestion.answer.toUpperCase()
          };

          state.currentQuestion = newQuestion;
          state.revealedLetters = Array(newQuestion.answer.length).fill('');

          // 4. Teclado
          const answerChars = newQuestion.answer.split('');
          const distractors = ['X', 'A', 'B', 'Z', 'M', 'R', 'S', 'T', 'L', 'C', 'V', 'P', 'E', 'O'];
          const uniquePool = Array.from(new Set([...answerChars, ...distractors])).slice(0, 15);
          const shuffledKeys = uniquePool.sort(() => Math.random() - 0.5);
          
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

      useRevealPowerup: () => {
         // ... (Mesma lógica de antes)
         set((state) => {
            if (state.status !== 'playing' || state.powerups.reveal <= 0 || !state.currentQuestion) return;
            const emptyIndices = state.revealedLetters.map((c, i) => c === '' ? i : -1).filter(i => i !== -1);
            if (emptyIndices.length === 0) return;
            const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            const char = state.currentQuestion.answer[randomIdx];
            state.revealedLetters[randomIdx] = char;
            const key = state.keyboard.find(k => k.char === char);
            if (key) key.status = 'correct';
            state.powerups.reveal -= 1;
            if (!state.revealedLetters.includes('')) state.status = 'victory';
         });
      },

      useTrashPowerup: () => {
        // ... (Mesma lógica de antes)
        set((state) => {
            if (state.status !== 'playing' || state.powerups.trash <= 0 || !state.currentQuestion) return;
            const ans = state.currentQuestion.answer;
            const trashable = state.keyboard.filter(k => !ans.includes(k.char) && k.status === 'idle');
            if (trashable.length === 0) return;
            const toRemove = trashable.sort(() => Math.random() - 0.5).slice(0, 3);
            toRemove.forEach(r => {
                const k = state.keyboard.find(key => key.char === r.char);
                if (k) k.status = 'disabled';
            });
            state.powerups.trash -= 1;
        });
      },

      submitGuess: (letter) => {
        // ... (Mesma lógica de antes)
        set((state) => {
            if (state.status !== 'playing' || !state.currentQuestion) return;
            const ans = state.currentQuestion.answer;
            const kIdx = state.keyboard.findIndex(k => k.char === letter);
            if (kIdx !== -1 && state.keyboard[kIdx].status === 'disabled') return;

            if (ans.includes(letter)) {
                if (kIdx !== -1) state.keyboard[kIdx].status = 'correct';
                ans.split('').forEach((c, i) => { if (c === letter) state.revealedLetters[i] = letter; });
                state.score += 10 + (state.streak * 5);
                state.streak += 1;
                state.timeLeft += 2;
                if (!state.revealedLetters.includes('')) state.status = 'victory';
            } else {
                if (kIdx !== -1) state.keyboard[kIdx].status = 'wrong';
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