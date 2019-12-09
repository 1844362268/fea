import { post, get } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return post('/auth/login', parameter)
}

export function getInfo () {
  return get('/user/info')
}

export function logout () {
  return post('/auth/logout')
}
