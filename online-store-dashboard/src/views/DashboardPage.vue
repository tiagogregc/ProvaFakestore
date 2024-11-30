<template>
  <div class="container">
    <h2>Dashboard</h2>
    <div class="dashboard-overview">
      <p>Total de Produtos: {{ totalProducts }}</p>
      <p>Número de Categorias: {{ totalCategories }}</p>
      <p>Quantidade de Pedidos: {{ totalOrders }}</p>
      <p>Número Total de Usuários: {{ totalUsers }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardPage",
  computed: {
    // Obtém os dados do Vuex
    totalProducts() {
      return this.$store.state.products.length;
    },
    totalCategories() {
      // Contar o número de categorias únicas (assumindo que as categorias estão armazenadas no campo 'category' dos produtos)
      const categories = new Set(this.$store.state.products.map(product => product.category));
      return categories.size;
    },
    totalOrders() {
      return this.$store.state.orders.length;
    },
    totalUsers() {
      return this.$store.state.users.length;
    }
  },
  created() {
    // Você pode buscar os dados da API se necessário, mas como já temos os dados no Vuex, não precisamos fazer isso aqui.
    // Exemplo de como você faria isso se precisasse atualizar os dados:
    // this.fetchDashboardData();
  },
  methods: {
    // Se precisar de métodos para atualizar os dados (se não for pelo Vuex)
    async fetchDashboardData() {
      try {
        // Realizar as requisições para preencher a store, caso não tenha sido feito antes
        await Promise.all([
          this.$store.dispatch('fetchProducts'),
          this.$store.dispatch('fetchOrders'),
          this.$store.dispatch('fetchUsers')
        ]);
      } catch (error) {
        console.error('Erro ao carregar os dados do dashboard:', error);
        alert("Ocorreu um erro ao carregar os dados do dashboard.");
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.dashboard-overview {
  font-size: 18px;
  line-height: 1.6;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
