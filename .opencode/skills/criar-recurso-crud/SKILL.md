---
name: criar-recurso-crud
description: Cria um recurso REST completo na Biblioteca API, com repositório, serviço, controlador, rotas, registro no servidor e verificações HTTP. Use quando pedirem para adicionar uma entidade, criar um CRUD ou implementar endpoints de um novo recurso, como autores, editoras, leitores ou empréstimos.
---

# Criar recurso CRUD

Use `livros` como referência de forma, adaptando nomes, campos, prefixo do identificador e regras do novo domínio.

## Procedimento

1. Defina o nome plural do recurso, seus campos obrigatórios e o prefixo de três letras do identificador.
2. Crie `src/repositorios/<recurso>-repositorio.js` com um `Map` privado e as operações `listar`, `buscarPorId`, `inserir`, `substituir`, `remover` e `reiniciar`.
3. Em `inserir`, construa o recurso no servidor: gere `id` com `novoIdentificador`, copie apenas os campos aceitos e acrescente os metadados do domínio.
4. Crie `src/servicos/<recurso>-servico.js`. Concentre nessa camada validação, procura obrigatória por identificador e demais regras de negócio.
5. Na atualização, obtenha primeiro o registro atual e use `...atual` antes de substituir os campos editáveis. Preserve `id`, `criadoEm` e todo metadado que o cliente não controla.
6. Crie `src/controladores/<recurso>-controlador.js` com manipuladores finos que recebem um único objeto. O controlador chama o serviço e responde com `enviarJson`; ele não captura erros de domínio.
7. Crie `src/rotas/<recurso>-rotas.js` como um array de objetos `{ metodo, padrao, manipulador }`. Nas rotas por identificador, use o grupo nomeado `(?<id>[^/]+)`.
8. Registre o recurso em dois pontos de `src/servidor.js`: importe o array de rotas e espalhe-o dentro de `rotas`.
9. Crie `verificacoes/<recurso>.spec.js` exercitando a API HTTP. Inicie um servidor em porta aleatória, feche-o ao final e chame `reiniciar()` antes de cada caso.
10. Cubra listagem vazia, criação, validação, busca existente e inexistente, atualização com preservação de metadados e remoção.
11. Execute primeiro as verificações do recurso e depois `npm test` por inteiro.

## Regras que não podem ser inferidas

- O corpo já chega convertido ao manipulador como `corpo`; não leia diretamente o fluxo da requisição.
- Erros de domínio devem ser lançados pelo serviço. O tratamento central do servidor os transforma em resposta HTTP.
- Uma remoção bem-sucedida chama `enviarJson(res, 204, null)`; não devolva mensagem de sucesso.
- Registrar somente a importação das rotas não basta: sem o espalhamento no array, todos os endpoints novos continuam respondendo 404.
- Não aceite `id`, `criadoEm` ou outros metadados enviados pelo cliente no lugar dos valores controlados pelo servidor.

## Resultado esperado

Informe os arquivos criados, os endpoints disponíveis e o resultado da suíte completa.
