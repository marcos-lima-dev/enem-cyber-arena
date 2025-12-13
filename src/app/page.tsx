"use client";

import { useEffect } from "react";
import { useGameStore, FilterMode } from "@/lib/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bolt, History, AlertTriangle, RefreshCcw, Search, Trash2, 
  ArrowLeft, Brain, Dna, BookOpen, Shuffle, Lock,
  ShieldCheck, ShieldAlert, Skull
} from "lucide-react"; 
import { cn } from "@/lib/utils";
import { StartScreen } from "@/components/game/StartScreen";

// Configuração Visual dos Modos
const MODE_INFO: Record<FilterMode, { label: string; icon: any; color: string }> = {
  'MIX': { label: 'ARENA GERAL', icon: Shuffle, color: 'text-primary' },
  'HUM': { label: 'HUMANAS', icon: Brain, color: 'text-neon-pink' },
  'NAT': { label: 'NATUREZA', icon: Dna, color: 'text-blue-400' },
  'LIN': { label: 'LINGUAGENS', icon: BookOpen, color: 'text-yellow-400' }
};

// Configuração Visual da Dificuldade
const DIFFICULTY_CONFIG = {
  'EASY':   { label: 'NVL 1 • ACESSO FÁCIL', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10', icon: ShieldCheck },
  'MEDIUM': { label: 'NVL 2 • SEGURANÇA MÉDIA', color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10', icon: ShieldAlert },
  'HARD':   { label: 'NVL 3 • SISTEMA CRÍTICO', color: 'text-destructive border-destructive/50 bg-destructive/10 animate-pulse', icon: Skull }
};

export default function GameArena() {
  const { 
    timeLeft, 
    score, 
    status, 
    powerups,
    currentQuestion, 
    revealedLetters, 
    keyboard,
    filterMode,
    isReading, 
    startGame,
    nextLevel, 
    startRound, 
    tickTimer, 
    submitGuess,
    useRevealPowerup, 
    useTrashPowerup,
    resetGame 
  } = useGameStore();

  // Relógio do Jogo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  if (status === 'idle') {
    return <StartScreen />;
  }

  const isClutch = timeLeft < 10;
  
  const activeMode = MODE_INFO[filterMode];
  const ModeIcon = activeMode.icon;

  // Pega a info da dificuldade (ou Easy como padrão)
  const diffInfo = DIFFICULTY_CONFIG[currentQuestion?.difficulty || 'EASY'];
  const DiffIcon = diffInfo.icon;

  return (
    <main className="relative flex flex-col h-screen p-4 overflow-hidden max-w-md mx-auto">
      
      {/* BACKGROUND FX */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500 z-0",
          isClutch ? "opacity-100 bg-[radial-gradient(circle,transparent_40%,rgba(255,51,0,0.3)_100%)] animate-pulse-fast" : "opacity-0"
        )} 
      />

      {/* HEADER TÁTICO */}
      <header className="flex flex-col gap-2 mb-4 z-10 pt-2">
        
        {/* Linha 1: Navegação, Modo e Score */}
        <div className="flex items-center justify-between">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={resetGame}
                className="text-gray-400 hover:text-white hover:bg-white/10 -ml-2"
            >
                <ArrowLeft className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-2 bg-gray-900/80 border border-white/10 px-3 py-1 rounded-full">
                <ModeIcon className={cn("h-4 w-4", activeMode.color)} />
                <span className={cn("text-[10px] font-black tracking-widest text-gray-300")}>
                    {activeMode.label}
                </span>
            </div>
            
            <div className="font-mono text-xs text-gray-400 bg-black/40 px-3 py-1 rounded border border-white/5 flex items-center gap-2">
                <span className="tracking-widest text-[10px]">SCORE</span>
                <span className="text-white font-bold text-base">
                  {score.toString().padStart(4, '0')}
                </span>
             </div>
        </div>

        {/* Linha 2: Badges de Info e Timer */}
        <div className="flex justify-between items-end">
            
            {/* Esquerda: Badges Alinhados Horizontalmente */}
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-2 py-0.5 text-[10px] md:text-xs font-bold tracking-widest w-fit whitespace-nowrap">
                  <History className="mr-1.5 h-3 w-3" /> 
                  {currentQuestion?.discipline || "..."}
              </Badge>
              
              <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] md:text-xs font-bold tracking-widest w-fit flex items-center gap-1 whitespace-nowrap", diffInfo.color)}>
                  <DiffIcon className="h-3 w-3" />
                  {diffInfo.label}
              </Badge>
            </div>

            {/* Direita: Timer e Barra de Progresso */}
            <div className="w-1/2 flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    {isReading ? (
                        <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                        isClutch && <AlertTriangle className="h-4 w-4 text-destructive animate-bounce" />
                    )}
                    
                    <span className={cn(
                        "font-mono font-bold text-xl", 
                        isReading ? "text-gray-500" : (isClutch ? "text-destructive text-glitch" : "text-white")
                    )}>
                        {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                    </span>
                </div>
                
                {/* Barra de Progresso */}
                <div className="w-full h-2 bg-gray-900 rounded-sm border border-gray-800 overflow-hidden">
                    <div 
                        className={cn(
                          "h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor]", 
                          isReading ? "bg-gray-600 w-full" : (isClutch ? "bg-destructive text-destructive" : "bg-primary text-primary")
                        )}
                        style={{ width: isReading ? '100%' : `${(timeLeft / (currentQuestion?.pointsValue === 300 ? 90 : (currentQuestion?.pointsValue === 150 ? 60 : 45))) * 100}%` }}
                    />
                </div>
            </div>
        </div>
      </header>

      {/* --- TELAS DE FIM DE JOGO --- */}
      {status === 'gameover' && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-8 text-center">
          <h1 className="text-4xl font-black text-destructive text-glitch mb-2">FALHA NO SISTEMA</h1>
          <p className="text-gray-400 mb-8">A resposta era: <span className="text-white font-bold">{currentQuestion?.answer}</span></p>
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={startGame} size="lg" className="bg-white text-black hover:bg-gray-200 font-bold w-full">
                <RefreshCcw className="mr-2 h-5 w-5" /> TENTAR NOVAMENTE
            </Button>
            <Button onClick={resetGame} variant="outline" className="border-gray-700 text-gray-400 hover:text-white w-full">
                ABORTAR MISSÃO
            </Button>
          </div>
        </div>
      )}

      {status === 'victory' && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-8 text-center">
          <h1 className="text-4xl font-black text-primary text-glitch mb-2">QUESTÃO HACKEADA!</h1>
          <p className="text-gray-400 mb-8">Score Atual: <span className="text-white font-bold">{score}</span></p>
          <Button onClick={nextLevel} size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold shadow-neon-lime w-full">
            PRÓXIMO NÍVEL
          </Button>
        </div>
      )}

      {/* --- STAGE (Dica e Slots) --- */}
      <div className="flex-1 flex flex-col items-center z-10 justify-center w-full">
        
        <Card className={cn(
            "glass-panel w-full mb-4 border-white/5 bg-black/40 backdrop-blur-md transition-all duration-500",
            isReading ? "border-primary/50 shadow-neon-lime" : ""
        )}>
          <CardContent className="p-4">
             <div className="flex justify-between items-center mb-2">
                <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest transition-colors",
                    isReading ? "text-primary animate-pulse" : "text-muted-foreground"
                )}>
                  {isReading ? ">> ANALISANDO DADOS..." : "Contexto da Questão"}
                </span>
                <div className="h-1 w-8 bg-white/10 rounded-full" />
             </div>
             
             <div className="h-[120px] overflow-y-auto pr-2 custom-scrollbar">
               <p className="text-foreground font-medium text-sm md:text-base leading-relaxed text-justify">
                 {currentQuestion?.hint}
               </p>
             </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
           {revealedLetters.map((char, index) => (
             <div 
               key={index}
               className={cn(
                 "w-11 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-black transition-all duration-300",
                 char !== '' 
                   ? "bg-primary/10 border-primary text-primary shadow-neon-lime scale-100 rotate-0" 
                   : "bg-gray-900/50 border-white/10 text-transparent scale-95"
               )}
             >
               {char}
               {char === '' && revealedLetters.findIndex(l => l === '') === index && !isReading && (
                 <span className="w-4 h-1 bg-primary/50 animate-pulse absolute bottom-3"/>
               )}
             </div>
           ))}
        </div>
      </div>

      {/* --- KEYPAD & POWERUPS --- */}
      <div className="z-10 mt-auto flex flex-col gap-3 pb-2 relative">
        
        {isReading && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center animate-in fade-in zoom-in duration-300">
                <Button 
                    onClick={startRound}
                    size="xl"
                    className="font-black text-lg tracking-widest shadow-neon-lime animate-pulse-fast bg-primary text-black hover:bg-white hover:scale-105 transition-all skew-x-[-6deg]"
                >
                    <Bolt className="mr-2 h-6 w-6 animate-spin-slow" />
                    INICIAR HACK
                </Button>
            </div>
        )}

        <div className={cn("grid grid-cols-5 gap-1.5 justify-items-center transition-all duration-500", isReading && "opacity-20 blur-sm")}>
           {keyboard.map((keyObj, idx) => (
             <button
               key={`${keyObj.char}-${idx}`}
               disabled={keyObj.status !== 'idle' || status !== 'playing' || isReading}
               onClick={() => submitGuess(keyObj.char)}
               className={cn(
                 "w-full aspect-square rounded-xl font-bold text-xl transition-all duration-100 flex items-center justify-center border-b-4 relative overflow-hidden",
                 keyObj.status === 'idle' && "bg-gray-800 border-gray-950 text-white hover:bg-gray-700 active:border-b-0 active:translate-y-1",
                 keyObj.status === 'correct' && "bg-primary border-primary/50 text-black opacity-50",
                 keyObj.status === 'wrong' && "bg-destructive border-destructive/50 text-white opacity-40",
                 keyObj.status === 'disabled' && "bg-transparent border-transparent text-gray-800 opacity-20 cursor-default",
                 status !== 'playing' && "opacity-50"
               )}
             >
               {keyObj.char}
             </button>
           ))}
        </div>

        <div className={cn("flex gap-2 h-14 transition-all duration-500", isReading && "opacity-20 blur-sm")}>
            <Button 
                variant="outline" 
                className="h-full w-16 border-gray-700 bg-gray-800/50 flex flex-col gap-0 p-0 hover:bg-gray-700 hover:text-white"
                onClick={useTrashPowerup}
                disabled={powerups.trash === 0 || status !== 'playing' || isReading}
            >
                <Trash2 className={cn("h-5 w-5", powerups.trash > 0 ? "text-destructive" : "text-gray-600")} />
                <span className="text-[10px] font-bold">{powerups.trash}</span>
            </Button>

            <Button 
                className="flex-1 h-full text-lg font-black italic tracking-widest uppercase shadow-neon-lime animate-pulse-fast bg-primary text-black hover:bg-primary/90 disabled:opacity-50"
                onClick={() => {}} 
                disabled={isReading}
            >
                <Bolt className="mr-2 h-5 w-5" /> RESPONDER
            </Button>

            <Button 
                variant="outline" 
                className="h-full w-16 border-gray-700 bg-gray-800/50 flex flex-col gap-0 p-0 hover:bg-gray-700 hover:text-white"
                onClick={useRevealPowerup}
                disabled={powerups.reveal === 0 || status !== 'playing' || isReading}
            >
                <Search className={cn("h-5 w-5", powerups.reveal > 0 ? "text-primary" : "text-gray-600")} />
                <span className="text-[10px] font-bold">{powerups.reveal}</span>
            </Button>
        </div>
      </div>
    </main>
  );
}