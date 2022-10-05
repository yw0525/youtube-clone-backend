import { Context } from 'egg'
import { JwtPayload } from 'jsonwebtoken'

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      // 1. get reuest headers token
      let token = ctx.headers.authorization as string | null

      token = token ? token.split('Bearer ')[1] : null

      // 2. verify
      if (!token) {
        ctx.throw(401)
      }

      try {
        // 3. cache user info
        const data = ctx.service.user.verifyToken(token) as JwtPayload

        if (data.userId) {
          ctx.user = await ctx.model.User.findById(data.userId)
        } else {
          ctx.throw(401)
        }
      } catch (error) {
        ctx.throw(401)
      }

      // 4. next
      await next()
    } catch (err: any) {
      const { app } = ctx

      app.emit('error', err, ctx)

      const status = err.status || 500

      const error =
        status === 500 && app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message

      ctx.body = { error }

      if (status === 422) {
        ctx.body.detail = err.errors
      }

      ctx.status = status
    }
  }
}
