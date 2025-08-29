import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { usuariosRoutes } from './routes/UsuariosRoutes'

(BigInt.prototype as any).toJSON = function(){
  return Number(this)
}

const server = fastify()
server.register(fastifyCors,
  {
    origin:"*",
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
  }
)


server.register(usuariosRoutes,{
  prefix:'/api/usuarios'
})
server.listen({port:3333}).then(() => console.log("Servidor em execução:\nhttp://localhost:3333/"))