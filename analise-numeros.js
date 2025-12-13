const fs = require('fs');
const path = require('path');

// Caminho para o seu arquivo
const filePath = path.join(__dirname, 'src/data/questions.json');

try {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`🔍 Analisando ${questions.length} questões...\n`);

  const problemQuestions = questions.filter(q => {
    // Regex que procura números (0-9) na resposta
    return /\d/.test(q.answer);
  });

  if (problemQuestions.length === 0) {
    console.log("✅ Nenhuma resposta numérica encontrada! Tudo limpo.");
  } else {
    console.log(`⚠️ Encontradas ${problemQuestions.length} questões com números:\n`);
    
    problemQuestions.forEach(q => {
      console.log(`ID: ${q.id} | Disciplina: ${q.discipline}`);
      console.log(`Pergunta: "${q.hint.substring(0, 50)}..."`);
      console.log(`RESPOSTA PROBLEMÁTICA: [ ${q.answer} ]`);
      console.log('---------------------------------------------------');
    });
  }

} catch (err) {
  console.error("Erro ao ler o arquivo:", err.message);
}