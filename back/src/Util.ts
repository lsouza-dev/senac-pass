import { FastifyInstance, FastifyReply } from "fastify";
import {PrismaClient} from './generated/prisma/index'
import {selectFields} from './schemas/UsuariosSchema'


export function verificarIdRequisicao(id:string,reply:FastifyReply){
  const idConvertido = Number(id)
  if(Number.isNaN(idConvertido)  ||  !Number.isInteger(Number(idConvertido)))
    return reply.status(400).send(mensagemPadrao(false,'Insira uma chave única válida para fazer a busca pelo registro.'))
} 


export function veirificarResultZod(result,reply:FastifyReply){
  if(!result.success)
      return reply.status(400).send(mensagemPadrao(false,'Campos inválidos',null,result.error.issues.map(err => err.message)))
}

export function mensagemPadrao(success: boolean, message: string,data:any = null,campos:string[] = []) {
  return campos.length != 0 ? {
    'succes': success,
    'message':message,
    'campos':campos,
  } :
  {
    'succes': success,
    'message':message,
    'data':data,
  } 
}

export function verificarCorpoRequisicao(req,reply:FastifyReply){
  if(req.body == null)
      return reply.status(400).send(mensagemPadrao(false,'É necessário enviar um corpo para fazer a requisição.',null))
}



export async function obterUsuarioPorChavesUnicas(id:string='',cpf:string='',email:string='',prisma:PrismaClient,reply:FastifyReply){
  const usuarios =  await prisma.usuarios.findFirst({
    where: {
      OR: [
        {
          AND: {
            id_usuario:Number(id)
          }
        },
        {
          AND: {
            email:email
          }
        },
        {
          AND: {
            cpf:cpf
          }
        },
      ]
    },
    select:selectFields
  })

  if(usuarios == null)
    return reply.status(404).send(mensagemPadrao(true,'Nenhum registro encontrado com os dados informados',null))

  return usuarios
}