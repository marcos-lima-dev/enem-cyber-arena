"use client";

import { Button } from "@/components/ui/button";
import { GlitchTitle } from "./GlitchTitle";
import { Play, Trophy, Skull, Brain, Dna, BookOpen, Shuffle } from "lucide-react";
import { useGameStore, FilterMode } from "@/lib/store/useGameStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Opções de Jogo
const MODES: { id: FilterMode; label: string; icon: any; color: string }[] = [
  { id: 'MIX', label: 'ARENA GERAL', icon: Shuffle, color: "text-primary" },
  { id: 'HUM', label: 'HUMANAS', icon: Brain, color: "text-neon-pink" }, // Usando classes de cor ou hex direto se precisar
  { id: 'NAT', label: 'NATUREZA', icon: Dna, color: "text-blue-400" },
  { id: 'LIN', label: 'LINGUAGENS', icon: BookOpen, color: "text-yellow-400" },
];

export function StartScreen() {
  const { startGame, filterMode, setFilterMode } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative z-20 gap-6 p-4">
      
      {/* Decoração de Fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* LOGO */}
      <div className="flex flex-col items-center text-center gap-2 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 justify-center mb-2">
             <span className="bg-primary text-black text-xs font-bold px-2 py-0.5 rounded-sm">V.2025</span>
          </div>
          <GlitchTitle text="CYBER" className="text-white" />
          <GlitchTitle text="ARENA" className="text-primary mt-[-10px]" />
        </motion.div>
      </div>

      {/* SELETOR DE ÁREA (GRID) */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="w-full max-w-xs"
      >
        <p className="text-[10px] text-gray-500 font-mono tracking-widest text-center mb-3">SELECIONE O PROTOCOLO:</p>
        
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((mode) => {
            const isSelected = filterMode === mode.id;
            const Icon = mode.icon;
            
            return (
              <button
                key={mode.id}
                onClick={() => setFilterMode(mode.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                  isSelected 
                    ? "bg-gray-800 border-primary shadow-neon-lime scale-105" 
                    : "bg-black/40 border-gray-800 hover:border-gray-600 hover:bg-gray-900 text-gray-400"
                )}
              >
                <Icon className={cn("h-6 w-6", isSelected ? mode.color : "text-gray-500")} />
                <span className={cn("text-[10px] font-black tracking-widest", isSelected ? "text-white" : "text-gray-500")}>
                  {mode.label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* BOTÃO START */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-4 w-full max-w-xs z-10"
      >
        <Button 
          onClick={startGame} 
          size="xl" 
          className="h-16 text-xl font-black italic tracking-widest uppercase bg-primary text-black hover:bg-primary/90 shadow-neon-lime group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          <Play className="mr-3 h-6 w-6 fill-black" /> INICIAR
        </Button>

        <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white text-xs">
                <Trophy className="mr-2 h-3 w-3 text-accent" /> RANKING
            </Button>
            <Button variant="outline" className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white text-xs">
                <Skull className="mr-2 h-3 w-3 text-destructive" /> SOBRE
            </Button>
        </div>
      </motion.div>
    </div>
  );
}