<template>
  <div
    class="user-card grid gap-2 rounded-2xl p-4 shadow hover:shadow-lg transition duration-200 cursor-pointer bg-white dark:bg-gray-800"
    @click="handleSelect"
  >
    <!-- Top row: name & phone -->
    <div class="flex justify-between items-center">
      <h3 class="font-semibold text-lg truncate">{{ user.name }}</h3>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.phone }}</span>
    </div>

    <!-- Car number -->
    <div class="flex items-center gap-2 text-sm">
      <span>🚗</span>
      <span class="font-medium">{{ user.carNumber }}</span>
    </div>

    <!-- Oil brand -->
    <div class="flex items-center gap-2 text-sm">
      <span>🛢</span>
      <span>{{ user.oilBrand }}</span>
    </div>

    <!-- Dates -->
    <div style="display: flex; justify-content: space-between;">
      <span>⛽ {{ formatDate(user.filledAt) }}</span>
      <span>🔁 {{ formatDate(user.nextChangeAt) }}</span>
    </div>

    <!-- Actions -->
    <div class="buttonbox">
      <button
        class="header-created-btn"
        @click.stop="onEdit"
      >
        O'zgartirish
      </button>
      <button
        class="delete-btn"
        @click.stop="onDelete"
      >
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
      const d = new Date(date);
      if (Number.isNaN(d)) return '-';
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${d.getFullYear()}`;
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
