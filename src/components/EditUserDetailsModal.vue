<template>
  <div class="modal" @click.self="close">
    <div class="user-form container">
      <div class="model-header">
        <h2>Mijoz ma'lumotlarini tahrirlash</h2>
        <button class="modal-close-btn" @click="close" type="button" aria-label="Yopish">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <form class="model-form" @submit.prevent="handleUpdate">
        <div style="display:flex; gap:10px;">
          <div style="width:50%;" class="labelbox">
            <label for="name">Ism</label>
            <input id="name" class="input" v-model="form.name" placeholder="Ismingiz" required />
          </div>
          <div style="width:50%;" class="labelbox">
            <label for="phone">Telefon</label>
            <input id="phone" class="input" v-model="form.phone" placeholder="+998901234567" required />
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <div style="width:50%;" class="labelbox">
            <label for="carNumber">Mashina raqami</label>
            <input id="carNumber" class="input" v-model="form.carNumber" placeholder="01A123BC" required />
          </div>
          <div style="width:50%;" class="labelbox">
            <label for="carBrand">Avtomobil markasi</label>
            <input id="carBrand" class="input" v-model="form.carBrand" placeholder="Chevrolet" required />
          </div>
        </div>

        <button class="header-created-btn" type="submit">Saqlash</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
    isOpen: Boolean
  },
  emits: ['close', 'update'],
  data() {
    return {
      form: {
        name: this.user?.name || '',
        phone: this.user?.phone || '',
        carNumber: this.user?.carNumber || '',
        carBrand: this.user?.carBrand || ''
      }
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name || '';
          this.form.phone = newVal.phone || '';
          this.form.carNumber = newVal.carNumber || '';
          this.form.carBrand = newVal.carBrand || '';
        }
      }
    },
    'form.name'(val) {
      this.form.name = val.replace(/[^\p{L}\s'.-]/gu, '').slice(0, 20);
    },
    'form.phone'(val) {
      this.form.phone = val.replace(/[^0-9+]/g, '').slice(0, 13);
    },
    'form.carNumber'(val) {
      this.form.carNumber = val.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 9);
    },
    'form.carBrand'(val) {
      this.form.carBrand = val.replace(/[^\w\s\-]/g, '').slice(0, 20);
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleUpdate() {
      this.$emit('update', {
        name: this.form.name,
        phone: this.form.phone,
        carNumber: this.form.carNumber,
        carBrand: this.form.carBrand
      });
      this.close();
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 1000;
}
.user-form {
  padding: 30px;
  border-radius: 8px;
  width: 95vw !important;
  max-width: 500px !important;
  background: var(--card-bg, #fff);
}
.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
}
.labelbox{
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}
label{
  font-size: 12px;
  color: var(--text);
}
.input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text);
  width: 100%;
  box-sizing: border-box;
}
.header-created-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: #3f8cff;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
</style>
