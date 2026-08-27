import * as controlador from '../controladores/autores-controlador.js';

export const rotasAutores = [
  { metodo: 'GET', padrao: /^\/autores$/, manipulador: controlador.listar },
  { metodo: 'GET', padrao: /^\/autores\/(?<id>[^/]+)$/, manipulador: controlador.buscarPorId },
  { metodo: 'POST', padrao: /^\/autores$/, manipulador: controlador.criar },
  { metodo: 'PUT', padrao: /^\/autores\/(?<id>[^/]+)$/, manipulador: controlador.atualizar },
  { metodo: 'DELETE', padrao: /^\/autores\/(?<id>[^/]+)$/, manipulador: controlador.remover },
];
