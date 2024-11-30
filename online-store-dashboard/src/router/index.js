import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/DashboardPage.vue';
import Products from '../views/ProductList.vue';
import Orders from '../views/OrdersList.vue';
import Users from '../views/UserList.vue';
import Login from '../views/UserLogin.vue';

// Defina as rotas do aplicativo
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }, // Necessita autenticação
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: { requiresAuth: true }, // Necessita autenticação
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders,
        meta: { requiresAuth: true }, // Necessita autenticação
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: { requiresAuth: true }, // Necessita autenticação
    },
];

// Criação do router
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Adicione o "beforeEach" para proteger rotas
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Verifica se o token está armazenado

    // Se a rota requer autenticação e o usuário não está autenticado, redireciona para login
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && isAuthenticated) {
        // Se o usuário estiver autenticado e tentar acessar a página de login, redireciona para o Dashboard
        next({ name: 'Dashboard' });
    } else {
        next(); // Permite a navegação se o usuário estiver autenticado ou a rota não precisar de autenticação
    }
});

export default router;