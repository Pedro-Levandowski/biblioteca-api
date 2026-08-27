import * as servico from '../servicos/autores-servico.js';
import { enviarJson } from '../comum/respostas.js';

export function listar({ res, consulta }) {
  const autores = servico.listar({
    nome: consulta.get('nome'),
    nacionalidade: consulta.get('nacionalidade'),
  });
  enviarJson(res, 200, autores);
}

export function buscarPorId({ res, parametros }) {
  enviarJson(res, 200, servico.buscarPorId(parametros.id));
}

export function criar({ res, corpo }) {
  enviarJson(res, 201, servico.criar(corpo));
}

export function atualizar({ res, parametros, corpo }) {
  enviarJson(res, 200, servico.atualizar(parametros.id, corpo));
}

export function remover({ res, parametros }) {
  servico.remover(parametros.id);
  enviarJson(res, 204, null);
}
