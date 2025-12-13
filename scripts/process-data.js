const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÕES ---
const MAX_CHARS = 18; 
const MAX_WORDS = 2;
const MIN_CHARS = 3;

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
  'geral': 'GERAL'
};

const cleanAnswerText = (str) => {
  if (!str) return "";
  return str
    .replace(/\.$/, "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase()
    .trim();
};

try {
  console.log("⚡ Iniciando refinaria 4.0 (Anti-Table Mode)...");

  const rawPath = path.join(__dirname, '../questoes_raw.json'); 
  if (!fs.existsSync(rawPath)) throw new Error(`Arquivo não encontrado: ${rawPath}`);
  
  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
  console.log(`📊 Analisando ${rawData.length} questões...`);

  let skippedStats = {
      longText: 0,
      badTable: 0, // 👈 Nova estatística
      noAnswer: 0
  };

  const processedQuestions = rawData.map((q, index) => {
      if (!q.respostaCorreta || !q.alternativas) {
        skippedStats.noAnswer++;
        return null;
      }

      const correctAlt = q.alternativas.find(alt => alt.letra === q.respostaCorreta);
      if (!correctAlt || !correctAlt.texto) {
        skippedStats.noAnswer++;
        return null;
      }

      const cleanAnswer = cleanAnswerText(correctAlt.texto);
      
      // Filtro de Tamanho da Resposta
      const wordCount = cleanAnswer.split(' ').length;
      if (wordCount > MAX_WORDS || cleanAnswer.length > MAX_CHARS || cleanAnswer.length < MIN_CHARS) {
        skippedStats.longText++; 
        return null;
      }

      // TRATAMENTO DO ENUNCIADO
      let hintText = q.enunciado || "Contexto indisponível.";
      
      // 👇 O "TERMINATOR" DE TABELAS
      // Se o texto tiver "|", é uma tabela Markdown. Lixo.
      if (hintText.includes('|') || hintText.includes('---')) {
          skippedStats.badTable++;
          return null;
      }

      // Limpeza padrão
      hintText = hintText
          .replace(/##/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      let rawMateria = q.materia ? q.materia.toLowerCase() : 'geral';
      let disciplineTag = TAG_MAP[rawMateria] || rawMateria.substring(0, 4).toUpperCase();

      return {
        id: q.id || `gen-${index}`,
        discipline: disciplineTag,
        topic: q.ano ? `ENEM ${q.ano}` : "Geral",
        hint: hintText,
        answer: cleanAnswer,
        // Mantendo compatibilidade com o sistema de dificuldade
        // (A dificuldade será recalculada na Store na hora do jogo, 
        // mas podemos salvar campos vazios se quiser)
      };
    })
    .filter(item => item !== null);

  // Salvar
  const outputPath = path.join(__dirname, '../src/data/questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(processedQuestions, null, 2));

  console.log("---------------------------------------------------");
  console.log(`❌ Removidas por Resposta Longa/Inválida: ${skippedStats.longText}`);
  console.log(`❌ Removidas por Conter Tabelas (Markdown): ${skippedStats.badTable}`); // 👈 Veja quantas morrem aqui
  console.log(`❌ Dados incompletos: ${skippedStats.noAnswer}`);
  console.log(`✅ APROVADAS PARA O JOGO: ${processedQuestions.length}`);
  console.log("---------------------------------------------------");

} catch (error) {
  console.error("Erro fatal:", error.message);
}