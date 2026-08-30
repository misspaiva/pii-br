const test = require('node:test');
const assert = require('node:assert');
const { isValid } = require('../src/detectors/email');

test('E-mail válido simples', () => {
  assert.strictEqual(isValid('sauanna@exemplo.com'), true);
});

test('E-mail válido com pontos e subdominio', () => {
  assert.strictEqual(isValid('jose.silva@mail.exemplo.com.br'), true);
});

test('E-mail válido com numeros e sinal de mais', () => {
  assert.strictEqual(isValid('dev+pii123@exemplo.org'), true);
});

test('E-mail invalido sem @', () => {
  assert.strictEqual(isValid('sauanna.exemplo.com'), false);
});

test('E-mail invalido sem dominio', () => {
  assert.strictEqual(isValid('sauanna@'), false);
});

test('E-mail invalido sem TLD', () => {
  assert.strictEqual(isValid('sauanna@exemplo'), false);
});

test('E-mail invalido vazio e nao-string', () => {
  assert.strictEqual(isValid(''), false);
  assert.strictEqual(isValid('   '), false);
  assert.strictEqual(isValid(null), false);
  assert.strictEqual(isValid(undefined), false);
  assert.strictEqual(isValid(123), false);
});

test('E-mail invalido com espacos internos', () => {
  assert.strictEqual(isValid('sauanna paiva@exemplo.com'), false);
});

test('Estilo fixtures/clientes.json (@exemplo.com é formato valido)', () => {
  // o dominio é ficticio, mas o FORMATO é válido — o detector aceita
  assert.strictEqual(isValid('cliente1@exemplo.com'), true);
});
