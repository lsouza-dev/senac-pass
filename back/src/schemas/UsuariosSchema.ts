import * as z from 'zod'

export const selectFields = {
  id_usuario:true,
  nome      :true,
  email     :true,
  senha     :false,
  cpf       :true,
  ativo     :true,
  id_perfil :true,
  ingressos :true
}

export const usuarioCriacaoSchema = z.object({
  nome: z.string('nome obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres'),
  cpf: z.string('cpf obrigatório.').max(11,'O cpf deve ter no máximo 11 caracteres'),
  email: z.string('email obrigatório.').max(255,'O email deve ter no máximo 255 caracteres'),
  senha: z.string('senha obrigatório.').max(255,'O senha deve ter no máximo 255 caracteres'),
  id_perfil: z.int('id_perfil deve ser um número inteiro positivo.')
})

export const usuarioAtualizacaoSchema = z.object({
  nome: z.string().nonempty('nome obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres').optional(),
  email: z.string().nonempty('email obrigatório.').max(255,'O email deve ter no máximo 255 caracteres').optional(),
  senha: z.string().nonempty('senha obrigatório.').max(255,'O senha deve ter no máximo 255 caracteres').optional(),
  id_perfil: z.int().positive('id_perfil deve ser um número inteiro positivo.').optional(),
  ativo: z.boolean('ativo deve ser um valor boleano [Verdadeiro ou Falso]').optional()
})

export type UsuarioCriacaoDTO = z.infer<typeof usuarioCriacaoSchema>
export type UsuarioAtualizacaoDTO = z.infer<typeof usuarioAtualizacaoSchema>