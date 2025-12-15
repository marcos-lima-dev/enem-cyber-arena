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

const MODE_INFO: Record<FilterMode, { label: string; icon: any; color: string }> = {
  'MIX': { label: 'GERAL', icon: Shuffle, color: 'text-primary' },
  'HUM': { label: 'HUMANAS', icon: Brain, color: 'text-neon-pink' },
  'NAT': { label: 'NATUREZA', icon: Dna, color: 'text-blue-400' },
  'LIN': { label: 'LINGUAGENS', icon: BookOpen, color: 'text-yellow-400' }
};

const DIFFICULTY_CONFIG = {
  'EASY':   { label: 'NVL 1', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10', icon: ShieldCheck },
  'MEDIUM': { label: 'NVL 2', color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10', icon: ShieldAlert },
  'HARD':   { label: 'NVL 3', color: 'text-destructive border-destructive/50 bg-destructive/10 animate-pulse', icon: Skull }
};

export default function GameArena() {
  const { 
    timeLeft, score, status, powerups, currentQuestion, revealedLetters, keyboard,
    filterMode, isReading, startGame, nextLevel, startRound, tickTimer, submitGuess,
    useRevealPowerup, useTrashPowerup, resetGame 
  } = useGameStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  if (status === 'idle') return <StartScreen />;

  const isClutch = timeLeft < 10;
  const activeMode = MODE_INFO[filterMode];
  const ModeIcon = activeMode.icon;
  const diffInfo = DIFFICULTY_CONFIG[currentQuestion?.difficulty || 'EASY'];
  const DiffIcon = diffInfo.icon;

  return (
    // 👇 MUDANÇA 1: h-[100dvh] para ignorar barras do navegador mobile
    <main className="relative flex flex-col h-[100dvh] overflow-hidden max-w-md mx-auto bg-black">
      
      {/* BACKGROUND FX */}
      <div className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500 z-0",
          isClutch ? "opacity-100 bg-[radial-gradient(circle,transparent_40%,rgba(255,51,0,0.2)_100%)] animate-pulse-fast" : "opacity-0"
        )} 
      />

      {/* --- HEADER (Teto Baixo - Fixed) --- */}
      {/* shrink-0 garante que o header nunca seja esmagado */}
      <header className="flex flex-col gap-1 p-2 z-10 shrink-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-sm">
        
        {/* Linha Topo */}
        <div className="flex items-center justify-between h-8">
            <Button variant="ghost" size="icon" onClick={resetGame} className="h-8 w-8 text-gray-400 hover:text-white -ml-2">
                <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 bg-gray-900/80 border border-white/10 px-3 py-0.5 rounded-full">
                <ModeIcon className={cn("h-3 w-3", activeMode.color)} />
                <span className={cn("text-[10px] font-black tracking-widest text-gray-300")}>
                    {activeMode.label}
                </span>
            </div>
            
            <div className="font-mono text-xs text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5 flex items-center gap-2">
                <span className="tracking-widest text-[9px]">PTS</span>
                <span className="text-white font-bold text-sm">{score.toString().padStart(4, '0')}</span>
             </div>
        </div>

        {/* Linha Info + Timer */}
        <div className="flex justify-between items-end pb-1">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-1.5 py-0 text-[9px] font-bold tracking-widest h-5 whitespace-nowrap">
                  <History className="mr-1 h-3 w-3" /> 
                  {currentQuestion?.discipline.substring(0,4) || "..."}
              </Badge>
              <Badge variant="outline" className={cn("px-1.5 py-0 text-[9px] font-bold tracking-widest h-5 flex items-center gap-1 whitespace-nowrap", diffInfo.color)}>
                  <DiffIcon className="h-3 w-3" />
                  {diffInfo.label}
              </Badge>
            </div>

            <div className="w-1/3 flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1.5">
                    {isReading ? <Lock className="h-3 w-3 text-gray-400" /> : isClutch && <AlertTriangle className="h-3 w-3 text-destructive animate-bounce" />}
                    <span className={cn("font-mono font-bold text-lg leading-none", isReading ? "text-gray-500" : (isClutch ? "text-destructive text-glitch" : "text-white"))}>
                        {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-900 rounded-full border border-gray-800 overflow-hidden">
                    <div 
                        className={cn("h-full transition-all duration-1000 ease-linear", isReading ? "bg-gray-600 w-full" : (isClutch ? "bg-destructive" : "bg-primary"))}
                        style={{ width: isReading ? '100%' : `${(timeLeft / (currentQuestion?.pointsValue === 300 ? 90 : (currentQuestion?.pointsValue === 150 ? 60 : 45))) * 100}%` }}
                    />
                </div>
            </div>
        </div>
      </header>

      {/* --- STAGE (Acordeão Flexível) --- */}
      {/* flex-1 + min-h-0: O segredo! Faz essa área ocupar o que sobrar e permite scroll interno */}
      <div className="flex-1 flex flex-col w-full min-h-0 px-2 relative">
        
        {/* CARD DE TEXTO: Flexível */}
        <div className={cn(
            "flex-1 flex flex-col w-full my-2 border border-white/5 bg-gray-900/40 backdrop-blur-md rounded-xl transition-all duration-500 overflow-hidden",
            isReading ? "border-primary/50 shadow-neon-lime bg-black/60" : ""
        )}>
           {/* Header do Card */}
           <div className="flex justify-between items-center p-3 pb-1 shrink-0">
                <span className={cn("text-[9px] uppercase font-bold tracking-widest", isReading ? "text-primary animate-pulse" : "text-muted-foreground")}>
                  {isReading ? ">> DATA STREAM..." : "CONTEXTO"}
                </span>
                <div className={cn("h-1 w-6 rounded-full", isReading ? "bg-primary" : "bg-white/10")} />
           </div>

           {/* Corpo do Texto com Scroll - Ocupa todo o resto do card */}
           <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
               <p className="text-gray-200 font-medium text-sm leading-relaxed text-justify">
                 {currentQuestion?.hint}
               </p>
           </div>
        </div>

        {/* SLOTS (Bloco Rígido mas compacto) */}
        <div className="shrink-0 flex flex-wrap justify-center gap-1.5 mb-2 min-h-[50px]">
           {revealedLetters.map((char, index) => (
             <div key={index}
               className={cn(
                 "w-9 h-12 md:w-11 md:h-14 rounded-md border-2 flex items-center justify-center text-xl md:text-2xl font-black transition-all",
                 char !== '' ? "bg-primary/10 border-primary text-primary shadow-neon-lime" : "bg-gray-900/50 border-white/10"
               )}
             >
               {char}
               {char === '' && revealedLetters.findIndex(l => l === '') === index && !isReading && (
                 <span className="w-3 h-0.5 bg-primary/50 animate-pulse absolute bottom-2"/>
               )}
             </div>
           ))}
        </div>

        {/* TELAS DE OVERLAY (Game Over / Victory) */}
        {(status === 'gameover' || status === 'victory') && (
            <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <h1 className={cn("text-3xl font-black mb-2 text-glitch", status === 'victory' ? "text-primary" : "text-destructive")}>
                    {status === 'victory' ? "HACKED!" : "SYSTEM FAILURE"}
                </h1>
                {status === 'gameover' && <p className="text-gray-400 mb-6 text-sm">Resposta: <span className="text-white font-bold">{currentQuestion?.answer}</span></p>}
                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                    {status === 'victory' ? (
                        <Button onClick={nextLevel} className="bg-primary text-black font-bold hover:bg-white w-full">PRÓXIMO</Button>
                    ) : (
                        <Button onClick={startGame} className="bg-white text-black font-bold hover:bg-gray-200 w-full">RETRY</Button>
                    )}
                    <Button onClick={resetGame} variant="ghost" className="text-gray-500 hover:text-white text-xs">MENU</Button>
                </div>
            </div>
        )}
      </div>

      {/* --- TECLADO (Base Intocável - Fixed Bottom) --- */}
      <div className="shrink-0 z-10 p-2 pt-0 pb-safe-area bg-gradient-to-t from-black via-black to-transparent">
        
        {/* Máscara de Leitura */}
        {isReading && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-[2px] flex items-center justify-center -mt-12 rounded-t-2xl border-t border-white/10">
                <Button onClick={startRound} size="lg" className="font-black text-lg tracking-widest shadow-neon-lime animate-pulse-fast bg-primary text-black hover:bg-white scale-110">
                    <Bolt className="mr-2 h-5 w-5 animate-spin-slow" /> INICIAR
                </Button>
            </div>
        )}

        {/* Grid de Teclas */}
        <div className={cn("grid grid-cols-5 gap-1 mb-2 transition-opacity", isReading && "opacity-10 blur-sm")}>
           {keyboard.map((keyObj, idx) => (
             <button key={`${keyObj.char}-${idx}`}
               disabled={keyObj.status !== 'idle' || status !== 'playing' || isReading}
               onClick={() => submitGuess(keyObj.char)}
               className={cn(
                 "h-11 md:h-12 rounded-lg font-bold text-lg md:text-xl flex items-center justify-center border-b-[3px] active:border-b-0 active:translate-y-[3px] transition-all",
                 keyObj.status === 'idle' ? "bg-gray-800 border-gray-950 text-white hover:bg-gray-700" :
                 keyObj.status === 'correct' ? "bg-primary border-primary/50 text-black/50" :
                 keyObj.status === 'wrong' ? "bg-destructive border-destructive/50 text-white/30" :
                 "bg-transparent border-transparent text-gray-800"
               )}
             >
               {keyObj.char}
             </button>
           ))}
        </div>

        {/* Powerups */}
        <div className={cn("flex gap-2 h-10 md:h-12", isReading && "opacity-10 blur-sm")}>
            <Button variant="outline" className="h-full flex-1 border-gray-800 bg-gray-900/50 hover:bg-gray-800" onClick={useTrashPowerup} disabled={powerups.trash === 0 || status !== 'playing' || isReading}>
                <Trash2 className={cn("h-4 w-4 mr-1", powerups.trash > 0 ? "text-destructive" : "text-gray-600")} />
                <span className="text-xs font-bold">{powerups.trash}</span>
            </Button>
            <Button className="h-full flex-[2] bg-primary text-black font-black italic tracking-widest disabled:opacity-50" disabled>
                ENEM.OS
            </Button>
            <Button variant="outline" className="h-full flex-1 border-gray-800 bg-gray-900/50 hover:bg-gray-800" onClick={useRevealPowerup} disabled={powerups.reveal === 0 || status !== 'playing' || isReading}>
                <Search className={cn("h-4 w-4 mr-1", powerups.reveal > 0 ? "text-primary" : "text-gray-600")} />
                <span className="text-xs font-bold">{powerups.reveal}</span>
            </Button>
        </div>
      </div>
    </main>
  );
}