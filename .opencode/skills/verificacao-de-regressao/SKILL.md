---
name: verificacao-de-regressao
description: Transforma um bug relatado na Biblioteca API em uma verificação de regressão que falha antes do conserto e permanece na suíte depois dele. Use quando reportarem um bug, comportamento incorreto, regressão ou pedirem para corrigir algo que quebrou.
---

# Verificação de Regressão

A verificação que reproduz o defeito deve ser criada antes de qualquer alteração no código de produção.

## Procedimento

1. Traduza o relato em um comportamento observável: estado inicial, requisição realizada, resultado esperado e resultado incorreto atual.
2. Localize `verificacoes/<recurso>.spec.js` e procure um caso existente que possa representar o defeito sem duplicação.
3. Escreva o menor teste capaz de reproduzir o problema pela interface HTTP da API.
4. Execute o teste e confirme que ele falha pelo motivo relatado.
5. Se passar antes do conserto, a reprodução está incompleta ou a expectativa está errada. Corrija o teste antes de modificar a implementação.
6. Identifique a camada responsável e faça o menor conserto coerente com a arquitetura existente.
7. Execute novamente o teste de regressão e confirme que ele passou.
8. Execute `npm test` por inteiro e corrija qualquer outra falha.
9. Mantenha o novo teste permanentemente na suíte.

## Regras

- Teste o comportamento público da API, evitando detalhes internos da implementação.
- Afirme contratos estáveis, como status HTTP, campos relevantes e `corpo.erro.codigo`.
- Não compare o texto completo da mensagem de erro, exceto quando a mensagem for o próprio defeito.
- Não remova, ignore ou enfraqueça testes existentes para obter um resultado verde.
- Use `reiniciar()` para isolar o estado quando o recurso possuir armazenamento em memória.
- Se não for possível reproduzir o relato, informe qual dado está faltando em vez de fazer um conserto especulativo.

## Resultado Esperado

Ao concluir, apresente:

1. O teste falhando antes do conserto.
2. A alteração que corrigiu o comportamento.
3. O mesmo teste passando depois do conserto.
4. A suíte completa passando.
