const test = require('node:test');
const assert = require('node:assert');
const { scan } = require('../src/scan');

test('scan: texto limpo retorna zero achados', () => {
  const r = scan('Este texto nao tem nenhum dado sensivel.');
  assert.strictEqual(r.achados.length, 0);
  assert.strictEqual(r.resumo.total, 0);
});

test('scan: encontra CPF em texto', () => {
  const r = scan('O cliente de CPF 529.982.247-25 foi aprovado.');
  assert.strictEqual(r.resumo.porTipo.cpf, 1);
  assert.strictEqual(r.achados[0].valido, true);
});

test('scan: encontra multiplos tipos no mesmo texto', () => {
  const r = scan('Cliente 529.982.247-25, email sauanna@exemplo.com, CEP 01310-100.');
  assert.strictEqual(r.resumo.porTipo.cpf, 1);
  assert.strictEqual(r.resumo.porTipo.email, 1);
  assert.strictEqual(r.resumo.porTipo.cep, 1);
  assert.strictEqual(r.resumo.total, 3);
});

test('scan: entrada invalida nao quebra', () => {
  assert.strictEqual(scan('').resumo.total, 0);
  assert.strictEqual(scan(null).resumo.total, 0);
  assert.strictEqual(scan(123).resumo.total, 0);
});
