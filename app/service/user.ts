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

  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password)

    const user = new this.User(data)

    await user.save()

    return user
  }

  createToken(data) {
    const { secret, expiresIn } = this.app.config.jwt

    return jwt.sign(data, secret, { expiresIn })
  }
}
