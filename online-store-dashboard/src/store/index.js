import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        products: JSON.parse(localStorage.getItem('products')) || [],
        orders: JSON.parse(localStorage.getItem('orders')) || [],  // Carrega os pedidos do localStorage
        users: JSON.parse(localStorage.getItem('users')) || [],
        authToken: localStorage.getItem('authToken') || null,
    },
    mutations: {
        // Mutações para os produtos
        setProducts(state, products) {
            state.products = products;
            localStorage.setItem('products', JSON.stringify(products));
        },
        addProduct(state, product) {
            state.products.push(product);
            localStorage.setItem('products', JSON.stringify(state.products));
        },
        removeProduct(state, productId) {
            state.products = state.products.filter(product => product.id !== productId);
            localStorage.setItem('products', JSON.stringify(state.products));
        },
        updateProduct(state, updatedProduct) {
            const index = state.products.findIndex(product => product.id === updatedProduct.id);
            if (index !== -1) {
                state.products.splice(index, 1, updatedProduct);
                localStorage.setItem('products', JSON.stringify(state.products));
            }
        },

        // Mutações para os pedidos
        setOrders(state, orders) {
            state.orders = orders;
            localStorage.setItem('orders', JSON.stringify(orders)); // Persiste os pedidos no localStorage
        },
        addOrder(state, order) {
            state.orders.push(order);
            localStorage.setItem('orders', JSON.stringify(state.orders));
        },
        removeOrder(state, orderId) {
            console.log("Removendo pedido com ID:", orderId); // Log para depuração
            state.orders = state.orders.filter(order => order.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(state.orders));
            console.log("Pedidos atualizados:", state.orders); // Log para depuração
        },
        updateOrder(state, updatedOrder) {
            const index = state.orders.findIndex(order => order.id === updatedOrder.id);
            if (index !== -1) {
                state.orders.splice(index, 1, updatedOrder);
                localStorage.setItem('orders', JSON.stringify(state.orders));
            }
        },

        // Mutações para os usuários
        setUsers(state, users) {
            state.users = users;
            localStorage.setItem('users', JSON.stringify(users));
        },
        addUser(state, user) {
            state.users.push(user);
            localStorage.setItem('users', JSON.stringify(state.users));
        },
        removeUser(state, userId) {
            state.users = state.users.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(state.users));
        },
        updateUser(state, updatedUser) {
            const index = state.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser);
                localStorage.setItem('users', JSON.stringify(state.users));
            }
        },

        // Mutações de autenticação
        setAuthToken(state, token) {
            state.authToken = token;
            if (token) {
                localStorage.setItem('authToken', token);
            } else {
                localStorage.removeItem('authToken');
            }
        },
    },
    actions: {
        // Ação para buscar produtos
        async fetchProducts({ commit }) {
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                commit('setProducts', response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        },

        // Ação para buscar pedidos
        async fetchOrders({ commit }) {
            try {
                const response = await axios.get('https://fakestoreapi.com/carts');
                commit('setOrders', response.data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        },

        // Ação para buscar detalhes de um pedido
        async fetchOrderDetails({ commit, state }, orderId) {
            try {
                const order = state.orders.find(order => order.id === orderId);
                if (!order) {
                    console.error('Pedido não encontrado.');
                    return;
                }

                // Enriquecer dados do pedido com informações de produtos e usuários
                const user = state.users.find(user => user.id === order.userId);
                const products = order.products.map(product => {
                    const productDetails = state.products.find(p => p.id === product.productId);
                    return {
                        productName: productDetails?.title || 'Produto desconhecido',
                        unitPrice: productDetails?.price || 0,
                        ...product,
                    };
                });

                const enrichedOrder = { ...order, user, products };
                commit('updateOrder', enrichedOrder);
            } catch (error) {
                console.error('Erro ao buscar detalhes do pedido:', error);
            }
        },

        // Ação para buscar usuários
        async fetchUsers({ commit }) {
            try {
                const response = await axios.get('https://fakestoreapi.com/users');
                commit('setUsers', response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        },

        // Ação de login
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('https://fakestoreapi.com/auth/login', credentials);
                commit('setAuthToken', response.data.token);
                alert('Login realizado com sucesso!');
            } catch (error) {
                console.error('Erro no login:', error);
            }
        },

        // Ação de logout
        logout({ commit }) {
            commit('setAuthToken', null);
            alert('Logout realizado com sucesso!');
        },

        // Ações de pedidos
        addOrder({ commit, state }, order) {
            const newOrder = {
                id: state.orders.length + 1,
                date: new Date().toISOString(),
                ...order,
            };
            commit('addOrder', newOrder);
        },
        removeOrder({ commit }, orderId) {
            commit('removeOrder', orderId); // Chama a mutação removeOrder
        },
        updateOrder({ commit }, updatedOrder) {
            commit('updateOrder', updatedOrder);
        },

        // Ações de produtos
        addProduct({ commit }, product) {
            commit('addProduct', product);
        },
        removeProduct({ commit }, productId) {
            commit('removeProduct', productId);
        },
        updateProduct({ commit }, updatedProduct) {
            commit('updateProduct', updatedProduct);
        },

        // Ações de usuários
        addUser({ commit }, user) {
            commit('addUser', user);
        },
        removeUser({ commit }, userId) {
            commit('removeUser', userId);
        },
        updateUser({ commit }, updatedUser) {
            commit('updateUser', updatedUser);
        },
    },
    getters: {
        isAuthenticated(state) {
            return !!state.authToken;
        },
        getAllProducts(state) {
            return state.products;
        },
        getProductById: (state) => (id) => {
            return state.products.find(product => product.id === id);
        },
        getAllOrders(state) {
            return state.orders;
        },
        getOrderById: (state) => (id) => {
            return state.orders.find(order => order.id === id);
        },
        getAllUsers(state) {
            return state.users;
        },
        getUserById: (state) => (id) => {
            return state.users.find(user => user.id === id);
        },
    },
});