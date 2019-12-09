import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 30000 // 请求超时时间
})

const err = (error) => {
  notification.error({
    message: '错误',
    description: '系统发生异常: ' + error.message
  })
  return Promise.reject({ msg: error.message, code: -1 })
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const res = response.data
  // response里面有token，表示需要刷新token
  const { refresh_token, token_header } = response.headers
  if (refresh_token) {
    const token = token_header + refresh_token
    store.dispatch('RefreshToken', token)
  }

  if (res.code === 200) {
    return response.data
  }
  // 1003:登录超时
  if (res.code === 1003 || res.code === 403) {
    notification.warning({
      message: '重新登录',
      description: '登录已失效，请重新登录'
    })
    store.dispatch('Logout').then(() => {
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
  } else {
    notification.error({
      message: '错误',
      description: '请求错误: ' + res.msg
    })
  }
  return Promise.reject({ msg: res.msg, code: res.code })
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

// export default service
export function request (data) {
  return service(data)
}

export function get (url, params) {
  return request({
    url: url,
    params: params,
    method: 'get'
  })
}

export function post (url, params) {
  return request({
    url: url,
    data: params,
    method: 'post'
  })
}

export {
  installer as VueAxios,
  service as axios
}
