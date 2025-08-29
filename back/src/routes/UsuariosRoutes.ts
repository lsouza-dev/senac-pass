import {FastifyInstance} from 'fastify'
import { atualizarUsuario, criarUsuario, deletarUsuario, detalharUsuario, obterUsuarios } from '../controller/UsuarioController'


export async function usuariosRoutes(server:FastifyInstance){
  server.get('',obterUsuarios)
  server.get('/:idUsuario',detalharUsuario)
  server.post('',criarUsuario)
  server.put('/:idUsuario',atualizarUsuario)
  server.delete('/:idUsuario',deletarUsuario)
}