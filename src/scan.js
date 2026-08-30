// pii-br — scan: agrega todos os detectores em um relatório único.

const cpf = require('./detectors/cpf');
const cnpj = require('./detectors/cnpj');
const email = require('./detectors/email');
const telefone = require('./detectors/telefone');
const cep = require('./detectors/cep');

const DETECTORES = [
  { tipo: 'cpf', find: cpf.findCpfs },
  { tipo: 'cnpj', find: cnpj.findInText },
  { tipo: 'email', find: email.findInText },
  { tipo: 'telefone', find: telefone.findInText },
  { tipo: 'cep', find: cep.findInText },
];

function scan(texto) {
  if (typeof texto !== 'string' || texto === '') {
    return { achados: [], resumo: { total: 0, porTipo: {}, validos: 0 } };
  }

  const achados = [];
  for (const det of DETECTORES) {
    for (const a of det.find(texto)) {
      achados.push({ ...a, tipo: det.tipo });
    }
  }

  const porTipo = {};
  let validos = 0;
  for (const a of achados) {
    porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1;
    if (a.valido) validos++;
  }

  return { achados, resumo: { total: achados.length, porTipo, validos } };
}

module.exports = { scan };
