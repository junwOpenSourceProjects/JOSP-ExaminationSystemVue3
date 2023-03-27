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
      path: 'QueryReviewListMaxismTable',
      component: () => import('@/views/examinationSystemTable/queryReviewListMaxismTable.vue'),
      name: 'QueryReviewListMaxismTable',
      meta: {title: '马院复试名单-完成'}
    },
    {
      path: 'queryReviewListAllTable',
      component: () => import('@/views/examinationSystemTable/queryReviewListAllTable.vue'),
      name: 'queryReviewListAllTable',
      meta: {title: '所有学院复试名单'}
    },
    {
      path: 'queryNationLineTable',
      component: () => import('@/views/examinationSystemTable/queryNationLineTable.vue'),
      name: 'queryNationLineTable',
      meta: {title: '查询国家线-完成'}
    },
    {
      path: 'queryCollegeLineTable',
      component: () => import('@/views/examinationSystemTable/queryCollegeLineTable.vue'),
      name: 'queryCollegeLineTable',
      meta: {title: '查询校线-完成'}
    },
    {
      path: 'queryAcademyLineTable',
      component: () => import('@/views/examinationSystemTable/queryAcademyLineTable.vue'),
      name: 'queryAcademyLineTable',
      meta: {title: '查询院线-手动添加'}
    }, {
      path: 'addAcademyLine',
      component: () => import('@/views/examinationSystemTable/addAcademyLine.vue'),
      name: 'addAcademyLine',
      meta: {title: '新增院线'}
    },
    {
      path: 'queryAcademyGenerateScoreTable',
      component: () => import('@/views/examinationSystemTable/queryAcademyGenerateScoreTable.vue'),
      name: 'queryAcademyGenerateScoreTable',
      meta: {title: '查询院线均分-自动计算'}
    },
    {
      path: 'QueryCollegeTable',
      component: () => import('@/views/examinationSystemTable/queryCollegeTable.vue'),
      name: 'QueryCollegeTable',
      meta: {title: '学院名称-完成'}
    },
  ]
}
export default examinationSystemRouter
