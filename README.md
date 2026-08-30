# pii-br 🇧🇷

Biblioteca **determinística** para detectar e validar dados pessoais (PII)
brasileiros em textos — CPF, CNPJ, e-mail, telefone e CEP.

Sem rede, sem IA, sem chamadas externas: só regex e matemática,
100% offline e reproduzível.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Por quê?

Antes de mandar dados para uma IA (ou qualquer serviço externo), você precisa
saber **o que está saindo**. O pii-br escaneia textos e aponta onde há PII —
com validação real, não só "parece um CPF":

- **CPF / CNPJ**: dígito verificador módulo-11 (rejeita sequências como `111.111.111-11`)
- **Telefone**: DDD validado contra a tabela oficial da ANATEL
- **E-mail**: validação de formato
- **CEP**: formato + regras de sanidade

## Instalação

```bash
git clone https://github.com/SEU-USUARIO/pii-br.git
cd pii-br

Requisitos: Node.js 18+

Uso

const { scan } = require('./src/scan');

const relatorio = scan('Cliente 529.982.247-25, email sauanna@exemplo.com, CEP 01310-100.');

console.log(relatorio.resumo);
// { total: 3, porTipo: { cpf: 1, email: 1, cep: 1 }, validos: 3 }

console.log(relatorio.achados);
// [
//   { tipo: 'cpf', valor: '529.982.247-25', indice: 8, valido: true },
//   { tipo: 'email', valor: 'sauanna@exemplo.com', indice: 32, valido: true },
//   { tipo: 'cep', valor: '01310-100', indice: 60, valido: true }
// ]
