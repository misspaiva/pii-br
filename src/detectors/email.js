// pii-br — detector de e-mail por formato (regex).
// Não verifica se o endereço EXISTE (isso exigiria rede/DNS, fora do
// escopo determinístico) — valida se o FORMATO é plausível.

const REGEX_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

function isValid(valor) {
  if (typeof valor !== 'string') return false;
  const trimmed = valor.trim();
  if (trimmed === '') return false;
  // a string INTEIRA deve ser um e-mail (sem trechos extras)
  const match = trimmed.match(REGEX_EMAIL);
  return match !== null && match[0] === trimmed;
}

function findInText(texto) {
  const achados = [];
  const regex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  let match;
  while ((match = regex.exec(texto)) !== null) {
    achados.push({
      tipo: 'email',
      valor: match[0],
      indice: match.index,
      // para e-mail, "valido" = formato plausível (não há DV matemático)
      valido: true,
    });
  }
  return achados;
}

module.exports = { isValid, findInText, REGEX_EMAIL };
