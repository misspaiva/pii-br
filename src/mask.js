// pii-br — mascaramento de PII encontrado por scan().

function mascaraPara(tipo, valor) {
  const digitos = valor.replace(/\D/g, '');
  switch (tipo) {
    case 'cpf':
      return '***.***.***-**';
    case 'cnpj':
      return '**.***.***/****-**';
    case 'email':
      return '***@***.***';
    case 'telefone':
      return '(**) *****-****';
    case 'cep':
      return '*****-***';
    default:
      return '*'.repeat(digitos.length || valor.length);
  }
}

/**
 * Recebe um texto e um relatório do scan() e devolve o texto
 * com todos os achados substituídos pela máscara do seu tipo.
 */
function mask(texto, relatorio) {
  if (typeof texto !== 'string' || !relatorio || !Array.isArray(relatorio.achados)) {
    return texto;
  }
  // substitui de trás pra frente pra não bagunçar os índices
  const ordenados = [...relatorio.achados].sort((a, b) => b.indice - a.indice);
  let resultado = texto;
  for (const a of ordenados) {
    resultado =
      resultado.slice(0, a.indice) +
      mascaraPara(a.tipo, a.valor) +
      resultado.slice(a.indice + a.valor.length);
  }
  return resultado;
}

module.exports = { mask, mascaraPara };
