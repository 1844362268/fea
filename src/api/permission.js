import { post, get } from '@/utils/request'

export default class PermissionApi {
  static getTree (params) {
    return get('/permission/tree', params)
  }

  static getParent () {
    return get('/permission/parents')
  }

  static add (params) {
    return post('/permission/add', params)
  }

  static update (params) {
    return post('/permission/update', params)
  }

  static delete (id) {
    return post('/permission/delete', { id })
  }
}