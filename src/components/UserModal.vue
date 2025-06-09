<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content container">
      <h2 class="modal-title">{{ user.name }}</h2>

      <div class="user-info">
        <p><strong>📞 Telefon:</strong> {{ user.phone }}</p>
        <p><strong>🚗 Avto raqami:</strong> {{ user.carNumber }}</p>
        <p><strong>🏷 Avto markasi:</strong> {{ user.carBrand }}</p>
      </div>

      <hr class="divider" />

      <div v-if="user.history?.length" class="history-section">
        <h3>🧾 Servis tarixi</h3>
        <div
          v-for="(item, index) in user.history"
          :key="item._id || index"
          class="history-entry"
        >
          <p><strong>📅 To‘ldirilgan:</strong> {{ formattedDate(item.filledAt) }}</p>
          <p><strong>🔁 Keyingi almashtirish:</strong> {{ formattedDate(item.nextChangeAt) }}</p>
          <p><strong>🛢 Yog’ markasi:</strong> {{ item.oilBrand }}</p>
          <p><strong>📏 Kilometr:</strong> {{ item.klameter }} km</p>
          <p><strong>💰 Narxi:</strong> {{ item.price }} so'm</p>
          <p>
            <strong>🔧 Filtrlar:</strong>
            Yog' filtri - {{ yesNo(item.oilFilter) }},
            Havo filtri - {{ yesNo(item.airFilter) }},
            Salon filtri - {{ yesNo(item.cabinFilter) }}
          </p>
          <hr />
        </div>
      </div>
      <p v-else>🕵️‍♂️ Tarix mavjud emas</p>

      <button class="close-btn" @click="$emit('close')">Yopish</button>
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
      if (!date) return '-';
      const d = new Date(date);
      if (isNaN(d)) return '-';
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${d.getFullYear()}`;
    },
    yesNo(val) {
      return val === '1' ? '✅' : '❌';
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background:var(--card-bg);
  max-width: 600px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 90vh;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.user-info p,
.history-entry p {
  margin: 6px 0;
}

.history-section {
  margin-top: 20px;
}

.history-entry {
  background: var(--card-bg);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.divider {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.close-btn {
  margin-top: 20px;
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #dc2626;
}
</style>
