<template>
  <div class="container">
    <table>
      <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name.firstname }} {{ user.name.lastname }}</td>
        <td>{{ user.email }}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-blue" @click="editUser(user)">Editar</button>
            <button class="btn btn-red" @click="deleteUser(user.id)">Excluir</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      users: (state) => state.users, // Acessando os usuários da Vuex Store
    }),
  },
  methods: {
    deleteUser(userId) {
      this.$store.dispatch('removeUser', userId); // Ação para remover o usuário
    },
    editUser(user) {
      this.$emit('editUser', user); // Emite evento para editar o usuário
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
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

.action-buttons {
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
</style>