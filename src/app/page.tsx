"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bolt, History, AlertTriangle, RefreshCcw, Search, Trash2 } from "lucide-react"; // Novos ícones
import { cn } from "@/lib/utils";

export default function GameArena() {
  const { 
    timeLeft, 
    score, 
    status, 
    powerups, // 👈 Novo
    currentQuestion, 
    revealedLetters, 
    keyboard,
    startGame, 
    tickTimer, 
    submitGuess,
    useRevealPowerup, // 👈 Novo
    useTrashPowerup   // 👈 Novo
  } = useGameStore();

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  const isClutch = timeLeft < 10;
  const progressValue = (timeLeft / 60) * 100;

  return (
    <main className="relative flex flex-col h-screen p-4 overflow-hidden max-w-md mx-auto">
      
      {/* BACKGROUND FX */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500 z-0",
          isClutch ? "opacity-100 bg-[radial-gradient(circle,transparent_40%,rgba(255,51,0,0.3)_100%)] animate-pulse-fast" : "opacity-0"
        )} 
      />

      {/* HEADER */}
      <header className="flex justify-between items-end mb-4 z-10 pt-2">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-3 py-1 text-xs md:text-sm font-bold tracking-widest w-fit">
            <History className="mr-2 h-3 w-3" /> 
            {currentQuestion?.discipline || "..."}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">SCORE: {score}</span>
        </div>
        
        <div className="w-1/2 flex flex-col items-end gap-1">
           <div className="flex items-center gap-2">
             {isClutch && <AlertTriangle className="h-4 w-4 text-destructive animate-bounce" />}
             <span className={cn(
               "font-mono font-bold text-xl", 
               isClutch ? "text-destructive text-glitch" : "text-white"
             )}>
               {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
             </span>
           </div>
           <div className="w-full h-2 bg-gray-900 rounded-sm border border-gray-800 overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_currentColor]", isClutch ? "bg-destructive text-destructive" : "bg-primary text-primary")}
                style={{ width: `${progressValue}%` }}
              />
           </div>
        </div>
      </header>

      {/* GAME OVER / VICTORY OVERLAYS (Mesmo de antes...) */}
      {status === 'gameover' && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-8 text-center">
          <h1 className="text-4xl font-black text-destructive text-glitch mb-2">FALHA NO SISTEMA</h1>
          <p className="text-gray-400 mb-8">A resposta era: <span className="text-white font-bold">{currentQuestion?.answer}</span></p>
          <Button onClick={startGame} size="lg" className="bg-white text-black hover:bg-gray-200 font-bold w-full">
            <RefreshCcw className="mr-2 h-5 w-5" /> REINICIAR
          </Button>
        </div>
      )}

      {status === 'victory' && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-8 text-center">
          <h1 className="text-4xl font-black text-primary text-glitch mb-2">QUESTÃO HACKEADA!</h1>
          <p className="text-gray-400 mb-8">Score Final: {score}</p>
          <Button onClick={startGame} size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold shadow-neon-lime w-full">
            PRÓXIMO NÍVEL
          </Button>
        </div>
      )}

      {/* STAGE */}
      <div className="flex-1 flex flex-col items-center z-10 justify-center">
        <Card className="glass-panel w-full mb-6 animate-accordion-down border-white/5">
          <CardContent className="p-4 flex flex-col gap-1">
             <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Contexto</span>
             <p className="text-foreground font-medium text-base leading-snug">
               {currentQuestion?.hint}
             </p>
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
               {char === '' && revealedLetters.findIndex(l => l === '') === index && (
                 <span className="w-4 h-1 bg-primary/50 animate-pulse absolute bottom-3"/>
               )}
             </div>
           ))}
        </div>
      </div>

      {/* KEYPAD & POWERUPS */}
      <div className="z-10 mt-auto flex flex-col gap-3 pb-2">
        
        {/* Grid de Teclas */}
        <div className="grid grid-cols-5 gap-1.5 justify-items-center">
           {keyboard.map((keyObj, idx) => (
             <button
               key={`${keyObj.char}-${idx}`}
               disabled={keyObj.status !== 'idle' || status !== 'playing'}
               onClick={() => submitGuess(keyObj.char)}
               className={cn(
                 "w-full aspect-square rounded-xl font-bold text-xl transition-all duration-100 flex items-center justify-center border-b-4 relative overflow-hidden",
                 keyObj.status === 'idle' && "bg-gray-800 border-gray-950 text-white hover:bg-gray-700 active:border-b-0 active:translate-y-1",
                 keyObj.status === 'correct' && "bg-primary border-primary/50 text-black opacity-50",
                 keyObj.status === 'wrong' && "bg-destructive border-destructive/50 text-white opacity-40",
                 keyObj.status === 'disabled' && "bg-transparent border-transparent text-gray-800 opacity-20 cursor-default", // Estilo da Lixeira
                 status !== 'playing' && "opacity-50"
               )}
             >
               {keyObj.char}
             </button>
           ))}
        </div>

        {/* Barra de Ações (Botão Principal + Powerups) */}
        <div className="flex gap-2 h-14">
            {/* Power Up: Lixeira */}
            <Button 
                variant="outline" 
                className="h-full w-16 border-gray-700 bg-gray-800/50 flex flex-col gap-0 p-0 hover:bg-gray-700 hover:text-white"
                onClick={useTrashPowerup}
                disabled={powerups.trash === 0 || status !== 'playing'}
            >
                <Trash2 className={cn("h-5 w-5", powerups.trash > 0 ? "text-destructive" : "text-gray-600")} />
                <span className="text-[10px] font-bold">{powerups.trash}</span>
            </Button>

            {/* Botão de Chutar / Pular (Por enquanto só visual ou Restart) */}
            <Button 
                className="flex-1 h-full text-lg font-black italic tracking-widest uppercase shadow-neon-lime animate-pulse-fast bg-primary text-black hover:bg-primary/90"
                onClick={() => {}} // Futuramente: Pular Questão
            >
                <Bolt className="mr-2 h-5 w-5" /> RESPONDER
            </Button>

            {/* Power Up: Lupa */}
            <Button 
                variant="outline" 
                className="h-full w-16 border-gray-700 bg-gray-800/50 flex flex-col gap-0 p-0 hover:bg-gray-700 hover:text-white"
                onClick={useRevealPowerup}
                disabled={powerups.reveal === 0 || status !== 'playing'}
            >
                <Search className={cn("h-5 w-5", powerups.reveal > 0 ? "text-primary" : "text-gray-600")} />
                <span className="text-[10px] font-bold">{powerups.reveal}</span>
            </Button>
        </div>
      </div>

    </main>
  );
}