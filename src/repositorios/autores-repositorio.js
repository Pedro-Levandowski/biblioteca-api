import { novoIdentificador } from '../comum/identificador.js';

const acervo = new Map();

export function listar() {
  return [...acervo.values()];
}

export function buscarPorId(id) {
  return acervo.get(id) ?? null;
}

export function inserir(dados) {
  const autor = {
    id: novoIdentificador('aut'),
    nome: dados.nome,
    nacionalidade: dados.nacionalidade,
    anoNascimento: dados.anoNascimento,
    criadoEm: new Date().toISOString(),
  };
  acervo.set(autor.id, autor);
  return autor;
}

export function substituir(id, autor) {
  acervo.set(id, autor);
  return autor;
}

export function remover(id) {
  return acervo.delete(id);
}

/** Usado apenas pelas verificações, para isolar um caso do outro. */
export function reiniciar() {
  acervo.clear();
}
