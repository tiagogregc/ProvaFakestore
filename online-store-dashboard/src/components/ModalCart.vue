<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <button @click="closeModal" class="close-button">X</button>
      <h2>Detalhes do Pedido</h2>
      <div v-if="cart.products && cart.products.length">
        <h3>Pedido ID: {{ cart.id }}</h3>
        <p><strong>Data:</strong> {{ cart.date }}</p>
        <p><strong>Status:</strong> {{ cart.status || 'Pendente' }}</p>
        <p><strong>Vendedor:</strong> {{ vendorName }}</p> <!-- Exibindo o vendedor -->

        <table class="order-table">
          <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in cart.products" :key="index">
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <button @click="closeModal">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalCart",
  props: {
    cart: {
      type: Object,
      required: true,
    },
    user: {  // Prop para o usuário, incluindo o vendedor
      type: Object,
      required: true,
    },
  },
  computed: {
    // Obtendo o nome do vendedor através do user_id
    vendorName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close"); // Emite evento para fechar o modal
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  padding: 20px;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th, .order-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.order-table th {
  background-color: #f4f4f4;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>