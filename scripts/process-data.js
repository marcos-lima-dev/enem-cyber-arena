const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES DO GARIMPO ---
const MAX_CHARS = 18; // Máximo de letras (senão quebra a tela do celular)
const MAX_WORDS = 2;  // Máximo de palavras (ex: "GUERRA FRIA" ok, frase longa não)

// Mapeamento para siglas bonitas no jogo
const TAG_MAP = {
  'matematica': 'MAT',
  'portugues': 'LIN',
  'historia': 'HIST',
  'geografia': 'GEO',
  'biologia': 'BIO',
  'fisica': 'FIS',
  'quimica': 'QUIM',
  'ingles': 'ING',
  'espanhol': 'ESP',
  'filosofia': 'FILO',
  'sociologia': 'SOC',
  'geral': 'GERAL' // Fallback
};

// Função de Limpeza (Remove acentos, pontos finais e deixa uppercase)
const cleanText = (str) => {
  if (!str) return "";
  return str
    .replace(/\.$/, "") // Remove ponto final se tiver
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove tudo que não for letra/número ou espaço
    .toUpperCase()
    .trim();
};

try {
  console.log("⚡ Iniciando refinaria 2.0 (Compatible Mode)...");

  const rawPath = path.join(__dirname, '../questoes_raw.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error("Arquivo 'questoes_raw.json' não encontrado!");
  }
  
  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
  console.log(`📊 Analisando ${rawData.length} questões...`);

  let skippedCount = 0;

  const processedQuestions = rawData.map((q, index) => {
      // 1. Validação Básica
      if (!q.respostaCorreta || !q.alternativas) {
        skippedCount++;
        return null;
      }

      // 2. Achar o TEXTO da resposta correta (Match Letter "B" -> Text "...")
      const correctAlt = q.alternativas.find(alt => alt.letra === q.respostaCorreta);
      
      if (!correctAlt || !correctAlt.texto) {
        skippedCount++;
        return null;
      }

      // 3. Limpeza
      const cleanAnswer = cleanText(correctAlt.texto);
      
      // 4. FILTRO RIGOROSO (Só aceita palavras curtas para o jogo)
      const wordCount = cleanAnswer.split(' ').length;
      
      if (wordCount > MAX_WORDS || cleanAnswer.length > MAX_CHARS || cleanAnswer.length < 3) {
        // Pula frases longas (Ex: "revolta com a falta de sorte")
        skippedCount++; 
        return null;
      }

      // 5. Preparar Metadados
      // Tenta mapear a matéria, se falhar usa as 3 primeiras letras maiúsculas
      let rawMateria = q.materia ? q.materia.toLowerCase() : 'geral';
      let disciplineTag = TAG_MAP[rawMateria] || rawMateria.substring(0, 4).toUpperCase();

      // Enunciado como Dica (Truncado se necessário)
      let hintText = q.enunciado || "Sem enunciado disponível.";
      if (hintText.length > 140) {
        hintText = hintText.substring(0, 137) + "...";
      }

      return {
        id: q.id || `gen-${index}`,
        discipline: disciplineTag,
        topic: q.ano ? `ENEM ${q.ano}` : "Geral", // Tenta usar o Ano como subtópico
        hint: hintText,
        answer: cleanAnswer
      };
    })
    .filter(item => item !== null); // Remove os nulos (que foram filtrados)

  // Salvar
  const outputPath = path.join(__dirname, '../src/data/questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedQuestions, null, 2));

  console.log("---------------------------------------------------");
  console.log(`❌ Ignoradas (Frases longas/Inválidas): ${skippedCount}`);
  console.log(`✅ APROVADAS PARA O JOGO: ${processedQuestions.length}`);
  console.log("---------------------------------------------------");

  if (processedQuestions.length > 0) {
    console.log("🔍 Exemplo de questão gerada:");
    console.log(processedQuestions[0]);
  } else {
    console.log("⚠️ AVISO: Nenhuma questão passou no filtro de tamanho.");
    console.log("DICA: Tente aumentar 'MAX_WORDS' no script ou use uma base com respostas mais curtas.");
  }

} catch (error) {
  console.error("Erro fatal:", error.message);
}