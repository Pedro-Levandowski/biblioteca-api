import * as repositorio from '../repositorios/autores-repositorio.js';
import { dadosInvalidos, naoEncontrado, conflito } from '../comum/erros.js';

const CAMPOS_OBRIGATORIOS = ['nome', 'nacionalidade', 'anoNascimento'];

function validar(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw dadosInvalidos('O corpo da requisição deve ser um objeto.');
  }
  for (const campo of CAMPOS_OBRIGATORIOS) {
    const valor = dados[campo];
    if (valor === undefined || valor === null || valor === '') {
      throw dadosInvalidos(`O campo "${campo}" é obrigatório.`);
    }
  }
  if (typeof dados.nacionalidade !== 'string') {
    throw dadosInvalidos('O campo "nacionalidade" precisa ser uma string.');
  }
  if (!Number.isInteger(dados.anoNascimento)) {
    throw dadosInvalidos('O campo "anoNascimento" precisa ser um número inteiro.');
  }
}

function exigirExistente(id) {
  const autor = repositorio.buscarPorId(id);
  if (!autor) {
    throw naoEncontrado(`Não existe autor com o identificador "${id}".`);
  }
  return autor;
}

function exigirNomeUnico(nome, idIgnorado = null) {
  const procurado = nome.toLowerCase();
  const duplicado = repositorio.listar().find((autor) =>
    autor.id !== idIgnorado && autor.nome.toLowerCase() === procurado
  );

  if (duplicado) {
    throw conflito('Já existe um autor com esse nome.');
  }
}

export function listar({ nome, nacionalidade } = {}) {
  let autores = repositorio.listar();
  if (nome) {
    const procuradoNome = nome.toLowerCase();
    autores = autores.filter((autor) => autor.nome.toLowerCase().includes(procuradoNome));
  }
  if (nacionalidade) {
    const procuradoNacionalidade = nacionalidade.toLowerCase();
    autores = autores.filter((autor) => autor.nacionalidade.toLowerCase().includes(procuradoNacionalidade));
  }
  return autores;
}

export function buscarPorId(id) {
  return exigirExistente(id);
}

export function criar(dados) {
  validar(dados);
  exigirNomeUnico(dados.nome);
  return repositorio.inserir(dados);
}

export function atualizar(id, dados) {
  const atual = exigirExistente(id);
  validar(dados);
  exigirNomeUnico(dados.nome, id);
  return repositorio.substituir(id, {
    ...atual,
    nome: dados.nome,
    nacionalidade: dados.nacionalidade,
    anoNascimento: dados.anoNascimento,
  });
}

export function remover(id) {
  exigirExistente(id);
  repositorio.remover(id);
}
