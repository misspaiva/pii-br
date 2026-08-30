import assert from "node:assert";
import { isValidCpf, findCpfs } from "../src/detectors/cpf.js";

// VÁLIDOS
assert.equal(isValidCpf("529.982.247-25"), true);
assert.equal(isValidCpf("52998224725"), true);

// FORMATADOS MAS INVÁLIDOS
assert.equal(isValidCpf("529.982.247-26"), false);
assert.equal(isValidCpf("111.111.111-11"), false);

// DETECÇÃO EM TEXTO
const texto = "Cliente Fulano Exemplo, CPF 529.982.247-25, ligou hoje.";
const achados = findCpfs(texto);
assert.equal(achados.length, 1);
assert.equal(achados[0].tipo, "CPF");
assert.equal(achados[0].valido, true);

console.log("✅ cpf.test.js — todos os testes passaram");
