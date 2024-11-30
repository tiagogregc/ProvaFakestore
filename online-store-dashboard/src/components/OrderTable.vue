<template>
  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th class="centered" style="width: 120px;">ID</th> <!-- Ajusta a largura da coluna ID -->
        <th class="centered" style="width: 200px;">Data</th> <!-- Ajusta a largura da coluna Data -->
        <th class="centered" style="width: 180px;">Quantidade de Produtos</th> <!-- Ajusta a largura da coluna Quantidade de Produtos -->
        <th class="centered" style="width: 200px;">Valor Total do Pedido</th> <!-- Ajusta a largura da coluna Valor Total do Pedido -->
        <th class="centered" style="width: 300px;">Ações</th> <!-- Ajusta a largura da coluna Ações -->
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td class="centered">{{ order.id }}</td>
        <td class="centered">{{ formatDate(order.date) }}</td>
        <td class="centered">{{ calculateTotalQuantity(order) }}</td>
        <td class="centered">{{ formatCurrency(calculateOrderTotal(order.products)) }}</td>
        <td class="centered">
          <button class="edit-button" @click="viewOrder(order)">Editar</button>
          <button class="delete-button" @click="deleteOrder(order.id)">Excluir</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'OrderTable',
  props: {
    orders: {
      type: Array,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  },
  methods: {
    viewOrder(order) {
      if (order) {
        this.$emit('viewOrder', order);
      } else {
        console.error('Pedido não encontrado');
      }
    },
    calculateTotalQuantity(order) {
      if (!order.products) return 0;
      return order.products.reduce((total, item) => {
        return total + (item.quantity || 0);
      }, 0);
    },
    deleteOrder(orderId) {
      this.$emit('deleteOrder', orderId);
    },
    formatDate(dateString) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options).replace(',', ' -');
    },
    calculateOrderTotal(products) {
      if (!this.products || !products) {
        console.error('Lista de produtos não está definida');
        return 0;
      }
      return products.reduce((total, product) => {
        const productPrice = this.getProductPrice(product.productId);
        return total + (product.quantity * productPrice);
      }, 0);
    },
    getProductPrice(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.price : 0;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 1300px; /* Ajusta a largura total da tabela */
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  text-align: center; /* Centraliza o texto nas células */
}

th {
  background-color: #f4f4f4;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px; /* Aumenta o tamanho dos botões */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 5px; /* Espaço entre os botões */
}

button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c; /* Trocar a cor do botão "Excluir" para vermelho */
}

.delete-button:hover {
  background-color: #c0392b;
}

.edit-button {
  background-color: #3498db; /* Mantém a cor do botão "Editar" */
}

.edit-button:hover {
  background-color: #2980b9;
}

.centered {
  text-align: center; /* Centraliza o texto nas colunas */
}
</style>