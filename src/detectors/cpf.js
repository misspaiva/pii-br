// pii-br — detector de CPF com validação módulo-11 (dígito verificador real)

const CPF_REGEX = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;

function calcularDigito(base) {
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += Number(base[i]) * (base.length + 1 - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

export function isValidCpf(cpf) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  const base = digits.slice(0, 9);
  const dv1 = calcularDigito(base);
  const dv2 = calcularDigito(base + dv1);
  return Number(digits[9]) === dv1 && Number(digits[10]) === dv2;
}

export function findCpfs(text) {
  const achados = [];
  for (const match of text.matchAll(CPF_REGEX)) {
    achados.push({
      tipo: "CPF",
      valor: match[0],
      indice: match.index,
      valido: isValidCpf(match[0]),
    });
  }
  return achados;
}
