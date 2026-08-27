---
name: filtro-em-listagem
description: Adiciona um filtro por query string a uma listagem existente da Biblioteca API, preservando a lista completa quando o parâmetro não é informado. Use quando pedirem para filtrar, pesquisar ou buscar recursos por um campo textual.
---

# Filtro em listagem

O controlador apenas lê e repassa o parâmetro. A filtragem deve ser realizada pelo serviço.

## Procedimento

1. Identifique o endpoint de listagem, o parâmetro da query string e o campo textual correspondente.
2. Antes da implementação, crie testes para a listagem com filtro e sem filtro.
3. No controlador, leia o parâmetro usando `consulta.get('<campo>')`.
4. Repasse o valor ao serviço em um objeto nomeado.
5. No serviço, obtenha primeiro a lista completa do repositório.
6. Se o parâmetro estiver ausente ou vazio, devolva a lista completa.
7. Se houver valor, converta o termo procurado e o campo do recurso para letras minúsculas.
8. Use `includes` para realizar uma comparação parcial sem diferenciar maiúsculas de minúsculas.
9. Execute os testes do recurso e depois `npm test` por inteiro.

## Forma esperada

```js
// controlador
export function listar({ res, consulta }) {
  const itens = servico.listar({
    campo: consulta.get('campo'),
  });

  enviarJson(res, 200, itens);
}
```

```js
// serviço
export function listar({ campo } = {}) {
  const itens = repositorio.listar();

  if (!campo) return itens;

  const procurado = campo.toLowerCase();

  return itens.filter((item) =>
    item.campo.toLowerCase().includes(procurado)
  );
}
```

Adapte `campo`, `itens` e os demais nomes ao recurso trabalhado.

## Regras

- O controlador não deve percorrer nem filtrar a lista.
- O repositório continua responsável somente por armazenar e recuperar os itens.
- A ausência do parâmetro deve devolver a lista completa, não uma lista vazia.
- A comparação deve ser parcial e não diferenciar maiúsculas de minúsculas.
- Não altere o comportamento da listagem sem filtro.
- Não use esta skill para paginação, ordenação ou pesquisa simultânea em vários campos.

## Verificações obrigatórias

1. Sem filtro: resposta `200` com a lista inteira.
2. Com filtro: somente os itens correspondentes.
3. Com diferença entre maiúsculas e minúsculas: o item ainda é encontrado.
4. Sem correspondência: resposta `200` com uma lista vazia.
5. Suíte completa passando.
