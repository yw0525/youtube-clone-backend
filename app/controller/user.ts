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
        token,
        username,
        ...ctx.helper.pick(user, [
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ])
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
        token,
        username,
        ...ctx.helper.pick(user, [
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ])
      }
    }
  }

  public async getCurrentUser() {
    const { ctx } = this

    ctx.body = {
      user: {
        token: ctx.header.authorization,
        ...ctx.helper.pick(ctx.user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ])
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
        token: this.ctx.header.authorization,
        ...ctx.helper.pick(user, [
          'username',
          'email',
          'password',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ])
      }
    }
  }

  public async subscribe() {
    const { ctx } = this

    const userId = ctx.user._id
    const channelId = ctx.params.userId

    // 1. validate
    if (userId.equals(channelId)) {
      ctx.throw(422, '用户不能订阅自己')
    }

    // 2. subscribe
    const user = await this.service.user.subscribe(userId, channelId)

    // 3. send response
    ctx.body = {
      user: {
        ...ctx.helper.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ]),
        isSubscribe: true
      }
    }
  }

  public async unsubscribe() {
    const { ctx } = this

    const userId = ctx.user._id
    const channelId = ctx.params.userId

    // 1. validate
    if (userId.equals(channelId)) {
      ctx.throw(422, '用户不能订阅自己')
    }

    // 2. unsubscribe
    const user = await this.service.user.unsubscribe(userId, channelId)

    // 3. send response
    ctx.body = {
      user: {
        ...ctx.helper.pick(user, [
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount'
        ]),
        isSubscribe: false
      }
    }
  }
}
