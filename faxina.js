const fs = require('fs');
const path = require('path');

// Caminho do seu arquivo de dados
const filePath = path.join(__dirname, 'src/data/questions.json');

// 1. LISTA NEGRA (IDs para deletar)
const idsToDelete = [
  "2022_questao_92", "2022_questao_105", "2022_questao_108", "2022_questao_111", 
  "2022_questao_115", "2022_questao_125", "2022_questao_126", "2022_questao_136", 
  "2022_questao_144", "2022_questao_145", "2022_questao_148", "2022_questao_149", 
  "2022_questao_150", "2022_questao_152", "2022_questao_154", "2022_questao_155", 
  "2022_questao_156", "2022_questao_161", "2022_questao_162", "2022_questao_169", 
  "2022_questao_173", "2022_questao_179", "2023_questao_97", "2023_questao_137", 
  "2023_questao_139", "2023_questao_142", "2023_questao_144", "2023_questao_150", 
  "2023_questao_151", "2023_questao_157", "2023_questao_163", "2023_questao_178", 
  "2024_questao_99", "2024_questao_114", "2024_questao_117", "2024_questao_136", 
  "2024_questao_140", "2024_questao_142", "2024_questao_143", "2024_questao_148", 
  "2024_questao_150", "2024_questao_156", "2024_questao_157", "2024_questao_158", 
  "2024_questao_159", "2024_questao_161", "2024_questao_163", "2024_questao_173", 
  "2024_questao_174"
];

// 2. LISTA DE CORREÇÃO (IDs para alterar a resposta)
const updates = {
  "2022_questao_109": "GAS CARBONICO", // Era CO2
  "2023_questao_122": "HEXANOL"        // Era HEXAN3OL
};

try {
  // Ler o arquivo
  const rawData = fs.readFileSync(filePath, 'utf8');
  let questions = JSON.parse(rawData);
  const totalInicial = questions.length;

  console.log(`📊 Total inicial: ${totalInicial} questões.`);

  // PASSO A: Filtrar (Remover os da lista negra)
  questions = questions.filter(q => !idsToDelete.includes(q.id));
  
  const deletadas = totalInicial - questions.length;
  console.log(`🗑️  Deletadas: ${deletadas} questões numéricas/impossíveis.`);

  // PASSO B: Corrigir (Alterar as respostas das exceções)
  let corrigidas = 0;
  questions = questions.map(q => {
    if (updates[q.id]) {
      console.log(`✨ Corrigindo ${q.id}: "${q.answer}" -> "${updates[q.id]}"`);
      q.answer = updates[q.id];
      corrigidas++;
    }
    return q;
  });

  // PASSO C: Salvar
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');

  console.log(`✅ Concluído! Arquivo salvo com ${questions.length} questões.`);

} catch (err) {
  console.error("❌ Erro:", err.message);
}