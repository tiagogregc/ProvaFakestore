<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <input
            v-model="username"
            placeholder="Usuário"
            required
            class="input-field"
        />
      </div>
      <div class="form-group">
        <input
            v-model="password"
            type="password"
            placeholder="Senha"
            required
            class="input-field"
        />
      </div>
      <button type="submit" class="login-button">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "UserLogin",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      // Verificar se o usuário está no localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
          (user) => user.username === this.username && user.password === this.password
      );

      if (user) {
        // Usuário encontrado no localStorage, login bem-sucedido
        const token = "fake-token"; // O token fictício, pois a autenticação real é feita sem a API

        // Armazena o token no localStorage
        localStorage.setItem("authToken", token);

        // Atualiza o token no Vuex
        this.$store.commit("setAuthToken", token);

        // Redireciona para a página inicial
        this.$router.push("/");

      } else {
        // Caso o usuário não seja encontrado no localStorage, tentamos fazer o login com a API
        try {
          const response = await this.$axios.post(
              "https://fakestoreapi.com/auth/login",
              {
                username: this.username,
                password: this.password,
              }
          );

          if (response.data && response.data.token) {
            // Armazena o token para uso futuro
            localStorage.setItem("authToken", response.data.token);

            // Atualiza o token no Vuex
            this.$store.commit("setAuthToken", response.data.token);

            // Atualiza os usuários após login
            await this.$store.dispatch("fetchUsers");

            // Redireciona o usuário para a página inicial
            this.$router.push("/");
          } else {
            this.errorMessage = "Credenciais inválidas. Tente novamente.";
          }
        } catch (error) {
          console.error("Erro no login:", error);
          this.errorMessage =
              "Erro ao fazer login. Verifique suas credenciais ou tente novamente mais tarde.";
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilos do formulário */
.container {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>