"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown } from "lucide-react";
import { useGameStore, HighScore } from "@/lib/store/useGameStore";
import { cn } from "@/lib/utils";

// Função para calcular a patente baseada no score
const getRankTitle = (score: number) => {
  if (score >= 3000) return { title: "CYBER LORD", color: "text-neon-pink", icon: Crown };
  if (score >= 1500) return { title: "NETRUNNER", color: "text-primary", icon: Medal };
  if (score >= 500) return { title: "RUNNER", color: "text-blue-400", icon: Trophy };
  return { title: "TRAINEE", color: "text-gray-500", icon: null };
};

export function RankingDialog() {
  const { highScores } = useGameStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white text-xs w-full">
            <Trophy className="mr-2 h-3 w-3 text-accent" /> RANKING
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/95 border-primary/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-widest text-center text-glitch">
            HALL OF LEGENDS
          </DialogTitle>
        </DialogHeader>

        {/* Tabela estilo Terminal */}
        <div className="border border-white/10 rounded-md overflow-hidden bg-gray-900/50 mt-4">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[50px] text-gray-400 font-mono text-[10px]">#</TableHead>
                <TableHead className="text-gray-400 font-mono text-[10px]">PATENTE</TableHead>
                <TableHead className="text-right text-gray-400 font-mono text-[10px]">SCORE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highScores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24 text-gray-500 font-mono text-xs">
                    NENHUM DADO ENCONTRADO.<br/>JOGUE PARA ENTRAR NA HISTÓRIA.
                  </TableCell>
                </TableRow>
              ) : (
                highScores.map((entry, index) => {
                  const { title, color, icon: Icon } = getRankTitle(entry.score);
                  return (
                    <TableRow key={entry.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-gray-500 font-bold">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className={cn("h-3 w-3", color)} />}
                          <div className="flex flex-col">
                            <span className={cn("text-xs font-bold tracking-wider", color)}>
                              {title}
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono">
                               {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-primary font-bold text-lg">
                        {entry.score}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600 font-mono">LOCAL DATABASE • {highScores.length} RECORDS</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}