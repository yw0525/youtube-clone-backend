import { Controller } from 'egg'

export default class UserController extends Controller {
  public async create() {
    const { ctx } = this

    // 1. params validate
    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' }
    })

    const { username, email } = ctx.request.body

    // 2. data validate
    if (await this.service.user.findByUsername(username)) {
      ctx.throw(422, '用户已存在')
    }
    if (await this.service.user.findByEmail(email)) {
      ctx.throw(422, '邮箱已存在')
    }

    // 3. create user
    const user = await ctx.service.user.createUser(ctx.request.body)

    // 4. send response
    ctx.body = {
      user: {
        email: user.email,
        // token
        username: username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}
