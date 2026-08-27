---
name: revisar-convencoes
description: Revisa uma mudança da Biblioteca API antes de considerá-la concluída, conferindo o diff, as camadas, os contratos HTTP, o registro de rotas e a suíte completa. Use quando disserem "terminei", "revise", "confira", "está pronto?" ou pedirem uma revisão final.
---

# Revisar convenções

Revise somente o escopo alterado, mas execute a suíte completa. Use o `AGENTS.md` como fonte das regras gerais e os arquivos do recurso `livros` como referência da arquitetura existente.

## Procedimento

1. Execute `git status --short` para identificar todos os arquivos alterados ou não rastreados.
2. Examine o diff completo da mudança.
3. Confira separadamente o diff de `package.json` e confirme que nenhuma dependência foi adicionada.
4. Compare os arquivos modificados com as regras do `AGENTS.md`.
5. Confira a separação entre as camadas.
6. Verifique os contratos HTTP aplicáveis.
7. Confira os testes criados ou modificados.
8. Execute `npm test` por inteiro.
9. Se o pedido incluir correção e algum item falhar, corrija o problema e reinicie a revisão desde o primeiro passo.

## Conferência das camadas

### Rotas

- Importam o controlador correspondente.
- Utilizam objetos com `metodo`, `padrao` e `manipulador`.
- Rotas com identificador usam um grupo nomeado como `(?<id>[^/]+)`.

### Controlador

- Recebe um único objeto com propriedades como `res`, `parametros`, `corpo` e `consulta`.
- Chama o serviço correspondente.
- Formata a resposta com `enviarJson`.
- Não importa diretamente o repositório.
- Não utiliza `try/catch` para erros de domínio.

### Serviço

- Concentra validações, filtros e regras de negócio.
- Chama o repositório.
- Lança erros de domínio quando necessário.
- Não produz diretamente respostas HTTP.

### Repositório

- Concentra apenas armazenamento e recuperação dos dados.
- Não contém regras HTTP.
- Fornece `reiniciar()` quando os testes precisarem limpar o estado em memória.

## Conferência de recursos novos

Quando a mudança criar um recurso, confira os dois pontos obrigatórios em `src/servidor.js`:

1. A importação do conjunto de rotas.
2. A inclusão dessas rotas no array utilizado pelo servidor.

Exemplo:

```js
import { rotasLeitores } from './rotas/leitores-rotas.js';

const rotas = [
  ...rotasLivros,
  ...rotasLeitores,
];
```

## Conferência das operações CRUD

Aplique somente os itens relacionados às operações alteradas.

### Criação

- Responde com status `201`.
- Devolve o recurso criado.
- Mantém o formato de identificador definido pelo projeto.

### Busca e listagem

- Respondem com status `200`.
- A busca inexistente produz o código de erro esperado.
- A listagem sem registros devolve uma lista vazia.

### Atualização

- Preserva `id`, `criadoEm` e outros metadados que não devem ser recriados.
- Não monta o recurso do zero quando isso apagaria informações existentes.

Forma esperada:

```js
return repositorio.substituir(id, {
  ...atual,
  campo: dados.campo,
});
```

### Remoção

- Confirma que o recurso existe antes da remoção.
- Responde com status `204` e sem corpo.

Forma esperada:

```js
servico.remover(parametros.id);
enviarJson(res, 204, null);
```

## Conferência dos testes

- Os testes observam o comportamento público da API.
- O estado em memória é reiniciado entre os casos.
- Os caminhos de sucesso e os erros relevantes estão cobertos.
- Os testes novos não substituem nem enfraquecem os existentes.
- A suíte passa por inteiro, não apenas o arquivo recém-criado.

## Quando um item falhar

- Identifique o item, a evidência e o arquivo envolvido.
- Se o pedido incluir corrigir ou finalizar, faça a correção e reinicie toda a lista.
- Se o pedido for somente de revisão, não altere arquivos: apenas relate os problemas encontrados.
- Não considere a mudança concluída enquanto houver teste vermelho ou item obrigatório sem conferência.

## Resultado esperado

Ao concluir, informe:

1. O que foi conferido.
2. Os problemas encontrados.
3. As correções realizadas, quando autorizadas.
4. O resultado da suíte completa.
