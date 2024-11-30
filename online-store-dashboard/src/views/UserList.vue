<template>
  <div class="container">
    <h2>Gestão de Usuários</h2>

    <!-- Formulário de Adicionar/Editar Usuários -->
    <div class="form-container">
      <h3 class="form-title">{{ editingUser ? "Editar Usuário" : "Adicionar Usuário" }}</h3>

      <form @submit.prevent="saveUser">
        <!-- Nome do Usuário -->
        <div class="form-group">
          <label for="user-firstname">Primeiro Nome</label>
          <input
              id="user-firstname"
              type="text"
              v-model="userForm.firstname"
              placeholder="Digite o primeiro nome"
              required
          />
        </div>

        <div class="form-group">
          <label for="user-lastname">Sobrenome</label>
          <input
              id="user-lastname"
              type="text"
              v-model="userForm.lastname"
              placeholder="Digite o sobrenome"
              required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="user-email">Email</label>
          <input
              id="user-email"
              type="email"
              v-model="userForm.email"
              placeholder="Digite o email"
              required
          />
        </div>

        <!-- Nome de Usuário -->
        <div class="form-group">
          <label for="user-username">Nome de Usuário</label>
          <input
              id="user-username"
              type="text"
              v-model="userForm.username"
              placeholder="Digite o nome de usuário"
              required
          />
        </div>

        <!-- Senha -->
        <div class="form-group">
          <label for="user-password">Senha</label>
          <input
              id="user-password"
              type="password"
              v-model="userForm.password"
              placeholder="Digite a senha"
              required
          />
        </div>

        <!-- Botões -->
        <div class="form-buttons">
          <button type="submit" class="btn btn-blue">
            {{ editingUser ? "Atualizar Usuário" : "Adicionar Usuário" }}
          </button>
          <button type="button" class="btn btn-red" @click="cancelEditing">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Tabela de Usuários -->
    <UserTable :users="users" @editUser="editUser" @deleteUser="deleteUser" />

  </div>
</template>

<script>
import { mapState } from 'vuex';
import UserTable from '@/components/UserTable.vue'; // Importando a tabela de usuários

export default {
  components: {
    UserTable,
  },
  data() {
    return {
      userForm: {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
      },
      editingUser: false,
      users: [],
    };
  },
  computed: {
    ...mapState({
      users: (state) => state.users, // Acessando os usuários da Vuex Store
    }),
  },
  methods: {
    fetchUsers() {
      this.users = this.$store.getters.getUsers; // Obtendo os usuários da store
    },
    deleteUser(userId) {
      this.$store.dispatch('removeUser', userId); // Ação para remover o usuário
      this.fetchUsers(); // Recarrega os usuários após exclusão
    },
    editUser(user) {
      this.userForm = {
        id: user.id,
        firstname: user.name.firstname,
        lastname: user.name.lastname,
        email: user.email,
        username: user.username,
        password: user.password
      }; // Preenche o formulário com os dados do usuário
      this.editingUser = true; // Ativa o modo de edição
    },
    saveUser() {
      const userData = {
        ...this.userForm,
        name: {
          firstname: this.userForm.firstname,
          lastname: this.userForm.lastname,
        },
      };

      if (this.editingUser) {
        this.$store.dispatch('updateUser', userData); // Atualiza o usuário
      } else {
        const newUser = { ...userData };
        newUser.id = Date.now(); // ID único temporário
        this.$store.dispatch('addUser', newUser); // Adiciona um novo usuário
      }

      this.cancelEditing();
      this.fetchUsers(); // Recarrega os usuários após salvar
    },
    cancelEditing() {
      this.userForm = {id: null, firstname: '', lastname: '', email: '', username: '', password: ''}; // Limpa o formulário
      this.editingUser = false; // Desativa o modo de edição
    },
  },
  mounted() {
    this.fetchUsers(); // Carrega os usuários ao montar o componente
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.form-container {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.form-title {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-blue {
  background-color: #007bff;
  color: #fff;
}

.btn-red {
  background-color: #dc3545;
  color: #fff;
}

.btn {
  min-width: 80px;
}

.btn:hover {
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-red {
  background-color: #dc3545;
  color: #fff;
}
</style>