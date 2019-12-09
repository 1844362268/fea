import { post, get } from '@/utils/request'

export default class QuestionApi {
  static getQuestions (params) {
    return get('/question', params)
  }

  static getQuestion (id) {
    return get('/question/detail', { id })
  }

  static addQuestion (params) {
    return post('/question/add', params)
  }

  static updateQuestion (params) {
    return post('/question/update', params)
  }

  static deleteQuestion (id) {
    return post('/question/delete', { id })
  }
}

