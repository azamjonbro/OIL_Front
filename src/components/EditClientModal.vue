<template>
  <div class="modal">
    <div class="user-form container">
      <div class="model-header">
        <h2>Mijozni tahrirlash</h2>
        <div class="close-btn" @click="close">X</div>
      </div>

      <form class="model-form" @submit.prevent="handleUpdate">
        <div style="display:flex; gap:10px;">
          <input style="width:50%;" class="input" v-model="form.filledAt" type="date" required />
          <input style="width:50%;" class="input" v-model="form.nextChangeAt" type="date" required />
        </div>
        <div class="flex gap-2">
          <input style="width:50%;" class="input" v-model.number="form.price" placeholder="Summa" required />
          <input style="width:50%;" class="input" v-model="form.notificationDate" type="date" required />
        </div>
        <div class="flex gap-2">
  <input style="width:50%;" class="input" v-model="form.klameter" placeholder="Klametr" required />
  <input style="width:50%;" class="input" v-model="form.oilBrand" placeholder="Moy brendi" required />
</div>
        <div class="flex gap-2" style="gap: 10px;">
          <input style="width:33%;" class="input" v-model="form.oilFilter" placeholder="Moy filtri" required />
          <input style="width:33%;" class="input" v-model="form.airFilter" placeholder="Vozdux filtri" required />
          <input style="width:33%;" class="input" v-model="form.salonFilter" placeholder="Salon filtri" required />
        </div>


        <button class="header-created-btn" type="submit">Saqlash</button>
      </form>

      <!-- Tarix ro'yxati -->
      <div v-if="user.history?.length">
        <h3>Tarix:</h3>
        <ul class="history-list">
          <li v-for="(h, index) in user.history" :key="index">
            {{ formatDate(h.filledAt) }} ➡ {{ formatDate(h.nextChangeAt) }}, {{ h.price }} so‘m
            | Filtrlar: {{ h.oilFilter }}, {{ h.airFilter }}, {{ h.salonFilter }}
          </li>
        </ul>
      </div>
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
        filledAt: '',
        nextChangeAt: '',
        price: null,
        notificationDate: '',
        oilFilter: '0',
        airFilter: '0',
        salonFilter: '0',
        klameter:'',
        oilBrand:"",
      }
    };
  },
  methods: {
    formatDate(d) {
      const date = new Date(d);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getFullYear()}`;
    },
    close() {
      this.$emit('close');
    },
    handleUpdate() {
      const historyItem = {
        filledAt: new Date(this.form.filledAt),
        nextChangeAt: new Date(this.form.nextChangeAt),
        price: this.form.price,
        notificationDate: new Date(this.form.notificationDate),
        oilFilter: this.form.oilFilter,
        airFilter: this.form.airFilter,
        cabinFilter: this.form.salonFilter,
        klameter:this.form.klameter,
        oilBrand:this.form.oilBrand
      };

      this.$emit('update', historyItem);
      this.close();
    }
  }
};
</script>
// oilFilter,
//       airFilter,
//       cabinFilter
<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-btn {
  font-size: 20px;
  color: red;
  cursor: pointer;
}
.input {
  padding: 5px;
  width: 100%;
}
.history-list {
  margin-top: 10px;
  font-size: 14px;
}
</style>