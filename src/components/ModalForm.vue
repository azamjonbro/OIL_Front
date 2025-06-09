<template>
  <div class="modal">
    <div class="user-form container ">
      <div class="model-header">
      <h2>Yangi mijoz</h2>
       
       <div style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 24px; color:rgb(187, 40, 40); cursor:pointer" @click="close" >X</div>
      
      </div>
      <form class="model-form" @submit.prevent="handleSubmit">
       <div style="display: flex; gap:10px;">
         <input style="width:50%" class="input" v-model="form.name" placeholder="Ism" required />
         <input style="width:50%" class="input" v-model="form.phone" placeholder="Telefon" required />
        </div>
        <div style="display: flex; gap:10px;">
         <input style="width: 50%;" class="input" v-model="form.carNumber" placeholder="Mashina raqami" required />
         <input style="width: 50%;" class="input" v-model="form.carBrand" placeholder="Avtomobil markasi" required />
        </div>
        <div style="display: flex; gap:10px;">
         <input style="width: 50%;" class="input" v-model="form.oilBrand" placeholder="Yog' markasi" required />
         <input style="width: 50%;" class="input" v-model="form.klameter" placeholder="Kilometr" required />
        </div>

        <div style="display: flex; gap:10px;">
         <input style="width:50%;" class="input" placeholder="" v-model="form.filledAt" type="date" required />
         <input style="width:50%;" class="input" v-model="form.nextChangeAt" type="date" required />
        </div>
        <div style="display:flex">
         <input style="width: 100%;" type="number" placeholder="Summa" class="input"  >
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
        klameter: ''
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
      console.log(this.form);
      
   this.$emit('create', {
  ...this.form,
  carNumber: this.form.carNumber.toUpperCase(),
  filledAt: new Date(this.form.filledAt),
  nextChangeAt: new Date(this.form.nextChangeAt)
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
</style>
