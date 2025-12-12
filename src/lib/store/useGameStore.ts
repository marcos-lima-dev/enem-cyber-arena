import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import questionsData from '@/data/questions.json';
import { playSFX } from '@/lib/audio';

// --- TIPOS ---
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';
export type FilterMode = 'MIX' | 'HUM' | 'NAT' | 'LIN';

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

export type HighScore = {
  id: string;
  date: string;
  score: number;
  mode: FilterMode;
};

type GameState = {
  score: number;
  timeLeft: number;
  streak: number;
  status: GameStatus;
  filterMode: FilterMode;
  
  powerups: {
    reveal: number;
    trash: number;
  };
  
  highScores: HighScore[];

  currentQuestion: Question | null;
  revealedLetters: string[];
  keyboard: KeyboardKey[];
};

type GameActions = {
  startGame: () => void;
  nextLevel: () => void; // 👈 1. AÇÃO NOVA ADICIONADA AQUI
  setFilterMode: (mode: FilterMode) => void;
  tickTimer: () => void;
  submitGuess: (letter: string) => void;
  useRevealPowerup: () => void;
  useTrashPowerup: () => void;
  resetGame: () => void;
};

// --- MAPA DE CATEGORIAS ---
const CATEGORY_MAP: Record<string, string[]> = {
  'HUM': ['HIST', 'GEO', 'FILO', 'SOC'],
  'NAT': ['MAT', 'FIS', 'QUIM', 'BIO'],
  'LIN': ['LIN', 'LIT', 'ING', 'ESP', 'ART', 'EDF']
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        score: 0,
        timeLeft: 60,
        streak: 0,
        status: 'idle',
        filterMode: 'MIX',
        powerups: { reveal: 3, trash: 3 },
        highScores: [],
        currentQuestion: null,
        revealedLetters: [],
        keyboard: [],

        setFilterMode: (mode) => {
          set((state) => { state.filterMode = mode; });
        },

        // INICIAR DO ZERO (Reseta tudo)
        startGame: () => {
          set((state) => {
            state.status = 'playing';
            state.score = 0;
            state.timeLeft = 60;
            state.streak = 0;
            state.powerups = { reveal: 3, trash: 3 };
            
            // Sorteio
            let pool = questionsData;
            if (state.filterMode !== 'MIX') {
              const allowedTags = CATEGORY_MAP[state.filterMode];
              const filtered = questionsData.filter(q => allowedTags.includes(q.discipline));
              if (filtered.length > 0) pool = filtered;
            }
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selectedQuestion = pool[randomIndex];

            const newQuestion: Question = {
              id: selectedQuestion.id,
              discipline: selectedQuestion.discipline,
              topic: selectedQuestion.topic,
              hint: selectedQuestion.hint,
              answer: selectedQuestion.answer.toUpperCase()
            };

            state.currentQuestion = newQuestion;
            state.revealedLetters = Array(newQuestion.answer.length).fill('');

            // Teclado
            const answerChars = newQuestion.answer.split('');
            const distractors = ['X', 'A', 'B', 'Z', 'M', 'R', 'S', 'T', 'L', 'C', 'V', 'P', 'E', 'O'];
            const uniquePool = Array.from(new Set([...answerChars, ...distractors])).slice(0, 15);
            const shuffledKeys = uniquePool.sort(() => Math.random() - 0.5);
            state.keyboard = shuffledKeys.map(char => ({ char, status: 'idle' }));
          });
        },

        // PRÓXIMO NÍVEL (Mantém Score e Streak) 👈 2. IMPLEMENTAÇÃO DA NOVA AÇÃO
        nextLevel: () => {
          set((state) => {
            state.status = 'playing';
            state.timeLeft = 60; // Renova o tempo
            // Nota: NÃO resetamos score, streak ou powerups aqui!

            // Sorteio de nova questão
            let pool = questionsData;
            if (state.filterMode !== 'MIX') {
              const allowedTags = CATEGORY_MAP[state.filterMode];
              const filtered = questionsData.filter(q => allowedTags.includes(q.discipline));
              if (filtered.length > 0) pool = filtered;
            }
            const randomIndex = Math.floor(Math.random() * pool.length);
            const selectedQuestion = pool[randomIndex];

            const newQuestion: Question = {
              id: selectedQuestion.id,
              discipline: selectedQuestion.discipline,
              topic: selectedQuestion.topic,
              hint: selectedQuestion.hint,
              answer: selectedQuestion.answer.toUpperCase()
            };

            state.currentQuestion = newQuestion;
            state.revealedLetters = Array(newQuestion.answer.length).fill('');

            // Novo Teclado
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
              // GAME OVER POR TEMPO
              state.status = 'gameover';
              playSFX('gameover');
              
              if (state.score > 0) {
                  const newEntry: HighScore = {
                      id: crypto.randomUUID(),
                      date: new Date().toISOString(),
                      score: state.score,
                      mode: state.filterMode
                  };
                  state.highScores.push(newEntry);
                  state.highScores.sort((a, b) => b.score - a.score);
                  state.highScores = state.highScores.slice(0, 10);
              }
            }
          });
        },

        useRevealPowerup: () => {
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
              playSFX('hit');

              if (!state.revealedLetters.includes('')) {
                 state.status = 'victory';
                 playSFX('win');
              }
           });
        },

        useTrashPowerup: () => {
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
          set((state) => {
              if (state.status !== 'playing' || !state.currentQuestion) return;
              const ans = state.currentQuestion.answer;
              const kIdx = state.keyboard.findIndex(k => k.char === letter);
              if (kIdx !== -1 && state.keyboard[kIdx].status === 'disabled') return;

              if (ans.includes(letter)) {
                  // ACERTO
                  if (kIdx !== -1) state.keyboard[kIdx].status = 'correct';
                  ans.split('').forEach((c, i) => { if (c === letter) state.revealedLetters[i] = letter; });
                  
                  state.score += 10 + (state.streak * 5);
                  state.streak += 1;
                  state.timeLeft += 2;
                  
                  playSFX('hit');

                  if (!state.revealedLetters.includes('')) {
                      state.status = 'victory';
                      playSFX('win');
                  }
              } else {
                  // ERRO
                  if (kIdx !== -1) state.keyboard[kIdx].status = 'wrong';
                  state.streak = 0;
                  state.timeLeft -= 5;
                  
                  // Verifica se morreu por erro (tempo zerou com a penalidade)
                  if (state.timeLeft <= 0) {
                      state.timeLeft = 0;
                      state.status = 'gameover';
                      playSFX('gameover');

                      // Salva score se morreu aqui também
                      if (state.score > 0) {
                        const newEntry: HighScore = {
                            id: crypto.randomUUID(),
                            date: new Date().toISOString(),
                            score: state.score,
                            mode: state.filterMode
                        };
                        state.highScores.push(newEntry);
                        state.highScores.sort((a, b) => b.score - a.score);
                        state.highScores = state.highScores.slice(0, 10);
                      }
                  } else {
                      playSFX('miss');
                  }
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
      })),
      {
        name: 'cyber-arena-storage',
        partialize: (state) => ({ 
           highScores: state.highScores 
        }),
      }
    )
  )
);