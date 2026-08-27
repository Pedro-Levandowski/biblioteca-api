import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { criarServidor } from '../src/servidor.js';
import { reiniciar } from '../src/repositorios/autores-repositorio.js';

let servidor;
let base;

before(async () => {
  servidor = criarServidor();
  await new Promise((resolver) => servidor.listen(0, resolver));
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

beforeEach(() => reiniciar());

async function criarAutor(dados = {}) {
  const resposta = await fetch(`${base}/autores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'Machado de Assis', nacionalidade: 'Brasileira', anoNascimento: 1839, ...dados }),
  });
  return { resposta, corpo: await resposta.json() };
}

describe('autores', () => {
  it('começa com a lista de autores vazia', async () => {
    const resposta = await fetch(`${base}/autores`);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), []);
  });

  it('cria um autor e devolve 201 com identificador prefixado', async () => {
    const { resposta, corpo } = await criarAutor();
    assert.equal(resposta.status, 201);
    assert.match(corpo.id, /^aut_[0-9a-f]{8}$/);
    assert.ok(corpo.criadoEm);
  });

  it('recusa autor sem nome com 422', async () => {
    const { resposta, corpo } = await criarAutor({ nome: '' });
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('recusa autor sem nacionalidade (omitida) com 422', async () => {
    const dados = { nome: 'Machado de Assis', anoNascimento: 1839 };
    const resposta = await fetch(`${base}/autores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const corpo = await resposta.json();
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('recusa autor com nacionalidade null com 422', async () => {
    const { resposta, corpo } = await criarAutor({ nacionalidade: null });
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('recusa autor com nacionalidade vazia com 422', async () => {
    const { resposta, corpo } = await criarAutor({ nacionalidade: '' });
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('recusa autor com nacionalidade que não é string com 422', async () => {
    const { resposta, corpo } = await criarAutor({ nacionalidade: 123 });
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('cria autor com nacionalidade válida e devolve 201', async () => {
    const { resposta, corpo } = await criarAutor({ nacionalidade: 'Brasileira' });
    assert.equal(resposta.status, 201);
    assert.equal(corpo.nacionalidade, 'Brasileira');
  });

  it('recusa anoNascimento que não é inteiro com 422', async () => {
    const { resposta, corpo } = await criarAutor({ anoNascimento: 'dezoito trinta e nove' });
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('recusa corpo JSON null com 422', async () => {
    const resposta = await fetch(`${base}/autores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'null',
    });
    const corpo = await resposta.json();
    assert.equal(resposta.status, 422);
    assert.equal(corpo.erro.codigo, 'DADOS_INVALIDOS');
  });

  it('busca um autor pelo identificador', async () => {
    const { corpo: criado } = await criarAutor();
    const resposta = await fetch(`${base}/autores/${criado.id}`);
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).nome, 'Machado de Assis');
  });

  it('devolve 404 para identificador inexistente', async () => {
    const resposta = await fetch(`${base}/autores/aut_00000000`);
    assert.equal(resposta.status, 404);
    assert.equal((await resposta.json()).erro.codigo, 'NAO_ENCONTRADO');
  });

  it('filtra a listagem por nome', async () => {
    await criarAutor();
    await criarAutor({ nome: 'Graciliano Ramos', nacionalidade: 'Brasileira', anoNascimento: 1892 });

    const resposta = await fetch(`${base}/autores?nome=graciliano`);
    const autores = await resposta.json();
    assert.equal(autores.length, 1);
    assert.equal(autores[0].nome, 'Graciliano Ramos');
  });

  it('atualiza um autor existente', async () => {
    const { corpo: criado } = await criarAutor();
    const resposta = await fetch(`${base}/autores/${criado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Joaquim Maria Machado de Assis', nacionalidade: 'Brasileira', anoNascimento: 1839 }),
    });
    assert.equal(resposta.status, 200);
    const atualizado = await resposta.json();
    assert.equal(atualizado.nome, 'Joaquim Maria Machado de Assis');
    assert.equal(atualizado.id, criado.id);
    assert.equal(atualizado.criadoEm, criado.criadoEm);
  });

  it('recusa criação de autor com nome duplicado com 409', async () => {
    await criarAutor({ nome: 'Machado de Assis' });
    const { resposta, corpo } = await criarAutor({ nome: 'Machado de Assis' });
    assert.equal(resposta.status, 409);
    assert.equal(corpo.erro.codigo, 'CONFLITO');
  });

  it('recusa criação de autor com nome duplicado ignorando maiúsculas e minúsculas com 409', async () => {
    await criarAutor({ nome: 'Machado de Assis' });
    const { resposta, corpo } = await criarAutor({ nome: 'machado de assis' });
    assert.equal(resposta.status, 409);
    assert.equal(corpo.erro.codigo, 'CONFLITO');
  });

  it('recusa atualização de autor para um nome já existente com 409', async () => {
    await criarAutor({ nome: 'Machado de Assis' });
    const { corpo: segundo } = await criarAutor({ nome: 'Graciliano Ramos', nacionalidade: 'Brasileira', anoNascimento: 1892 });

    const resposta = await fetch(`${base}/autores/${segundo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'machado de assis', nacionalidade: 'Brasileira', anoNascimento: 1892 }),
    });
    const corpo = await resposta.json();
    assert.equal(resposta.status, 409);
    assert.equal(corpo.erro.codigo, 'CONFLITO');
  });

  it('permite atualizar um autor mantendo o próprio nome', async () => {
    const { corpo: criado } = await criarAutor({ nome: 'Machado de Assis' });

    const resposta = await fetch(`${base}/autores/${criado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Machado de Assis', nacionalidade: 'Brasileira Aprimorada', anoNascimento: 1839 }),
    });
    assert.equal(resposta.status, 200);
    const atualizado = await resposta.json();
    assert.equal(atualizado.nome, 'Machado de Assis');
    assert.equal(atualizado.nacionalidade, 'Brasileira Aprimorada');
  });

  it('remove um autor e devolve 204 sem corpo', async () => {
    const { corpo: criado } = await criarAutor();
    const resposta = await fetch(`${base}/autores/${criado.id}`, { method: 'DELETE' });
    assert.equal(resposta.status, 204);
    assert.equal(await resposta.text(), '');

    const conferencia = await fetch(`${base}/autores/${criado.id}`);
    assert.equal(conferencia.status, 404);
  });
});
