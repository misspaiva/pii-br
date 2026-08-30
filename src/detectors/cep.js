// pii-br — detector de CEP (formato).
// CEP não tem dígito verificador público validável offline, então aqui
// "valido" = formato correto + regras de sanidade (não-sequência, não-uniforme).

const REGEX_CEP = /\b\d{5}-?\d{3}\b/g;

function isValid(valor) {
  if (typeof valor !== 'string') return false;
  const d = valor.trim().replace(/\D/g, '');
  if (d.length !== 8) return false;
  if (/^(\d)\1{7}$/.test(d)) return false;           // 11111111, 00000000...
  if (/^01234567|23456789|12345678$/.test(d)) return false; // sequências óbvias
  return true;
}

function findInText(texto) {
  const achados = [];
  const regex = new RegExp(REGEX_CEP.source, 'g');
  let match;
  while ((match = regex.exec(texto)) !== null) {
    achados.push({
      tipo: 'cep',
      valor: match[0],
      indice: match.index,
      valido: isValid(match[0]),
    });
  }
  return achados;
}

module.exports = { isValid, findInText };
