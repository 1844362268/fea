import { post, get } from '@/utils/request'

export default class AccountApi {
  static getAccounts (params) {
    return get('/user', params)
  }

  static getAccount (id) {
    return get('/user/detail', { id })
  }

  static addAccount (params) {
    return post('/user/add', params)
  }

  static updateAccount (params) {
    return post('/user/update', params)
  }

  static deleteAccount (id) {
    return post('/user/delete', { id })
  }
}

