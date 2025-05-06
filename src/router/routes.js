const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/incluir',
    component: () => import('layouts/IncluirLayout.vue'),
    children: [
      {
        path: '',
        name: 'incluir',
        component: () => import('pages/IndexPage.vue'), // página para criar nova nota
      },
      {
        path: ':id',
        name: 'alterar',
        component: () => import('pages/IndexPage.vue'), // mesma tela, mas com ID
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
