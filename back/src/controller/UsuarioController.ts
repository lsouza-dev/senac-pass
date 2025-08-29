import { FastifyReply, FastifyRequest } from "fastify";
import {mensagemPadrao, obterUsuarioPorChavesUnicas, veirificarResultZod, verificarCorpoRequisicao, verificarIdRequisicao} from '../Util'
import { selectFields, UsuarioAtualizacaoDTO, usuarioAtualizacaoSchema, UsuarioCriacaoDTO, usuarioCriacaoSchema } from "../schemas/UsuariosSchema";
import { PrismaClient } from "../generated/prisma";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function obterUsuarios(req:FastifyRequest,reply:FastifyReply) {
  try{
        const usuarios = await prisma.usuarios.findMany({select:selectFields})
        reply.status(200).send(mensagemPadrao(true,'Usuários encontrados',usuarios))
  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message,null))
  }
}





export async function detalharUsuario(req:FastifyRequest<{Params:{idUsuario:string}}>,reply:FastifyReply) {
  try{
      verificarIdRequisicao(req.params.idUsuario,reply)

      const usuario = await obterUsuarioPorChavesUnicas(req.params.idUsuario,'','',prisma,reply)
      return reply.status(200).send(mensagemPadrao(true,'Usuário encontrado',usuario))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message,null))
  }
}







export async function criarUsuario(req:FastifyRequest<{Body:UsuarioCriacaoDTO}>,reply:FastifyReply) {
  try{
    await verificarCorpoRequisicao(req,reply)
    const result = await usuarioCriacaoSchema.safeParse(req.body)
    await veirificarResultZod(result,reply)
    
    result.data!.senha = await bcrypt.hash(result.data?.senha,12);

    if(result.data){
      const usuarioCriado = await prisma.usuarios.create({
      data:result.data,
        select:selectFields
      })
  
      return reply.status(201).send(mensagemPadrao(true,'Usuário criado com sucesso!',usuarioCriado))
    }

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message,null))
  }
}






export async function atualizarUsuario(req:FastifyRequest<{Body:UsuarioAtualizacaoDTO,Params: {idUsuario:string}}>,reply:FastifyReply) {
  try{
       verificarIdRequisicao(req.params.idUsuario,reply)
      await verificarCorpoRequisicao(req,reply)
      const result = await usuarioAtualizacaoSchema.safeParse(req.body)
      await veirificarResultZod(result,reply)
      const usuarioEncontrado = await obterUsuarioPorChavesUnicas(req.params.idUsuario,'','',prisma,reply)
      if(result.data?.senha)
          result.data.senha = await bcrypt.hash(result.data.senha,12)
        
      const usuarioAtualizado = await prisma.usuarios.update({
        where:{id_usuario: usuarioEncontrado.id_usuario},
        data:{
          nome:result.data?.nome,
          email:result.data?.email,
          senha:result.data?.senha,
          id_perfil:result.data?.id_perfil,
          ativo:result.data?.ativo
        },
        select:selectFields
      })

      return reply.status(200).send(mensagemPadrao(true,'Usuário atualizado com sucesso!',usuarioAtualizado))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message,null))
  }
}




export async function deletarUsuario(req:FastifyRequest<{Params:{idUsuario}}>,reply:FastifyReply) {
  try{
      await verificarIdRequisicao(req.params.idUsuario,reply)
      const usuario = await obterUsuarioPorChavesUnicas(req.params.idUsuario,'','',prisma,reply)
      await prisma.usuarios.delete({
        where:{id_usuario:usuario.id_usuario}
      })

      return reply.status(204).send(mensagemPadrao(true,'Usuário deletado com sucesso!',null))
  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message,null))
  }
}