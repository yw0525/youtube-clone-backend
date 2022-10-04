import { Context } from 'egg'

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
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
