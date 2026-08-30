const test = require('node:test');
const assert = require('node:assert');
const { scan } = require('../src/scan');
const { mask } = require('../src/mask');

test('mask: substitui CPF por mascara', () => {
  const texto = 'CPF 529.982.247-25 do cliente';
  const r = mask(texto, scan(texto));
  assert.strictEqual(r, 'CPF ***.***.***-** do cliente');
});

test('mask: substitui multiplos tipos', () => {
  const texto = 'Cliente 529.982.247-25, email sauanna@exemplo.com, CEP 01310-100.';
  const r = mask(texto, scan(texto));
  assert.strictEqual(r, 'Cliente ***.***.***-**, email ***@***.***, CEP *****-***.');
});

test('mask: texto sem PII sai intacto', () => {
  const texto = 'nada aqui';
  assert.strictEqual(mask(texto, scan(texto)), 'nada aqui');
});

test('mask: entradas invalidas nao quebram', () => {
  assert.strictEqual(mask(null, null), null);
  assert.strictEqual(mask('abc', undefined), 'abc');
});
