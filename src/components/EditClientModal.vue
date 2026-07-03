<template>
  <div class="modal">
    <div class="user-form container">
      <div class="model-header">
        <h2>Mijozni tahrirlash</h2>
        <button class="modal-close-btn" @click="close" type="button" aria-label="Yopish">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <form class="model-form" @submit.prevent="handleUpdate">
        <div style="display:flex; gap:10px;">
          <input style="width:50%;" class="input" v-model="form.filledAt" type="date" required />
          <input style="width:50%;" class="input" v-model="form.nextChangeAt" type="date" required />
        </div>
        <div class="flex gap-2">
          <input style="width:50%;" class="input" v-model.number="form.price" placeholder="Summa (so'm)" required />
          <input style="width:50%;" class="input" v-model="form.notificationDate" type="date" required />
        </div>
        <div class="flex gap-2">
          <input style="width:50%;" class="input" v-model.number="form.cost" placeholder="Xarajat tannarxi (so'm)" required />
          <input style="width:50%;" class="input" v-model="form.master" placeholder="Usta ismi" required />
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
            | Usta: {{ h.master || 'Asosiy usta' }} | Xarajat: {{ h.cost || 0 }} UZS
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
        cost: '',
        master: 'Asosiy usta'
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
        oilBrand:this.form.oilBrand,
        cost: parseFloat(this.form.cost) || 0,
        master: this.form.master
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