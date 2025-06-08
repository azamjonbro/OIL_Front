<template>
  <div class="card" @click="handleClick">
    <h3>{{ user.name }}</h3>
    <p><strong>Avto:</strong> {{ user.carBrand }} – {{ user.carNumber }}</p>
    <p><strong>Telefon:</strong> {{ user.phone }}</p>
    <p><strong>Yog':</strong> {{ user.oilBrand }}</p>
    <p><strong>Kilometr:</strong> {{ user.klameter }}</p>
    <p><strong>Keyingi almashtirish:</strong> {{ formatDate(user.nextChangeAt) }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object
});
const emit = defineEmits(['select']);

function handleClick() {
  emit('select', props.user);
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth()+1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}
</script>

<style >
.card {
  border: 1px solid #6d6d6dc7;
  box-shadow: 0px 0px 4px #ccc;
  border-radius: 10px;
  padding: 1rem;
  background: var(--card-bg);
  transition: 0.2s;
  cursor: pointer;
}
</style>
