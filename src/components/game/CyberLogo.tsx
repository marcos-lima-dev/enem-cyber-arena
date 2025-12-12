import { cn } from "@/lib/utils";

export function CyberLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-20 h-20", className)} // Tamanho padrão w-20, mas aceita customização
    >
      {/* Base Hexagonal */}
      <path 
        d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5 Z" 
        className="stroke-primary fill-primary/10" 
        strokeWidth="2"
      />
      
      {/* Letra C (Estilizada) */}
      <path 
        d="M65 35 H45 L35 45 V65 L45 75 H65" 
        className="stroke-white" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Detalhe Glitch (Letra A implícita/Raio) */}
      <path 
        d="M65 45 L45 65" 
        className="stroke-destructive animate-pulse" 
        strokeWidth="3"
      />
      
      {/* Circuitos decorativos */}
      <circle cx="20" cy="55" r="2" className="fill-primary animate-ping" />
      <circle cx="80" cy="55" r="2" className="fill-primary animate-ping" style={{ animationDelay: '0.5s'}} />
    </svg>
  );
}