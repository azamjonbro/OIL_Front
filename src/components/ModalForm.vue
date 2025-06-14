<template>
  <div class="modal">
    <div class="user-form container">
      <div class="model-header">
        <h2>Yangi mijoz</h2>
        <div
          style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 24px; color:rgb(187, 40, 40); cursor:pointer"
          @click="close"
        >
          X
        </div>
      </div>

      <form class="model-form" @submit.prevent="handleSubmit">

        <div style="display: flex; gap:10px;">
          <div style="width:50%;" class="labelbox">
            <label for="name">Ism</label>
            <input id="name" class="input" v-model="form.name" placeholder="Ismingiz" required />
          </div>
          <div style="width:50%;" class="labelbox">
            <label for="phone">Telefon</label>
            <input id="phone" class="input" v-model="form.phone" placeholder="+998901234567" required />
          </div>
        </div>

        <div style="display: flex; gap:10px;">
          <div style="width: 50%;"  class="labelbox">
            <label for="carNumber">Mashina raqami</label>
            <input id="carNumber" class="input" v-model="form.carNumber" placeholder="01A123BC" required />
          </div>
          <div style="width: 50%;"  class="labelbox">
            <label for="carBrand">Avtomobil markasi</label>
            <input id="carBrand" class="input" v-model="form.carBrand" placeholder="Chevrolet" required />
          </div>
        </div>

        <div style="display: flex; gap:10px;">
          <div style="width: 50%;" class="labelbox">
            <label for="oilBrand">Yog' markasi</label>
            <input id="oilBrand" class="input" v-model="form.oilBrand" placeholder="Zic X9" required />
          </div>
          <div style="width: 50%;" class="labelbox">
            <label for="klameter">Kilometr</label>
            <input id="klameter" class="input" v-model="form.klameter" placeholder="100000" required />
          </div>
        </div>

        <div style="display: flex; gap:10px;">
          <div style="width:50%;" class="labelbox">
            <label for="filledAt">To‘ldirilgan sana</label>
            <input id="filledAt" class="input" v-model="form.filledAt" type="date" required />
          </div>
          <div style="width:50%;" class="labelbox">
            <label for="nextChangeAt">Keyingi almashtirish</label>
            <input id="nextChangeAt" class="input" v-model="form.nextChangeAt" type="date" required />
          </div>
        </div>

        <div style="display: flex; gap:10px;">
          <div style="width:50%;" class="labelbox">
            <label for="price">Summa (so‘m)</label>
            <input id="price" class="input" type="number" v-model="form.price" placeholder="100000" required />
          </div>
          <div style="width:50%;" class="labelbox">
            <label for="notificationDate">Habarnoma sanasi</label>
            <input id="notificationDate" class="input" type="date" v-model="form.notificationDate" />
          </div>
        </div>

        <div style="display: flex; gap:10px;">
          <div class="labelbox" style="width:33%;">
            <label for="oilFilter">Moy filter</label>
            <input id="oilFilter" style="width:100%;" class="input" v-model="form.oilFilter" placeholder="Moy filtr" />
          </div>
          <div class="labelbox" style="width:33%;">
            <label for="airFilter">Vozdux filter</label>
            <input id="airFilter" style="width:100%;" class="input" v-model="form.airFilter" placeholder="Vozdux filtr" />
          </div>
          <div class="labelbox" style="width:33%;">
            <label for="cabinFilter">Salon filter</label>
            <input id="cabinFilter" style="width:100%;" class="input" v-model="form.cabinFilter" placeholder="Salon filtr" />
          </div>
        </div>

        <button class="header-created-btn" type="submit">Saqlash</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'YangiMijoz',
  props: {
    isOpen: Boolean
  },
  emits: ['close', 'create'],
  data() {
    return {
      form: {
        name: '',
        phone: '+998',
        carNumber: '',
        carBrand: '',
        oilBrand: '',
        filledAt: '',
        nextChangeAt: '',
        klameter: '',
        price: '',
        notificationDate: '',
        oilFilter: '0',
        airFilter: '0',
        cabinFilter: '0'
      }
    };
  },
  watch: {
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
    },
    'form.oilBrand'(val) {
      this.form.oilBrand = val.replace(/[^\w\s\-]/g, '').slice(0, 20);
    },
    'form.klameter'(val) {
      this.form.klameter = val.replace(/[^0-9]/g, '').slice(0, 6);
    }
  },
  methods: {
    resetForm() {
      for (const key in this.form) {
        this.form[key] = '';
      }
    },
    close() {
      this.resetForm();
      this.$emit('close');
    },
    validate() {
      const nameRegex = /^[\p{L}\s'.-]{2,20}$/u;
      const phoneRegex = /^(\+998|998|8)?[0-9]{9}$/;
      const carNumberRegex = /^[A-Za-z0-9]{5,10}$/;
      const brandRegex = /^[\w\s\-]{2,20}$/;
      const numberRegex = /^[0-9]{1,6}$/;

      if (!nameRegex.test(this.form.name)) return 'Ism noto‘g‘ri yoki uzun';
      if (!phoneRegex.test(this.form.phone)) return 'Telefon raqam noto‘g‘ri';
      if (!carNumberRegex.test(this.form.carNumber)) return 'Avto raqam noto‘g‘ri';
      if (!brandRegex.test(this.form.carBrand) || !brandRegex.test(this.form.oilBrand)) return 'Marka noto‘g‘ri';
      if (!numberRegex.test(this.form.klameter)) return 'Kilometr noto‘g‘ri';

      return null;
    },
    handleSubmit() {
      const error = this.validate();
      if (error) {
        alert(error);
        return;
      }

      this.$emit('create', {
        ...this.form,
        carNumber: this.form.carNumber.toUpperCase(),
        filledAt: new Date(this.form.filledAt),
        nextChangeAt: new Date(this.form.nextChangeAt),
        notificationDate: this.form.notificationDate ? new Date(this.form.notificationDate) : null
      });

      this.close();
    }
  }
};
</script>

<style>
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 400px;
}
.labelbox{
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label{
  font-size: 12px;
}
</style>
