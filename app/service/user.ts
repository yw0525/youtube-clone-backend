import { Service } from 'egg'
import jwt from 'jsonwebtoken'

export default class UserService extends Service {
  get User() {
    return this.app.model.User
  }

  findByUsername(username: string) {
    return this.User.findOne({
      username
    })
  }

  findByEmail(email: string) {
    return this.User.findOne({
      email
    }).select('+password')
  }

  async createUser(data: any) {
    data.password = this.ctx.helper.md5(data.password)

    const user = new this.User(data)

    await user.save()

    return user
  }

  createToken(data: any) {
    const { secret, expiresIn } = this.app.config.jwt

    return jwt.sign(data, secret, { expiresIn })
  }

  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret)
  }

  async updateUser(data: any) {
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, { new: true })
  }

  async subscribe(userId: string, channelId: string) {
    const { Subscription, User } = this.app.model

    // 1. check if subscribed
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId
    })

    const user = await User.findById(channelId)

    if (!record) {
      // 2. subscribe
      await new Subscription({
        user: userId,
        channel: channelId
      }).save()

      // 3. update userinfo
      user.subscribersCount++
      await user.save()
    }

    // 4. send userinfo
    return user
  }
}
