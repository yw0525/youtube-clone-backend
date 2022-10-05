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

    const userService = this.service.user
    const { username, email } = ctx.request.body

    // 2. data validate
    if (await userService.findByUsername(username)) {
      ctx.throw(422, '用户已存在')
    }
    if (await userService.findByEmail(email)) {
      ctx.throw(422, '邮箱已存在')
    }

    // 3. create user
    const user = await userService.createUser(ctx.request.body)

    // 4. generate token
    const token = userService.createToken({
      userId: user._id
    })

    // 5. send response
    ctx.body = {
      user: {
        email: user.email,
        token,
        username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}
