import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 无需登录白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 通过getInfo判断用户是否获得了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 角色必须是一个对象数组!例如:['admin']或['developer', 'editor']
          const { userRole } = await store.dispatch('user/getInfo')
          const roles = [userRole]

          // 根据角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // 当replace为true时导航不会留下历史记录
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        } catch (error) {
          // 删除令牌并跳转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
