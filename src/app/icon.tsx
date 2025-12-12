import { ImageResponse } from 'next/og'

// Configurações da Imagem (Tamanho padrão de favicon)
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Geração do Ícone
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent', // Fundo transparente
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Nosso Hexágono em SVG simplificado para 32x32 */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Hexagonal (Cor: #13ec80 - Neon Lime) */}
          <path
            d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5 Z"
            fill="rgba(19, 236, 128, 0.2)" 
            stroke="#13ec80"
            strokeWidth="8"
          />
          
          {/* Letra C (Branca) */}
          <path
            d="M65 35 H45 L35 45 V65 L45 75 H65"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}