<template>
  <div class="modal" @click.self="$emit('close')">
  
    <div class="user-form container">
      <h2>{{ user.name }}</h2>
      <p>Telefon: {{ user.phone }}</p>
      <p>Avto raqami: {{ user.carNumber }}</p>
      <p>Avto markasi: {{ user.carBrand }}</p>
      <p>Yog' markasi: {{ user.oilBrand }}</p>
      <p>Kilometr: {{ user.klameter }}</p>
      <p>To‘ldirilgan sana: {{ formattedDate(user.filledAt) }}</p>
      <p>Keyingi almashtirish: {{ formattedDate(user.nextChangeAt) }}</p>

      <button @click="$emit('close')">Yopish</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    formattedDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    }
  }
};
</script>

<style>

</style>
