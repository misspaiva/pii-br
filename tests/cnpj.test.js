const test = require('node:test');
const assert = require('node:assert');
const { isValid } = require('../src/detectors/cnpj');

function gerarCnpjValido(baseStr) {
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const calc = (base, pesos) => {
    const soma = base.split('').reduce((a, d, i) => a + Number(d) * pesos[i], 0);
    return soma % 11 < 2 ? 0 : 11 - (soma % 11);
  };
  const dv1 = calc(baseStr, pesos1);
  const dv2 = calc(baseStr + dv1, pesos2);
  return baseStr + String(dv1) + String(dv2);
}

const cnpjValido1 = gerarCnpjValido('112223330001');
const cnpjValido2 = gerarCnpjValido('459974180001');

test('CNPJ válido com máscara', () => {
  const c = cnpjValido1; // 11222333000181
  const mascarado = `c.slice(0,2).{c.slice(0, 2)}.c.slice(0,2).{c.slice(2, 5)}.c.slice(5,8)/{c.slice(5, 8)}/c.slice(5,8)/{c.slice(8, 12)}-${c.slice(12)}`;
  assert.strictEqual(mascarado, '11.222.333/0001-81'); // guarda-chuva contra typo
  assert.strictEqual(isValid(mascarado), true);
});

test('CNPJ válido sem máscara', () => {
  assert.strictEqual(isValid(cnpjValido2), true);
});

test('CNPJ conhecido válido (ex.: Caixa, público)', () => {
  assert.strictEqual(isValid('00.360.305/0001-04'), true);
});

test('CNPJ inválido (dígito verificador trocado)', () => {
  const c = cnpjValido1;
  const trocadoSemMascara = c.slice(0, 13) + ((Number(c[13]) + 1) % 10);
  assert.strictEqual(isValid(trocadoSemMascara), false);
});

test('CNPJ sequência proibida rejeitado', () => {
  assert.strictEqual(isValid('11.111.111/1111-11'), false);
  assert.strictEqual(isValid('00000000000000'), false);
});

test('CNPJ vazio/curto/com letras rejeitado', () => {
  assert.strictEqual(isValid(''), false);
  assert.strictEqual(isValid('12.345.678/0001'), false);
  assert.strictEqual(isValid('123'), false);
  assert.strictEqual(isValid(null), false);
  assert.strictEqual(isValid(undefined), false);
});

test('CNPJ formato válido mas DV errado (estilo fixtures/clientes.json)', () => {
  // 11.222.333/0001-81 é VÁLIDO; o -82 quebra o DV
  assert.strictEqual(isValid('11.222.333/0001-82'), false);
});
