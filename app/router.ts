import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const auth = app.middleware.auth()

  router.prefix('/api/v1')

  router.get('/', controller.home.index)

  router.post('/users/create', controller.user.create)
  router.post('/users/login', controller.user.login)
  router.get('/user', auth, controller.user.getCurrentUser)
  router.patch('/user', auth, controller.user.update)

  router.post('/users/:userId/subscribe', auth, controller.user.subscribe)
}
