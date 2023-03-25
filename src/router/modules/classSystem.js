/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const classSystemRouter = {
  path: '/AmyselfPage',
  component: Layout,
  redirect: '/AmyselfPage/classSystem',
  // src/views/AmyselfPage/classSystem/class-system.vue
  name: 'classSystem',
  meta: {
    title: '历史页面',
    icon: 'table'
  },
  children: [
    {
      path: 'classSystem',
      component: () => import('@/views/AmyselfPage/classSystem/class-system.vue'),
      name: 'classSystem',
      meta: { title: 'classSystem' }
    },
    {
      path: 'companyPageTest',
      component: () => import('@/views/AmyselfPage/companyPageTest/company-page-test.vue'),
      name: 'companyPageTest',
      meta: { title: 'companyPageTest' }
    },
    {
      path: 'echartTestPage',
      component: () => import('@/views/AmyselfPage/echartTestPage/echart-test-page.vue'),
      name: 'echartTestPage',
      meta: { title: 'echartTestPage' }
    }, {
      path: 'st-info',
      component: () => import('@/views/AmyselfPage/infoChangeForm/st-info.vue'),
      name: 'st-info',
      meta: { title: 'st-info' }
    }, {
      path: 'teacher-info',
      component: () => import('@/views/AmyselfPage/infoChangeForm/teacher-info.vue'),
      name: 'teacher-info',
      meta: { title: 'teacher-info' }
    }, {
      path: 'lessonChargeDashboard',
      component: () => import('@/views/AmyselfPage/lessonChargeDashboard/lesson-charge-dashboard.vue'),
      name: 'lessonChargeDashboard',
      meta: { title: 'lessonChargeDashboard' }
    }, {
      path: 'st-register-form',
      component: () => import('@/views/AmyselfPage/registerForm/st-register-form.vue'),
      name: 'st-register-form',
      meta: { title: 'st-register-form' }
    }, {
      path: 'te-register-form',
      component: () => import('@/views/AmyselfPage/registerForm/te-register-form.vue'),
      name: 'te-register-form',
      meta: { title: 'te-register-form' }
    },
    {
      path: 'showScore',
      component: () => import('@/views/AmyselfPage/showScore/show-score.vue'),
      name: 'showScore',
      meta: { title: '查询分数，和外面的一样' }
    }, {
      path: 'videoListAchievements',
      component: () => import('@/views/AmyselfPage/videoListAchievements/video-list-achievements.vue'),
      name: 'videoListAchievements',
      meta: { title: 'videoListAchievements' }
    }, {
      path: 'videoListManage',
      component: () => import('@/views/AmyselfPage/videoListManage/video-list-manage.vue'),
      name: 'videoListManage',
      meta: { title: 'videoListManage' }
    }
  ]
}
export default classSystemRouter
