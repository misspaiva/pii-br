const test = require('node:test');
const assert = require('node:assert');
const { isValid, findInText } = require('../src/detectors/cep');

test('CEP valido com mascara', () => {
  assert.strictEqual(isValid('01310-100'), true);
});

test('CEP valido sem mascara', () => {
  assert.strictEqual(isValid('01310100'), true);
});

test('CEP invalido: tamanho errado', () => {
  assert.strictEqual(isValid('01310-10'), false);    // 7 dig
  assert.strictEqual(isValid('013101000'), false);   // 9 dig
  assert.strictEqual(isValid(''), false);
  assert.strictEqual(isValid('abc'), false);
  assert.strictEqual(isValid(null), false);
});

test('CEP invalido: tudo igual', () => {
  assert.strictEqual(isValid('11111111'), false);
  assert.strictEqual(isValid('00000000'), false);
});

test('CEP invalido: sequencia obvia', () => {
  assert.strictEqual(isValid('12345678'), false);
});

test('findInText acha CEP em endereco realista', () => {
  const achados = findInText('Moro na Av. Paulista, 1000 - CEP 01310-100, SP.');
  assert.strictEqual(achados.length, 1);
  assert.strictEqual(achados[0].tipo, 'cep');
  assert.strictEqual(achados[0].valido, true);
  assert.strictEqual(achados[0].valor, '01310-100');
});
