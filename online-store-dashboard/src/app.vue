<template>
  <div id="app">
    <!-- Barra de navegação visível apenas se autenticado -->
    <nav v-if="isAuthenticated" class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-item">Dashboard</router-link>
        <router-link to="/Products" class="navbar-item">Produtos</router-link>
        <router-link to="/Orders" class="navbar-item">Pedidos</router-link>
        <router-link to="/Users" class="navbar-item">Usuários</router-link>
        <button @click="logout" class="navbar-item logout-button">Logout</button>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <router-view />  <!-- Carrega o conteúdo da rota -->
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    // Usar Vuex para verificar se o usuário está autenticado
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      // Remove o token do localStorage
      localStorage.removeItem("authToken");

      // Atualiza o estado de autenticação no Vuex
      this.$store.commit("setAuthToken", null);

      // Redireciona para a página de login
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Estilos da navbar e conteúdo */
.navbar {
  background-color: #333;
  padding: 1rem;
}

.navbar-item {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

.logout-button {
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

.main-content {
  padding: 20px;
}
</style>