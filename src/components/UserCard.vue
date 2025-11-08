<template>
  <div
    class="user-card grid gap-2 rounded-2xl p-4 shadow hover:shadow-lg transition duration-200 cursor-pointer bg-white dark:bg-gray-800"
    @click="handleSelect">
    <div class="card-title flex justify-between items-center">
      <h3 class="font-semibold text-lg truncate">{{ user.name }}</h3>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.phone }}</span>
    </div>

    <div class="flex items-center gap-2 text-sm">
      <div class="box">
        <span>🚗</span>
        <span class="font-medium">{{ user.carNumber }}</span>
      </div>
      <div class="box">
        <span>🛢</span>
        <span>{{ user.history[user.history.length - 1].oilBrand }}</span>
      </div>
      <div class="box">
        <span>🚗</span>
        <span>{{user.carBrand}}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">

    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>⛽ {{ formatDate(user.history[user.history.length - 1].filledAt) }}</span>
      <span>🔔 {{ formatDate(user.history[user.history.length - 1].notificationDate) }}</span>
      <span>🔁 {{ formatDate(user.history[user.history.length - 1].nextChangeAt) }}</span>
    </div>
    <div class="cash">  
      <span>💵 {{ user.cash ||  0 }} UZS</span>
    </div>
    <div class="buttonbox">
      <button class="header-created-btn" @click.stop="onEdit">
        O'zgartirish
      </button>
      <button class="delete-btn" @click.stop="onDelete">
        O'chirish
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleSelect() {
      this.$emit('select', this.user);
    },
    onEdit() {
      this.$emit('edit', this.user);
    },
    onDelete() {
      this.$emit('delete', this.user._id);
    },
    formatDate(date) {
      if (!date || typeof date !== 'string') return '-';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    }
  }
};
</script>

<style scoped>
.user-card {
  /* fallback for users not using Tailwind */
  border: 1px solid rgba(109, 109, 109, 0.78);
}
</style>
