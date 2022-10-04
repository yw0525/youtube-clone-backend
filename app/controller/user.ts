import { Controller } from 'egg'

export default class UserController extends Controller {
  public async create() {
    const { ctx } = this

    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' }
    })

    ctx.body = await ctx.service.user.create('egg')
  }
}
