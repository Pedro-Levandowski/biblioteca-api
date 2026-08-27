---
name: garantir-campo-unico
description: Impede cadastros ou atualizações duplicadas em um campo único da Biblioteca API e responde conflito de forma consistente. Use quando pedirem unicidade, bloqueio de duplicados, e-mail já cadastrado, ISBN repetido, nome existente ou resposta 409 por conflito.
---

# Garantir campo único

A regra de unicidade é uma decisão de negócio do serviço; o repositório continua responsável apenas por guardar e recuperar dados.

## Procedimento

1. Defina o campo único e a forma de comparação: literal ou sem diferença entre maiúsculas e minúsculas.
2. Crie uma verificação HTTP que cadastre o primeiro recurso e tente criar outro com o mesmo valor.
3. Confirme que a segunda resposta tem status `409` e `corpo.erro.codigo` igual a `CONFLITO`.
4. Crie uma verificação para atualização: alterar um recurso para o valor já usado por outro deve falhar com o mesmo contrato.
5. Crie uma verificação que atualize um recurso mantendo o próprio valor. Ela deve passar, pois o registro não conflita consigo mesmo.
6. Execute as novas verificações e confirme que o caso duplicado falha antes de modificar a implementação.
7. No serviço, procure uma correspondência na lista do repositório e lance `conflito(...)` quando outro registro já possuir o valor.
8. Na criação, faça a verificação de unicidade depois da validação do formato e antes de inserir.
9. Na atualização, confirme primeiro que o identificador existe; depois valide os dados e procure duplicidade ignorando o próprio `id`.
10. Execute as verificações do recurso e depois `npm test` por inteiro.

## Forma esperada

```js
function exigirUnico(campo, idIgnorado = null) {
  const procurado = campo.toLowerCase();
  const duplicado = repositorio.listar().find((item) =>
    item.id !== idIgnorado && item.campo.toLowerCase() === procurado
  );

  if (duplicado) {
    throw conflito('Já existe um recurso com esse campo.');
  }
}
```

Adapte `campo`, `item` e a comparação ao contrato do recurso.

## Regras que não podem ser inferidas

- Use igualdade para unicidade; `includes` pertence a filtros de busca e produziria falsos conflitos.
- Se a regra for sem diferença entre maiúsculas e minúsculas, normalize os dois lados somente para comparar. Preserve na resposta o valor original aceito.
- Na atualização, sempre ignore o identificador do próprio recurso na busca por duplicidade.
- O conflito deve ser detectado antes da escrita. Uma tentativa rejeitada não pode substituir nem remover o registro existente.
- As verificações afirmam sobre `corpo.erro.codigo`, nunca sobre o texto completo da mensagem.

## Resultado esperado

Informe qual campo passou a ser único, como a comparação foi feita, os cenários verificados e o resultado da suíte completa.
