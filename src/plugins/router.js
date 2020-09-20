import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from "firebase";

Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../components/Login')
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('../components/Products'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/products/:id',
            name: 'product',
            component: () => import('../components/ProductInfo'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/users/',
            name: 'users',
            component: () => import('../components/Users'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/:catchAll(.*)', redirect:'/'
        }
    ]
});

router.beforeEach((to, from, next) => {
    console.log(!!firebase.auth().currentUser);
    if(to.matched.some(route => route.meta.requiresAuth) && !firebase.auth().currentUser) {
        next('/')
    } else {
        next()
    }
});

export default router



