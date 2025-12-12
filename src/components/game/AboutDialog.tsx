"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skull, Github, Linkedin, ExternalLink, Code2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:text-white text-xs w-full"
        >
            <Skull className="mr-2 h-3 w-3 text-destructive" /> SOBRE
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-black/95 border-destructive/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-widest text-center text-glitch flex items-center justify-center gap-2">
            <Skull className="h-6 w-6 text-destructive" />
            FICHA TÉCNICA
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 font-mono text-[10px] tracking-widest uppercase">
            Protocolo v.2025 • Acesso Autorizado
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-2">
            
            {/* SOBRE O PROJETO */}
            <div className="space-y-2 border-l-2 border-primary/50 pl-4">
                <h3 className="text-primary font-bold text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" /> A MISSÃO
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                    O <span className="text-white font-bold">ENEM CYBER-ARENA</span> é uma iniciativa para gamificar a revisão do vestibular. 
                    <br/><br/>
                    Diferente de simulados monótonos, aqui <span className="text-destructive font-bold">o tempo é sua vida</span>. 
                    Treine reflexos, vocabulário e gestão de crise enquanto revisa conceitos reais do banco de dados do ENEM.
                </p>
            </div>

            {/* SOBRE O DEV */}
            <div className="space-y-3 border-l-2 border-neon-pink pl-4">
                <h3 className="text-neon-pink font-bold text-sm flex items-center gap-2">
                    <Code2 className="h-4 w-4" /> O DESENVOLVEDOR
                </h3>
                <p className="text-gray-300 text-sm">
                    Desenvolvido por <strong className="text-white">Marcos de Sousa Lima</strong>.
                    Focado em criar experiências digitais que misturam educação, tecnologia e design de alto impacto.
                </p>

                {/* BOTÕES SOCIAIS */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <Button variant="outline" className="border-gray-700 hover:bg-blue-900/30 hover:text-blue-400 hover:border-blue-500 transition-all group" asChild>
                        <a href="https://www.linkedin.com/in/marcos-de-sousa-lima-1a6a6320/" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> LinkedIn
                        </a>
                    </Button>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800 hover:text-white hover:border-white transition-all group" asChild>
                        <a href="https://github.com/marcos-lima-dev/enem-cyber-arena" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> GitHub
                        </a>
                    </Button>
                </div>
            </div>

            {/* RODAPÉ TÉCNICO */}
            <div className="bg-gray-900/50 p-3 rounded border border-white/5 text-[10px] text-gray-500 font-mono text-center">
                STACK: NEXT.JS 14 • TAILWIND • ZUSTAND • SHADCN
                <br />
                BUILD ID: {new Date().toLocaleDateString().replace(/\//g, '')}.BETA
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}