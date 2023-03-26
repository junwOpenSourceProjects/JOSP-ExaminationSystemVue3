/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const examinationSystemRouter = {
  path: '/examinationSystemTable',
  component: Layout,
  redirect: '/examinationSystemTable/testTable',
  name: 'examinationSystemTable',
  meta: {
    title: '页面sample',
    icon: 'table'
  },
  children: [
    {
      path: 'testTable',
      component: () => import('@/views/examinationSystemTable/testTable'),
      name: 'testTable',
      meta: { title: '测试表' }
    },
        {
      path: 'queryNationLineTable',
      component: () => import('@/views/examinationSystemTable/queryNationLineTable.vue'),
      name: 'queryNationLineTable',
      meta: { title: '查询国家线' }
    },

    {
      path: 'queryAllTable',
      component: () => import('@/views/examinationSystemTable/queryAllTable.vue'),
      name: 'queryAllTable',
      meta: { title: '查询所有复试人员' }
    },
    {
      path: 'QueryCollegeTable',
      component: () => import('@/views/examinationSystemTable/queryCollegeTable.vue'),
      name: 'QueryCollegeTable',
      meta: { title: '学院名称' }
    },
            {
      path: 'queryAcademyLineTable',
      component: () => import('@/views/examinationSystemTable/queryAcademyLineTable.vue'),
      name: 'queryAcademyLineTable',
      meta: { title: '查询院线' }
    },
      {
      path: 'queryAcademyGenerateScoreTable',
      component: () => import('@/views/examinationSystemTable/queryAcademyGenerateScoreTable.vue'),
      name: 'queryAcademyGenerateScoreTable',
      meta: { title: '查询院线均分' }
    },
    {
      path: 'queryCollegeLineTable',
      component: () => import('@/views/examinationSystemTable/queryCollegeLineTable.vue'),
      name: 'queryCollegeLineTable',
      meta: { title: '查询校线' }
    },

  ]
}
export default examinationSystemRouter
