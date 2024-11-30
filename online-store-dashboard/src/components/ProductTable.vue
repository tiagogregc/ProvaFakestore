<template>
  <div class="container">
    <h2>Produtos</h2>
    <table>
      <thead>
      <tr>
        <th>Nome</th>
        <th>Categoria</th>
        <th>Preço</th>
        <th>Classificação</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.title }}</td>
        <td>{{ product.category }}</td>
        <td>{{ formatCurrency(product.price) }}</td>
        <td>{{ product.rating ? product.rating.rate : 'N/A' }}</td>
        <td>
          <button @click="editProduct(product)">Editar</button>
          <button @click="confirmDelete(product.id)">Excluir</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button @click="addProduct">Adicionar Produto</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      products: (state) => state.products, // Pegando produtos do Vuex
    }),
  },
  methods: {
    formatCurrency(value) {
      return `R$${value.toFixed(2)}`; // Formata o valor como uma string de moeda
    },
    addProduct() {
      const newProduct = {
        id: Date.now(), // ID único temporário
        title: 'Novo Produto',
        category: 'Eletrônicos',
        price: 100.00, // Valor inicial com duas casas decimais
        rating: { rate: 4.5 },
      };
      this.$store.dispatch('addProduct', newProduct); // Adiciona um produto
    },
    confirmDelete(productId) {
      const productInOrders = this.$store.state.orders.some(order =>
          order.products.some(product => product.productId === productId)
      );

      if (productInOrders) {
        alert("Produto consta em pedido. Exclusão não permitida!");
      } else if (confirm("Você tem certeza que deseja excluir este produto?")) {
        this.removeProduct(productId);
      }
    },
    removeProduct(productId) {
      this.$store.dispatch('removeProduct', productId); // Remove o produto pelo ID
    },
    editProduct(product) {
      // Lógica para edição do produto
      this.$router.push(`/edit-product/${product.id}`);
    },
  },
  mounted() {
    this.$store.dispatch('fetchProducts'); // Carrega os produtos ao montar o componente
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

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

button:nth-child(1) {
  background-color: #007bff;
  color: #fff;
}

button:nth-child(2) {
  background-color: #dc3545;
  color: #fff;
}
</style>