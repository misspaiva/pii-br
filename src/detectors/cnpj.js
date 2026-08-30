// Detector de CNPJ: regex (com e sem máscara) + validação módulo-11
// com pesos próprios do CNPJ (14 dígitos, 2 DVs).
// Rejeita sequências repetidas e tamanho errado.

const REGEX_CNPJ = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/g;

function soDigitos(valor) {
  return String(valor).replace(/\D/g, '');
}

function ehSequencia(digitos) {
  return /^(\d)\1{13}$/.test(digitos);
}

function calculaDigito(digitos, pesos) {
  const soma = digitos
    .split('')
    .reduce((acc, d, i) => acc + Number(d) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function isValid(valor) {
  if (typeof valor !== 'string' && typeof valor !== 'number') return false;
  const digitos = soDigitos(valor);

  if (digitos.length !== 14) return false;
  if (ehSequencia(digitos)) return false;

  // Pesos oficiais do CNPJ (diferentes do CPF!)
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const base = digitos.slice(0, 12);
  const dv1 = calculaDigito(base, pesos1);
  const dv2 = calculaDigito(base + dv1, pesos2);

  return digitos === base + String(dv1) + String(dv2);
}

// Retorna achados formatados (para scan futuro)
function findInText(texto) {
  const achados = [];
  const regex = new RegExp(REGEX_CNPJ.source, 'g');
  let match;
  while ((match = regex.exec(texto)) !== null) {
    achados.push({
      tipo: 'cnpj',
      valor: match[0],
      indice: match.index,
      valido: isValid(match[0]),
    });
  }
  return achados;
}

module.exports = { isValid, findInText, REGEX_CNPJ };
