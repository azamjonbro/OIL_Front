<template>
  <div class="notifications-container">
    <!-- Header Controls -->
    <div class="controls-header">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Mijoz ismi, telefon yoki davlat raqami..."
          class="search-input"
        />
      </div>
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-btn', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-if="loading" class="skeleton-list">
      <div v-for="n in 3" :key="n" class="skeleton-card">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line text short"></div>
        <div class="skeleton-line text"></div>
        <div class="skeleton-row">
          <div class="skeleton-btn"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredClients.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <h3>Xabarnomalar mavjud emas</h3>
      <p>Barcha mijozlar eslatmalari o'z vaqtida yuborilgan.</p>
    </div>

    <div v-else class="cards-grid">
      <transition-group name="card-fade">
        <div
          v-for="client in filteredClients"
          :key="client._id"
          class="notification-card"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div>
              <h3 class="client-name">{{ client.name }}</h3>
              <p class="client-phone">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: middle;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ client.phone }}</span>
              </p>
            </div>
            <span :class="['status-badge', getStatusClass(client)]">
              {{ getStatusText(client) }}
            </span>
          </div>

          <!-- Car details -->
          <div class="car-info">
            <div class="info-badge">
              <span class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="22" height="13" rx="2" ry="2"/>
                  <path d="M4 21h4a2 2 0 0 0 2-2v-2H2v2a2 2 0 0 0 2 2z"/>
                  <path d="M20 21h-4a2 2 0 0 0-2-2v-2h8v2a2 2 0 0 0-2 2z"/>
                  <circle cx="6" cy="14" r="1"/>
                  <circle cx="18" cy="14" r="1"/>
                </svg>
              </span>
              <span class="info-val font-bold">{{ client.carNumber }}</span>
            </div>
            <div class="info-badge">
              <span class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </span>
              <span class="info-val">{{ client.carBrand }}</span>
            </div>
          </div>

          <!-- Service Dates -->
          <div class="dates-box">
            <div class="date-item">
              <span class="date-label">Oxirgi moy almashtirish:</span>
              <span class="date-val">{{ formatDate(getLatestHistory(client)?.filledAt) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">Keyingi tavsiya etilgan sana:</span>
              <span class="date-val highlight">{{ formatDate(getLatestHistory(client)?.nextChangeAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-actions">
            <a
              :href="'sms:' + formatPhoneForSMS(client.phone)"
              class="action-btn sms-btn"
              @click="handleCopySMS(client)"
              style="text-decoration: none;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              SMS ochish
            </a>
            <button class="action-btn confirm-btn" @click="handleConfirm(client)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Tasdiqlash
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationsView",
  props: {
    clients: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["refresh", "confirm-notification"],
  data() {
    return {
      searchQuery: "",
      activeFilter: "all",
      filters: [
        { label: "Barchasi", value: "all" },
        { label: "Bugun", value: "today" },
        { label: "Ertaga", value: "tomorrow" },
        { label: "Shu hafta", value: "week" },
        { label: "Muddati o'tgan", value: "overdue" },
      ],
    };
  },
  computed: {
    // 1. Qualify clients that need notification (notificationDate empty or <= today + 7 days to see this week's items)
    qualifiedClients() {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 7);

      return this.clients.filter((client) => {
        const latest = this.getLatestHistory(client);
        if (!latest) return false;

        const notifDate = latest.notificationDate ? new Date(latest.notificationDate) : null;
        return !notifDate || notifDate <= maxDate;
      });
    },
    // 2. Apply search and category filters
    filteredClients() {
      const query = this.searchQuery.toLowerCase().trim();
      const numberQuery = query.replace(/\D/g, "");

      return this.qualifiedClients.filter((client) => {
        const matchesSearch =
          !query ||
          client.name?.toLowerCase().includes(query) ||
          client.carNumber?.toLowerCase().includes(query) ||
          client.phone?.replace(/\D/g, "").includes(numberQuery);

        if (!matchesSearch) return false;

        const latest = this.getLatestHistory(client);
        const notifDate = latest?.notificationDate ? new Date(latest.notificationDate) : null;
        const nextChange = latest?.nextChangeAt ? new Date(latest.nextChangeAt) : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        if (this.activeFilter === "today") {
          if (!notifDate) return true;
          const d = new Date(notifDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() <= today.getTime();
        } else if (this.activeFilter === "tomorrow") {
          if (!notifDate) return false;
          const d = new Date(notifDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === tomorrow.getTime();
        } else if (this.activeFilter === "week") {
          if (!notifDate) return true;
          const d = new Date(notifDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() <= endOfWeek.getTime();
        } else if (this.activeFilter === "overdue") {
          return nextChange && nextChange < new Date();
        }

        return true;
      });
    },
  },
  methods: {
    getLatestHistory(client) {
      if (!client.history || client.history.length === 0) return null;
      return client.history[client.history.length - 1];
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${d.getFullYear()}`;
    },
    getStatusText(client) {
      const latest = this.getLatestHistory(client);
      if (!latest || !latest.nextChangeAt) return "Muddatsiz";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextChange = new Date(latest.nextChangeAt);
      nextChange.setHours(0, 0, 0, 0);

      const diffTime = nextChange.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return `Overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        return "Moy almashtirish bugun!";
      } else {
        return `${diffDays} days remaining`;
      }
    },
    getStatusClass(client) {
      const latest = this.getLatestHistory(client);
      if (!latest || !latest.nextChangeAt) return "status-green";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextChange = new Date(latest.nextChangeAt);
      nextChange.setHours(0, 0, 0, 0);

      const diffTime = nextChange.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "status-red";
      } else if (diffDays <= 3) {
        return "status-orange";
      } else {
        return "status-green";
      }
    },
    formatPhoneForSMS(phone) {
      if (!phone) return "";
      return phone.replace(/[^\d+]/g, "");
    },
    handleCopySMS(client) {
      const latest = this.getLatestHistory(client);
      if (!latest) return;

      const template = `Assalomu alaykum ${client.name}.

Eslatib o'tamiz.

Sizning avtomobilingizda oxirgi moy almashtirish sanasi:
${this.formatDate(latest.filledAt)}

Keyingi moy almashtirish tavsiya etilgan sana:
${this.formatDate(latest.nextChangeAt)}

Avtomobilingizga xizmat ko'rsatish vaqti keldi.

Sizni servisimizda kutamiz.`;

      navigator.clipboard
        .writeText(template)
        .then(() => {
          console.log("SMS copied successfully");
        })
        .catch((err) => {
          console.error("Clipboard copy error:", err);
        });
    },
    async handleConfirm(client) {
      if (confirm(`${client.name} uchun notification yuborilganligini tasdiqlaysizmi?`)) {
        this.$emit("confirm-notification", client._id);
      }
    },
  },
};
</script>

<style scoped>
.notifications-container {
  padding: 10px 0 80px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.controls-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--card-bg);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 14px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3f8cff;
  box-shadow: 0 0 0 3px rgba(63, 140, 255, 0.15);
  background: var(--card-bg);
}

.filter-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  white-space: nowrap;
  padding: 8px 14px;
  border-radius: 20px;
  background: var(--input-bg);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #3f8cff;
  color: white;
  box-shadow: 0 4px 10px rgba(63, 140, 255, 0.3);
}

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--card-shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.client-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.client-phone {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-red {
  background: rgba(255, 77, 79, 0.15);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.25);
}

.status-orange {
  background: rgba(250, 140, 22, 0.15);
  color: #fa8c16;
  border: 1px solid rgba(250, 140, 22, 0.25);
}

.status-green {
  background: rgba(82, 196, 26, 0.15);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.25);
}

.car-info {
  display: flex;
  gap: 8px;
}

.info-badge {
  background: var(--input-bg);
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text);
  border: 1px solid var(--border-color);
}

.info-icon {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.dates-box {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.active-body .dates-box {
  background: rgba(255, 255, 255, 0.01);
}

.date-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.date-label {
  color: var(--text-secondary);
}

.date-val {
  font-weight: 600;
  color: var(--text);
}

.date-val.highlight {
  color: #3f8cff;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.action-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.sms-btn {
  background: rgba(63, 140, 255, 0.1);
  color: #3f8cff;
  border: 1px solid rgba(63, 140, 255, 0.2);
}

.sms-btn:hover {
  background: rgba(63, 140, 255, 0.18);
}

.confirm-btn {
  background: #52c41a;
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(82, 196, 26, 0.2);
}

.confirm-btn:hover {
  background: #47a413;
  box-shadow: 0 6px 14px rgba(82, 196, 26, 0.3);
}

/* Empty State Styling */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
}

.empty-icon {
  display: flex;
  justify-content: center;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Skeletons Styling */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.skeleton-line {
  height: 12px;
  background: var(--input-bg);
  border-radius: 6px;
}

.skeleton-line.title {
  width: 40%;
  height: 18px;
}

.skeleton-line.text {
  width: 90%;
}

.skeleton-line.text.short {
  width: 60%;
}

.skeleton-row {
  display: flex;
  gap: 8px;
}

.skeleton-btn {
  flex: 1;
  height: 38px;
  background: var(--input-bg);
  border-radius: 10px;
}

/* Card animations */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
