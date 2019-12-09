// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const devRouterMap = [

  {
    path: '/question',
    name: 'question',
    component: PageView,
    redirect: '/account',
    meta: { title: '题库', icon: 'setting' },
    children: [
      {
        path: '/question',
        name: 'question',
        component: () => import('@/views/question/List'),
        meta: { title: '题库列表', icon: 'user' }
      },
      {
        path: '/question/add',
        name: 'questionAdd',
        hidden: true,
        component: () => import('@/views/question/Add'),
        meta: { title: '导入试题' }
      },
      {
        path: '/question/BatchAdd',
        name: 'BatchAdd',
        hidden: true,
        component: () => import('@/views/question/BatchAdd'),
        meta: { title: '批量上传' }
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
]

