import { post, get } from '@/utils/request'

export default class RoleApi {
  static getList () {
    return get('/role/list')
  }

  static getPages (params) {
    return get('/role', params)
  }

  static add (params) {
    return post('/role/add', params)
  }

  static update (params) {
    return post('/role/update', params)
  }

  static delete (id) {
    return post('/role/delete', { id })
  }

  static grant(params) {
    return post('/role/grant', params)
  }
}