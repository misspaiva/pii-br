#!/usr/bin/env node
// pii-br - CLI: escaneia arquivos e imprime relatorio ou texto mascarado.
// Uso: node src/cli.js <arquivo|glob|pasta> [--mask] [--json] [--fail-on-found]

const fs = require('fs');
const path = require('path');
const { scan } = require('./scan');
const { mask } = require('./mask');

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const alvo = args.find((a) => !a.startsWith('--'));

if (!alvo) {
  console.error('Uso: node src/cli.js <arquivo|glob|pasta> [--mask] [--json] [--fail-on-found]');
  process.exit(1);
}

// Expande o alvo: arquivo unico, ou todos os arquivos do repo (**/*)
function listarArquivos(alvo) {
  if (fs.existsSync(alvo) && fs.statSync(alvo).isFile()) return [alvo];
  const tudo = [];
  function walk(dir) {
    for (const nome of fs.readdirSync(dir)) {
      if (nome === "node_modules" || nome === ".git") continue;
      const completo = path.join(dir, nome);
      if (fs.statSync(completo).isDirectory()) walk(completo);
      else tudo.push(path.relative(process.cwd(), completo).replace(/\\/g, "/"));
    }
  }
  walk(process.cwd());
  const m = alvo.split("/").pop();
  if (alvo === "**/*" || m === "*") return tudo;
  if (m.startsWith("*.")) {
    return tudo.filter((f) => f.endsWith(m.slice(1)));
  }
  return tudo.filter((f) => f === alvo);
}

let arquivos;
try {
  arquivos = listarArquivos(alvo);
  const IGNORAR = ["tests/", "src/detectors/", "package.json", "README.md"];
  arquivos = arquivos.filter((f) => !IGNORAR.some((p) => f === p || f.startsWith(p)));

  if (arquivos.length === 0) {
    console.error('Nenhum arquivo encontrado para o padrao: ' + alvo);
    process.exit(1);
  }
} catch (e) {
  console.error('Erro: nao foi possivel expandir "' + alvo + '": ' + e.message);
  process.exit(1);
}

let totalAchados = 0;
let encontrouAlgo = false;

for (const arquivo of arquivos) {
  let texto;
  try {
    texto = fs.readFileSync(arquivo, 'utf8');
  } catch (e) {
    console.error('Erro: nao foi possivel ler "' + arquivo + '": ' + e.message);
    process.exit(1);
  }

  const relatorio = scan(texto);

  if (flags.includes('--json')) {
    console.log(JSON.stringify(relatorio, null, 2));
  } else if (flags.includes('--mask')) {
    console.log(mask(texto, relatorio));
  } else {
    if (relatorio.achados.length === 0) {
      console.log('OK [' + arquivo + ']: nenhum dado pessoal encontrado.');
    } else {
      encontrouAlgo = true;
      console.log('AVISO: ' + relatorio.resumo.total + ' achado(s) em ' + arquivo + ':');
      for (const a of relatorio.achados) {
        console.log('  [' + a.tipo + '] posicao ' + a.indice + ': ' + a.valor + ' (valido: ' + a.valido + ')');
      }
    }
  }
  totalAchados += relatorio.achados.length;
}

if (!flags.includes('--json') && !flags.includes('--mask')) {
  console.log('');
  console.log('Resumo: ' + totalAchados + ' achado(s) em ' + arquivos.length + ' arquivo(s).');
  console.log('Dica: use --mask para gerar o texto sem PII.');
}

if (flags.includes('--fail-on-found') && encontrouAlgo) {
  process.exit(2); // 2 = achou PII (diferente de 1 = erro de uso)
}
