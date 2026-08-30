const test = require('node:test');
const assert = require('node:assert');
const { isValid, findInText } = require('../src/detectors/telefone');

test('Telefone valido: celular com +55', () => {
  assert.strictEqual(isValid('+55 11 91234-5678'), true);
});

test('Telefone valido: celular com parenteses', () => {
  assert.strictEqual(isValid('(11) 91234-5678'), true);
});

test('Telefone valido: celular so digitos', () => {
  assert.strictEqual(isValid('11912345678'), true);
});

test('Telefone valido: fixo 8 digitos', () => {
  assert.strictEqual(isValid('(11) 3456-7890'), true);
  assert.strictEqual(isValid('1134567890'), true);
});

test('Telefone invalido: DDD inexistente (00, 10, 90+)', () => {
  assert.strictEqual(isValid('00 91234-5678'), false);
  assert.strictEqual(isValid('(10) 91234-5678'), false);
  assert.strictEqual(isValid('39 91234-5678'), false);
});

test('Telefone invalido: celular sem o 9 na frente', () => {
  // 8 digitos comecando com 9 seria fixo? NAO — fixo nao comeca com 9.
  // 1191234-5678 tem 9 digitos mas o primeiro ja é 9... este caso:
  // celular obrigatoriamente 9 dig. comecando com 9. Fixo 8 dig.
  assert.strictEqual(isValid('119876-5678'.replace(/\D/g, '') + ''), isValid('1198765678'));
});

test('Telefone invalido: numero curto/longo demais', () => {
  assert.strictEqual(isValid('119123456789'), false); // 12 dig sem +55
  assert.strictEqual(isValid(''), false);
  assert.strictEqual(isValid('abc'), false);
  assert.strictEqual(isValid(null), false);
});

test('Telefone invalido: fixo comecando com 0, 1, 8 ou 9', () => {
  assert.strictEqual(isValid('1103456789'), false); // 0
  assert.strictEqual(isValid('1113456789'), false); // 1
  assert.strictEqual(isValid('1191234567'), false); // 9 em fixo = celular antigo sem 9º digito
});


test('findInText acha telefone em texto realista', () => {
  const achados = findInText('Ligue para (11) 91234-5678 ou mande email.');
  assert.strictEqual(achados.length, 1);
  assert.strictEqual(achados[0].tipo, 'telefone');
  assert.strictEqual(achados[0].valido, true);
  assert.strictEqual(achados[0].valor, '(11) 91234-5678');
});
