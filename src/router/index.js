import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login/index.vue')
    },
    {
        path: '/category',
        name: 'category',
        component: () => import('@/views/Category/index.vue')
    },
    {
        path: '/category-detail/:categoryId',
        name: 'category-detail',
        component: () => import('@/views/CategoryDetail/index.vue'),
        props: true
    },
    {
        path: '/order-detail',
        name: 'order-detail',
        component: () => import('@/views/OrderDetail/index.vue'),
        props: true,
        meta: { requireAuth: true }
    },
    {
        path: '/product/:productId',
        name: 'product',
        component: () => import('@/views/Product/index.vue'),
        props: true
    },
    {
        path: '/comments/:productId',
        name: 'comments',
        component: () => import('@/views/Comments/index.vue'),
        props: true
    },
    {
        path: '/order',
        name: 'order',
        component: () => import('@/views/Order/index.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/pay',
        name: 'pay',
        component: () => import('@/views/Pay/index.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/Cart/index.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('@/views/User/index.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/Search/index.vue')
    },
    {
        path: '/recommend',
        name: 'recommend',
        component: () => import('@/views/Recommend/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

import store from '../store'

router.beforeEach(to => {

    if (!to.meta.requireAuth) return true

    if (!store.state.user.token || !window.localStorage.getItem('USER_TOKEN')) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        }
    }
})

export default router
