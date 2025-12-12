const fs = require('fs');
const path = require('path');

try {
  const rawPath = path.join(__dirname, '../questoes_raw.json');
  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

  console.log("🔍 DIAGNÓSTICO DO JSON:");
  console.log("---------------------------------------------------");
  console.log("Total de itens:", rawData.length);
  console.log("---------------------------------------------------");
  console.log("EXEMPLO DO ITEM #0 (Estrutura Real):");
  console.log(JSON.stringify(rawData[0], null, 2));
  console.log("---------------------------------------------------");
  
  // Teste rápido de tamanho das respostas
  if (rawData[0].resposta_correta) {
      console.log("Teste da Resposta #0:", rawData[0].resposta_correta);
      console.log("Tamanho:", rawData[0].resposta_correta.length);
  } else {
      console.log("⚠️ AVISO: Campo 'resposta_correta' não encontrado ou vazio.");
      console.log("Chaves disponíveis:", Object.keys(rawData[0]));
  }

} catch (error) {
  console.error("Erro ao ler:", error.message);
}