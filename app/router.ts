import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.prefix('/api/v1')

  router.get('/', controller.home.index)

  router.post('/users/create', controller.user.create)
  router.post('/users/login', controller.user.login)
}
