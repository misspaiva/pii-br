#!/usr/bin/env node
// pii-br — CLI: escaneia um arquivo e imprime relatório ou texto mascarado.
// Uso: node src/cli.js <arquivo> [--mask] [--json]

const fs = require('fs');
const { scan } = require('./scan');
const { mask } = require('./mask');

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
 const arquivo = args.find((a) => !a.startsWith('--'));

if (!arquivo) {
  console.error('Uso: node src/cli.js <arquivo> [--mask] [--json]');
  process.exit(1);
}

let texto;
try {
  texto = fs.readFileSync(arquivo, 'utf8');
} catch (e) {
  console.error(`Erro: nao foi possivel ler "arquivo":{arquivo}":arquivo":{e.message}`);
  process.exit(1);
}

const relatorio = scan(texto);

if (flags.includes('--json')) {
  console.log(JSON.stringify(relatorio, null, 2));
} else if (flags.includes('--mask')) {
  console.log(mask(texto, relatorio));
} else {
  if (relatorio.achados.length === 0) {
    console.log('✅ Nenhum dado pessoal encontrado.');
  } else {
    console.log(`⚠️  ${relatorio.resumo.total} achado(s):`);
    for (const a of relatorio.achados) {
            console.log('  [' + a.tipo + '] posicao ' + a.indice + ': ' + a.valor + ' (valido: ' + a.valido + ')');

    }
    console.log(`\nResumo: ${JSON.stringify(relatorio.resumo)}`);
    console.log('Dica: use --mask para gerar o texto sem PII.');
        if (flags.includes('--fail-on-found')) {
      process.exit(2); // 2 = achou PII (diferente de 1 = erro de uso)
    }
  }
}
