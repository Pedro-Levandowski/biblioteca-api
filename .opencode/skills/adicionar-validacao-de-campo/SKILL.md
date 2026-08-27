---
name: adicionar-validacao-de-campo
description: Adiciona ou altera a validação de um campo da Biblioteca API e cria verificações HTTP para valores válidos, ausentes e inválidos. Use quando pedirem campo obrigatório, tipo, formato, limite, enumeração ou qualquer regra de dados de entrada em criação ou atualização.
---

# Adicionar validação de campo

A validação pertence ao serviço e deve produzir um erro de domínio observável pela API.

## Procedimento

1. Identifique quais operações recebem o campo e se a regra vale para criação, atualização ou ambas.
2. Escreva primeiro uma verificação HTTP para um valor inválido. Confirme status `422` e `corpo.erro.codigo` igual a `DADOS_INVALIDOS`.
3. Acrescente uma verificação de sucesso com um valor válido no limite relevante da regra.
4. Se o campo for obrigatório, cubra separadamente pelo menos um valor ausente: propriedade omitida, `null` ou string vazia, conforme o contrato pedido.
5. Execute as novas verificações antes da implementação e confirme que ao menos a verificação do valor inválido falha pelo motivo esperado.
6. Implemente a regra na função de validação do serviço. Não valide no controlador nem no repositório.
7. Lance `dadosInvalidos(...)` assim que a regra for violada; não devolva booleano, objeto de resposta HTTP ou `Error` genérico.
8. Garanta que a criação e a atualização chamem a validação antes de persistir qualquer mudança.
9. Execute as verificações do recurso e depois `npm test` por inteiro.

## Como escolher a condição

- Para texto obrigatório, rejeite `undefined`, `null` e `''`; não trate `0` ou `false` como ausentes quando esses tipos forem válidos.
- Para número inteiro, use `Number.isInteger`; conversão implícita faria uma string numérica passar sem estar no contrato.
- Para conjunto fechado de valores, compare com uma coleção explícita dos valores aceitos.
- Para formato textual, valide o formato depois de confirmar que o valor é uma string, evitando exceções acidentais.
- Quando houver limites mínimo e máximo, teste os limites aceitos e pelo menos um valor imediatamente fora deles.

## Regras que não podem ser inferidas

- A verificação afirma sobre o código estável `DADOS_INVALIDOS`, não sobre o texto completo da mensagem.
- Uma tentativa inválida não pode alterar o repositório. Quando relevante, consulte o recurso depois do erro para confirmar que o estado anterior permaneceu intacto.
- Não normalize silenciosamente um valor inválido a menos que o pedido defina essa normalização como parte do contrato.
- Se criação e atualização usam o mesmo formato de corpo, compartilhe a função de validação em vez de criar regras divergentes.

## Resultado esperado

Apresente a regra adicionada, as entradas cobertas pelas verificações e o resultado da suíte completa.
