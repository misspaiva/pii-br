// pii-br — detector de telefone brasileiro com DDD.
// Valida: formato (regex) + DDD real (tabela oficial da ANATEL).
// Não verifica se o número EXISTE na operadora — isso exige rede.

// DDDs reais do Brasil (ANATEL), em ordem numérica
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, // SP e região
  21, 22, 24, 27, 28,                 // RJ, ES
  31, 32, 33, 34, 35, 37, 38,         // MG
  41, 42, 43, 44, 45, 46,             // PR
  47, 48, 49,                         // SC
  51, 53, 54, 55,                     // RS
  61, 62, 63, 64, 65, 66, 67, 68, 69, // CO/AC/RO
  71, 73, 74, 75, 77, 79,             // BA, SE
  81, 82, 83, 84, 85, 86, 87, 88, 89, // NE
  91, 92, 93, 94, 95, 96, 97, 98, 99, // N
]);

const REGEX_TEL = /(\+?55[\s-]?)?\(?(\d{2})\)?[\s-]?(9?\d{4})[\s-]?(\d{4})\b/g;

function limpar(valor) {
  return String(valor).replace(/\D/g, '');
}

function isValid(valor) {
  if (typeof valor !== 'string') return false;
  const d = limpar(valor);

  // com +55: 55 + DDD + número = 13 dígitos (celular) ou 12 (fixo)
  let ddd, numero;
  if (d.startsWith('55') && d.length >= 12 && d.length <= 13) {
    ddd = Number(d.slice(2, 4));
    numero = d.slice(4);
  } else if (d.length === 10 || d.length === 11) {
    ddd = Number(d.slice(0, 2));
    numero = d.slice(2);
  } else {
    return false;
  }

  if (!DDDS_VALIDOS.has(ddd)) return false;
  // celular tem 9 dígitos e começa com 9; fixo tem 8 e não começa com 0/1
  if (numero.length === 9) return numero[0] === '9';
    if (numero.length === 8) return /^[2-5]/.test(numero);
  return false;
}

function findInText(texto) {
  const achados = [];
  const regex = new RegExp(REGEX_TEL.source, 'g');
  let match;
  while ((match = regex.exec(texto)) !== null) {
    achados.push({
      tipo: 'telefone',
      valor: match[0],
      indice: match.index,
      valido: isValid(match[0]),
    });
  }
  return achados;
}

module.exports = { isValid, findInText, DDDS_VALIDOS };
