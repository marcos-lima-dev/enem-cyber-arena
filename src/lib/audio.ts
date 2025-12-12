// Define os tipos de sons disponíveis
export type SoundType = 'hit' | 'miss' | 'win' | 'gameover' | 'hover';

// Mapeia o nome para o caminho do arquivo
const SOUNDS: Record<SoundType, string> = {
  hit: '/sfx/hit.mp3',
  miss: '/sfx/miss.mp3',
  win: '/sfx/win.mp3',
  gameover: '/sfx/gameover.mp3',
  // 👇 AQUI ESTÁ A MUDANÇA: Apontando para o arquivo que já existe
  hover: '/sfx/cyber.mp3', 
};

// Cache para não recriar o objeto de áudio toda vez
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

// Agora aceita um volume opcional (padrão 0.5)
export const playSFX = (type: SoundType, volume = 0.5) => {
  if (typeof window === 'undefined') return;

  try {
    if (!audioCache[type]) {
      const audio = new Audio(SOUNDS[type]);
      audioCache[type] = audio;
    }

    const audio = audioCache[type];
    
    if (audio) {
      audio.volume = volume; // Aplica o volume pedido
      audio.currentTime = 0; 
      audio.play().catch((e) => {
        // Ignora erros de autoplay bloqueado
      });
    }
  } catch (error) {
    console.error("Erro ao tocar SFX:", error);
  }
};