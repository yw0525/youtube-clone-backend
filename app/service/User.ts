import { Service } from 'egg'

export default class User extends Service {
  public async create(name: string) {
    return `hi, ${name}`
  }
}
