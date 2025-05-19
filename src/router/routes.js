const routes = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue'),
  },
  {
    path: '/incluir',
    component: () => import('src/pages/IncluirPage.vue'),
    children: [
      {
        path: '',
        name: 'incluir',
        component: () => import('src/pages/IncluirPage.vue'),
      },
      {
        path: ':nota',
        name: 'alterar',
        component: () => import('src/pages/IncluirPage.vue'),
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
