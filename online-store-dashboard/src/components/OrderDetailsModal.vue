<template>
  <div class="order-details-modal">
    <div class="modal-content">
      <h3 class="modal-title">Detalhes do Pedido</h3>
      <form @submit.prevent="updateOrderDetails">
        <table>
          <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Data e Hora</th>
            <th>Vendedor</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ localOrder.id }}</td>
            <td>{{ formatDate(localOrder.date) }}</td>
            <td>
              <select v-model="localOrder.userId" class="modal-subtitle" required>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name.firstname }} {{ user.name.lastname }}
                </option>
              </select>
            </td>
          </tr>
          </tbody>
        </table>

        <h4>Produtos no Pedido</h4>
        <table>
          <thead>
          <tr>
            <th>Nome do Produto</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Valor Produto</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, index) in localOrder.products" :key="index">
            <td>
              <select v-model="product.productId" required>
                <option v-for="prod in products" :key="prod.id" :value="prod.id">
                  {{ prod.title }}
                </option>
              </select>
            </td>
            <td>
              <input type="number" v-model="product.quantity" min="1" />
            </td>
            <td>
              {{ formatCurrency(getProductPrice(product.productId)) }}
            </td>
            <td>
              {{ formatCurrency(product.quantity * getProductPrice(product.productId)) }}
            </td>
            <td>
              <button type="button" @click="removeProduct(index)">Remover</button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="order-total-container">
          <button type="button" class="add-product-button" @click="addProductField">Adicionar Produto</button>
          <div class="order-total">
            <strong>Valor Total do Pedido: {{ formatCurrency(calculateOrderTotal(localOrder.products)) }}</strong>
          </div>
        </div>

        <div class="modal-buttons">
          <button type="submit" class="save-button">Atualizar Pedido</button>
          <button type="button" class="cancel-button" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsModal',
  props: {
    order: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localOrder: JSON.parse(JSON.stringify(this.order)), // Faz uma cópia profunda do pedido
    };
  },
  methods: {
    updateOrderDetails() {
      this.$emit('updateOrder', this.localOrder);
      this.$emit('close');
    },
    addProductField() {
      this.localOrder.products.push({ productId: '', productName: '', quantity: 1 });
    },
    removeProduct(index) {
      this.localOrder.products.splice(index, 1);
    },
    getProductPrice(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.price : 0;
    },
    calculateOrderTotal(products) {
      return products.reduce((total, product) => total + (product.quantity * this.getProductPrice(product.productId)), 0);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },
    formatDate(dateString) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options).replace(',', ' -');
    },
  },
};
</script>

<style scoped>
.order-details-modal {
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

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1400px; /* Aumenta o tamanho do modal */
  width: 100%;
  margin: auto; /* Centraliza o modal verticalmente */
  display: flex;
  flex-direction: column; /* Garante que o conteúdo do modal seja empilhado verticalmente */
  align-items: center; /* Centraliza o conteúdo do modal horizontalmente */
}

.modal-title {
  font-size: 28px; /* Aumenta a fonte do título */
  margin-bottom: 20px; /* Adiciona margem inferior */
}

.modal-subtitle {
  font-size: 20px; /* Aumenta a fonte do subtítulo */
  margin-bottom: 20px; /* Adiciona margem inferior */
  display: block;
}

select {
  font-size: 18px; /* Diminui a fonte da dropbox */
}

.order-total-container {
  display: flex;
  justify-content: space-between; /* Alinha os itens à esquerda e à direita */
  width: 100%; /* Garante que o contêiner ocupe a largura total */
  margin-top: 20px;
  align-items: center; /* Centraliza verticalmente */
}

.add-product-button {
  background-color: #2ecc71; /* Define a cor verde para o botão */
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.add-product-button:hover {
  background-color: #27ae60; /* Cor verde mais escura ao passar o mouse */
}

.order-total {
  font-size: 1.2em;
  text-align: right;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Garante que os botões ocupem a largura total do modal */
  margin-top: 20px;
}

.save-button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.save-button:hover {
  background-color: #2980b9;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-button:hover {
  background-color: #c0392b;
}
</style>