// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { devRouterMap } from '@/config/dev-router.config'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '首页', keepAlive: true, icon: 'home' }
      },
      {
        path: '/system',
        name: 'system',
        component: PageView,
        redirect: '/account',
        meta: { title: '系统管理', icon: 'setting' },
        children: [
          {
            path: '/account',
            name: 'account',
            component: () => import('@/views/system/account/List'),
            meta: { title: '用户管理', icon: 'user' }
          },
          {
            path: '/account/add',
            name: 'accountAdd',
            hidden: true,
            component: () => import('@/views/system/account/Add'),
            meta: { title: '新建用户' }
          },
          {
            path: '/role',
            name: 'role',
            component: () => import('@/views/system/role/List'),
            meta: { title: '角色管理', icon: 'usergroup-add', permission: ['role'] }
          },
          {
            path: '/permission',
            name: 'permission',
            component: () => import('@/views/system/permission/List'),
            meta: {
              title: '权限管理', keepAlive: true, icon: 'safety-certificate', permission: ['form']
            }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/other/result/Success'),
            meta: {
              title: '成功',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result']
            }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/other/result/Error'),
            meta: {
              title: '失败',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result']
            }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/other/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/other/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/other/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      },
      // other
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: ['dashboard'] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: {
              title: 'IconSelector',
              icon: 'tool',
              keepAlive: true,
              permission: ['dashboard']
            }
          }
        ]
      },
      ...devRouterMap
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/other/exception/404')
  }

]
