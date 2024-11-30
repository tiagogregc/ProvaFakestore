<template>
  <div class="container">
    <h2>Pedidos</h2>
    <button @click="openNewOrderModal">Adicionar Novo Pedido</button>
    <OrderTable :orders="orders" :products="products" @viewOrder="showOrderDetails" @deleteOrder="handleRemoveOrder" />

    <!-- Modal para Carrinho -->
    <div v-if="showCartModal" class="cart-modal">
      <ModalCart
          :cart="cart"
          :cartTotal="cartTotal"
          :user="user"
          @close="closeCartModal"
          @remove-product="removeProductFromCart"
          @place-order="placeOrder"
      />
    </div>

    <!-- Modal de Novo Pedido -->
    <div v-if="showNewOrderModal" class="new-order-modal">
      <div class="modal-content">
        <h3 class="modal-title">Novo Pedido</h3>
        <form @submit.prevent="addNewOrder">
          <label for="userId" class="modal-subtitle">Vendedor:</label>
          <select v-model="newOrder.userId" required>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name.firstname }} {{ user.name.lastname }}
            </option>
          </select>
          <label for="products"></label>
          <table class="product-table">
            <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Valor Produtos</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in newOrder.products" :key="index">
              <td>
                <select v-model="product.productId" required>
                  <option v-for="prod in products" :key="prod.id" :value="prod.id">
                    {{ prod.title }}
                  </option>
                </select>
              </td>
              <td>
                <input type="number" v-model="product.quantity" placeholder="Quantidade" required />
              </td>
              <td>
                {{ formatCurrency(getProductPrice(product.productId)) }}
              </td>
              <td>
                {{ formatCurrency(calculateProductTotal(product)) }}
              </td>
            </tr>
            </tbody>
          </table>
          <button type="button" @click="addProductField">Adicionar Produto</button>
          <div class="order-total">
            <strong>Valor Total do Pedido: {{ formatCurrency(calculateOrderTotal(newOrder.products)) }}</strong>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="save-button">Salvar Pedido</button>
            <button type="button" class="cancel-button" @click="closeNewOrderModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <OrderDetailsModal
        v-if="showOrderDetailsModal"
        :order="selectedOrder"
        :user="selectedOrderUser"
        @close="closeOrderDetailsModal"
        @updateOrder="handleUpdateOrder"
        :products="products"
        :users="users"
    />

    <div v-if="cart.length" class="cart-summary">
      <h3>Carrinho</h3>
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          Produto {{ item.productId }} - Quantidade: {{ item.quantity }}
          <button @click="removeProductFromCart(index)">Remover</button>
        </li>
      </ul>
      <p><strong>Total:</strong> {{ formatCurrency(cartTotal) }}</p>
      <button @click="openCartModal">Ver Carrinho</button>
    </div>
  </div>
</template>

<script>
import OrderTable from "@/components/OrderTable.vue";
import ModalCart from "@/components/ModalCart.vue";
import OrderDetailsModal from "@/components/OrderDetailsModal.vue";
import { mapState, mapActions } from 'vuex';

export default {
  name: "OrderList",
  components: {
    OrderTable,
    ModalCart,
    OrderDetailsModal,
  },
  data() {
    return {
      showCartModal: false,
      showOrderDetailsModal: false,
      showNewOrderModal: false,
      selectedOrder: null,
      selectedOrderUser: null,
      newOrder: {
        userId: '',
        products: [{ productId: '', quantity: '' }],
      },
    };
  },
  computed: {
    ...mapState({
      orders: state => state.orders || [],
      products: state => state.products || [],
      users: state => state.users || [],
      cart: state => state.cart || [],
    }),
  },
  methods: {
    ...mapActions(['fetchOrdersFromStorage', 'fetchProductsFromStorage', 'fetchUsersFromStorage', 'addOrder', 'updateOrder', 'removeOrder']),
    openCartModal() {
      this.showCartModal = true;
    },
    closeCartModal() {
      this.showCartModal = false;
    },
    openNewOrderModal() {
      this.showNewOrderModal = true;
    },
    closeNewOrderModal() {
      this.showNewOrderModal = false;
    },
    removeProductFromCart(index) {
      this.cart.splice(index, 1);
    },
    placeOrder() {
      const newOrder = {
        id: this.orders.length + 1,
        userId: 1,
        date: new Date().toISOString(),
        products: [...this.cart],
      };
      this.addOrder(newOrder);
      this.cart = [];
      alert("Pedido realizado com sucesso!");
      this.closeCartModal();
    },
    addProductField() {
      this.newOrder.products.push({ productId: '', quantity: '' });
    },
    addNewOrder() {
      const newOrder = {
        ...this.newOrder,
        id: this.orders.length + 1,
        date: new Date().toISOString(),
      };
      this.addOrder(newOrder);
      this.newOrder = { userId: '', products: [{ productId: '', quantity: '' }] };
      this.showNewOrderModal = false;
      alert("Novo pedido adicionado com sucesso!");
    },
    showOrderDetails(order) {
      this.selectedOrder = {
        ...order,
        products: order.products.map(product => {
          const productDetails = this.products.find(p => p.id === product.productId);
          return {
            ...product,
            productName: productDetails ? productDetails.title : 'Produto desconhecido',
          };
        }),
      };
      this.selectedOrderUser = this.fetchUserById(order.userId);
      this.showOrderDetailsModal = true;
    },
    fetchUserById(userId) {
      const user = this.users.find(user => user.id === userId);
      return user ? { firstName: user.name.firstname, lastName: user.name.lastname } : { firstName: 'Desconhecido', lastName: '' };
    },
    closeOrderDetailsModal() {
      this.showOrderDetailsModal = false;
    },
    handleRemoveOrder(orderId) {
      console.log("Chamando handleRemoveOrder para o ID:", orderId); // Log para depuração
      this.removeOrder(orderId); // Chamando a ação Vuex
      alert("Pedido excluído com sucesso!");
    },
    handleUpdateOrder(updatedOrder) {
      this.updateOrder(updatedOrder); // Chamando a ação Vuex
      alert("Pedido atualizado com sucesso!");
    },
    getProductPrice(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.price : 0;
    },
    calculateProductTotal(product) {
      return product.quantity * this.getProductPrice(product.productId);
    },
    calculateOrderTotal(products) {
      return products.reduce((total, product) => total + this.calculateProductTotal(product), 0);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },
  },
  created() {
    this.fetchOrdersFromStorage();
    this.fetchProductsFromStorage();
    this.fetchUsersFromStorage();
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 0;
}

button:hover {
  background-color: #2980b9;
}

.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 8px;
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
  font-size: 20px; /* Aumenta a fonte da dropbox */
}

.order-total {
  margin-top: 20px;
  font-size: 1.2em;
  text-align: right;
}

.cart-summary {
  margin-top: 20px;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
}

.cart-summary ul {
  list-style: none;
  padding-left: 0;
}

.cart-summary li {
  margin: 5px 0;
}

.cart-modal, .new-order-modal, .order-details-modal {
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

.new-order-modal .modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1400px; /* Aumenta ainda mais o tamanho do modal */
  width: 100%;
  margin: auto; /* Centraliza o modal verticalmente */
  display: flex;
  flex-direction: column; /* Garante que o conteúdo do modal seja empilhado verticalmente */
  align-items: center; /* Centraliza o conteúdo do modal horizontalmente */
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