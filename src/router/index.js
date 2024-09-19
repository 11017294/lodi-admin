import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * 注意:子菜单只在路由子菜单时出现。长度 >= 1
 * 具体事项请查看: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有设置alwaysShow，当item有多个子路由时，它将变成嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置了noRedirect，则不会在breadcrumb中重定向
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     控制页面角色(可以设置多个角色)
    title: 'title'                名称显示在侧边栏和面包屑中(推荐设置)
    icon: 'svg-name'/'el-icon-x'  图标显示在侧边栏中
    breadcrumb: false             如果设置为false，则条目将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'   如果设置了路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页，所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }
]

/**
 * 异步路由
 * 根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Article',
        component: () => import('@/views/article/article'),
        meta: { title: '文章管理', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    meta: { title: '链接', icon: 'link' },
    children: [
      {
        path: 'http://www.bigchen.icu/',
        meta: { title: '博客', icon: 'link' }
      },
      {
        path: 'https://github.com/11017294',
        meta: { title: 'github', icon: 'link' }
      },
      {
        path: 'https://gitee.com/MaybeBin',
        meta: { title: 'gitee', icon: 'link' }
      }
    ]
  },

  // 404页面必须放在最后 !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
