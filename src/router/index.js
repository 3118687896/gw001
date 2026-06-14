import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ShoppingCart from '../views/ShoppingCart.vue'
import OrderList from '../views/OrderList.vue'
import Login from '../views/Login.vue'
import AddressList from '../views/AddressList.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/products',
        name: 'ProductList',
        component: ProductList
    },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true
    },
    {
        path: '/cart',
        name: 'ShoppingCart',
        component: ShoppingCart
    },
    {
        path: '/orders',
        name: 'OrderList',
        component: OrderList
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/addresses',
        name: 'AddressList',
        component: AddressList
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router