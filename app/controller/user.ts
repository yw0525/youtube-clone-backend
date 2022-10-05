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

  public async login() {
    const { ctx } = this
    const { body } = ctx.request

    // 1. params validate
    ctx.validate(
      {
        email: { type: 'email' },
        password: { type: 'string' }
      },
      body
    )

    const userService = this.service.user
    const { username, email, password } = body

    // 2. data validate
    const user = await userService.findByEmail(email)

    if (!user) {
      ctx.throw(422, '用户不存在')
    }

    if (ctx.helper.md5(password) !== user.password) {
      ctx.throw(422, '密码不正确')
    }

    // 3. generate token
    const token = userService.createToken({
      userId: user._id
    })

    // 4. send response
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

  public async getCurrentUser() {
    const { email, username, channelDescription, avatar } = this.ctx.user

    this.ctx.body = {
      user: {
        email,
        token: this.ctx.header.authorization,
        username,
        channelDescription,
        avatar
      }
    }
  }

  public async update() {
    const { ctx } = this
    const { body } = ctx.request

    // 1. params validate
    ctx.validate(
      {
        email: { type: 'email', required: false },
        username: { type: 'string', required: false },
        password: { type: 'string', required: false },
        channelDescription: { type: 'string', required: false },
        avatar: { type: 'string', required: false }
      },
      body
    )

    const userService = this.service.user
    const { username, email, password } = ctx.request.body

    // 2. data validate
    if (username) {
      if (
        username !== ctx.user.username &&
        (await userService.findByUsername(username))
      ) {
        ctx.throw(422, '用户已存在')
      }
    }
    if (email) {
      if (email !== ctx.user.email && (await userService.findByEmail(email))) {
        ctx.throw(422, '邮箱已存在')
      }
    }
    if (password) {
      body.password = ctx.helper.md5(password)
    }

    // 3. update userinfo
    const user = await userService.updateUser(body)

    // 4. send response
    this.ctx.body = {
      user: {
        email: user.email,
        password: user.password,
        token: this.ctx.header.authorization,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}
