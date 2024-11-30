<template>
  <div class="container">
    <h2>Gestão de Produtos</h2>

    <!-- Formulário de Adicionar/Editar Produtos -->
    <div class="form-container">
      <h3 class="form-title">{{ editingProduct ? "Editar Produto" : "Adicionar Produto" }}</h3>

      <form @submit.prevent="saveProduct">
        <!-- Nome do Produto -->
        <div class="form-group">
          <label for="product-name">Nome do Produto</label>
          <input
              id="product-name"
              type="text"
              v-model="productForm.title"
              placeholder="Digite o nome do produto"
              required
          />
        </div>

        <!-- Categoria -->
        <div class="form-group">
          <label for="product-category">Categoria</label>
          <select id="product-category" v-model="productForm.category" required>
            <option value="">Selecione uma Categoria</option>
            <option value="electronics">Eletrônicos</option>
            <option value="jewelery">Joias</option>
            <option value="men's clothing">Roupas Masculinas</option>
            <option value="women's clothing">Roupas Femininas</option>
          </select>
        </div>

        <!-- Preço -->
        <div class="form-group">
          <label for="product-price">Preço</label>
          <input
              id="product-price"
              type="number"
              step="0.01"
              v-model.number="productForm.price"
              placeholder="Digite o preço"
              required
          />
        </div>

        <!-- Classificação -->
        <div class="form-group">
          <label for="product-rating">Classificação (1-5)</label>
          <input
              id="product-rating"
              type="number"
              step="0.1"
              v-model.number="productForm.rating.rate"
              placeholder="Informe a classificação"
              min="1"
              max="5"
              required
          />
        </div>

        <!-- Botões -->
        <div class="form-buttons">
          <button type="submit" class="btn btn-blue">
            {{ editingProduct ? "Atualizar Produto" : "Adicionar Produto" }}
          </button>
          <button type="button" class="btn btn-red" @click="cancelEditing">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label for="category-filter">Filtrar por Categoria</label>
        <select id="category-filter" v-model="categoryFilter" @change="applyFilters">
          <option value="">Todas as Categorias</option>
          <option value="electronics">Eletrônicos</option>
          <option value="jewelery">Joias</option>
          <option value="men's clothing">Roupas Masculinas</option>
          <option value="women's clothing">Roupas Femininas</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort-option">Ordenar</label>
        <select id="sort-option" v-model="sortOption" @change="applySorting">
          <option value="price">Ordenar por Preço</option>
          <option value="rating">Ordenar por Classificação</option>
        </select>
      </div>
    </div>

    <!-- Tabela de Produtos -->
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
      <tr v-for="product in filteredProducts" :key="product.id">
        <td>{{ product.title }}</td>
        <td>{{ product.category }}</td>
        <td>R$ {{ product.price.toFixed(2) }}</td>
        <td>{{ product.rating.rate }}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-blue" @click="editProduct(product)">Editar</button>
            <button class="btn btn-red" @click="confirmDelete(product.id)">Excluir</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      productForm: {
        id: null,
        title: "",
        category: "",
        price: 0,
        rating: {
          rate: 0,
        },
      },
      categoryFilter: "",
      sortOption: "price",
      editingProduct: false,
    };
  },
  methods: {
    fetchProducts() {
      this.products = this.$store.getters.getAllProducts;
      this.filteredProducts = [...this.products];
    },
    applyFilters() {
      this.filteredProducts = this.products.filter((product) => {
        return !this.categoryFilter || product.category === this.categoryFilter;
      });
      this.applySorting();
    },
    applySorting() {
      if (this.sortOption === "price") {
        this.filteredProducts.sort((a, b) => a.price - b.price);
      } else if (this.sortOption === "rating") {
        this.filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      }
    },
    confirmDelete(productId) {
      const productInOrders = this.$store.state.orders.some(order =>
          order.products.some(product => product.productId === productId)
      );

      if (productInOrders) {
        alert("Produto consta em pedido. Exclusão não permitida!");
      } else if (confirm("Você tem certeza que deseja excluir este produto?")) {
        this.deleteProduct(productId);
      }
    },
    deleteProduct(productId) {
      this.$store.dispatch("removeProduct", productId);
      this.fetchProducts();
    },
    editProduct(product) {
      this.productForm = { ...product };
      this.editingProduct = true;
    },
    saveProduct() {
      if (this.editingProduct) {
        this.$store.dispatch("updateProduct", this.productForm);
      } else {
        const newProduct = { ...this.productForm };
        newProduct.id = Date.now();
        this.$store.dispatch("addProduct", newProduct);
      }
      this.cancelEditing();
      this.fetchProducts();
    },
    cancelEditing() {
      this.productForm = {
        id: null,
        title: "",
        category: "",
        price: 0,
        rating: {
          rate: 0,
        },
      };
      this.editingProduct = false;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.filter-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
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
</style>