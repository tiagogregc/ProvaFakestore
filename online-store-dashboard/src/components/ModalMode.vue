<!-- src/components/ModalMode.vue -->
<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <button class="close" @click="close">Fechar</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>