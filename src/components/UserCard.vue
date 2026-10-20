<template>
  <div
    class="user-card"
    @click="handleSelect"
  >
    <!-- Top Row: Name and Phone -->
    <div class="card-header-row">
      <h3 class="client-name">{{ user.name }}</h3>
      <a :href="'tel:' + user.phone" class="client-phone-link" @click.stop="handlePhoneCall(user.phone, $event)">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="phone-svg">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span>{{ user.phone }}</span>
      </a>
    </div>

    <!-- Middle Row: Styled Badges -->
    <div class="badges-row">
      <!-- License Plate Badge -->
      <div class="badge-tag plate">
        <span class="badge-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="6" y1="9" x2="6" y2="15"/>
            <line x1="18" y1="9" x2="18" y2="15"/>
          </svg>
        </span>
        <span class="badge-label font-bold">{{ user.carNumber }}</span>
      </div>

      <!-- Oil Brand Badge (with Amber drop icon) -->
      <div class="badge-tag oil" v-if="user.history && user.history.length">
        <span class="badge-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
          </svg>
        </span>
        <span class="badge-label">{{ user.history[user.history.length - 1].oilBrand }}</span>
      </div>

      <!-- Car Brand Badge -->
      <div class="badge-tag brand">
        <span class="badge-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </span>
        <span class="badge-label">{{ user.carBrand }}</span>
      </div>
    </div>

    <!-- Dates Container Panel -->
    <div class="dates-panel" v-if="user.history && user.history.length">
      <!-- Last Filled -->
      <div class="date-row">
        <span class="date-header">
          <svg class="row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 22h12M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M14 9h4.5a1.5 1.5 0 0 1 1.5 1.5V14M9 6h2M9 10h2"/>
          </svg>
          Moy quyilgan:
        </span>
        <span class="date-val">{{ formatDate(user.history[user.history.length - 1].filledAt) }}</span>
      </div>

      <!-- Notification Date -->
      <div class="date-row">
        <span class="date-header">
          <svg class="row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Eslatma sanasi:
        </span>
        <span class="date-val">{{ formatDate(user.history[user.history.length - 1].notificationDate) }}</span>
      </div>

      <!-- Next Recommended Date -->
      <div class="date-row highlight-row">
        <span class="date-header highlight-text" :class="getNextChangeStatusClass()">
          <svg class="row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          Keyingi almashtirish:
        </span>
        <span class="date-val highlight-text" :class="getNextChangeStatusClass()">
          {{ formatDate(user.history[user.history.length - 1].nextChangeAt) }}
        </span>
      </div>
    </div>

    <!-- Cash & Action Controls -->
    <div class="footer-control-row">
      <!-- Cash Indicator Badge -->
      <div class="cash-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="cash-svg">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span class="cash-text">{{ user.cash || 0 }} UZS</span>
      </div>

      <!-- Buttons Box -->
      <div class="buttonbox">
        <button class="action-btn edit-btn" @click.stop="onEdit">
          O'zgartirish
        </button>
        <button class="action-btn delete-btn-card" @click.stop="onDelete">
          O'chirish
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserCard",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleSelect() {
      this.$emit("select", this.user);
    },
    onEdit() {
      this.$emit("edit", this.user);
    },
    onDelete() {
      this.$emit("delete", this.user._id);
    },
    // incrbutton(id) {
    //   console.log(id);
      
    // }, 
    async decrbutton(id) {
      let res = await axios.post("https://oil.techinfo.uz/clients/" + id + "/decrement-cash", {
        amount: parseFloat(this.user.increment) || 0,
      })
      if(res.status === 200) {
        alert("Muvaffaqiyatli ayrildi");
        this.$emit("update");
      }
      else {
        alert("Xatolik yuz berdi");
      }
      
    },
    formatPrice(sum) {
      if (typeof sum !== "number") return "-";
      return sum.toLocaleString("uz-Latn-uz", {
        style: "currency",
        currency: "UZS",
      });
    },

    formatDate(date) {
      if (!date || typeof date !== "string") return "-";
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    },
    getNextChangeStatusClass() {
      if (!this.user.history || !this.user.history.length) return '';
      const latest = this.user.history[this.user.history.length - 1];
      if (!latest.nextChangeAt) return '';

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextChange = new Date(latest.nextChangeAt);
      nextChange.setHours(0, 0, 0, 0);

      const diffTime = nextChange.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "text-red";
      } else if (diffDays <= 3) {
        return "text-orange";
      } else {
        return "text-blue";
      }
    },
    handlePhoneCall(phone, event) {
      const cleaned = phone.replace(/[^\d+]/g, "");
      const telUrl = `tel:${cleaned}`;
      if (window.Telegram?.WebApp?.openLink) {
        if (event) event.preventDefault();
        window.Telegram.WebApp.openLink(telUrl);
      }
    }
  }
};
</script>

<style scoped>
.user-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px var(--card-shadow);
}

/* Header styling */
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.client-phone-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(0,0,0,0.02);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.active-body .client-phone-link {
  background: rgba(255,255,255,0.02);
}

.client-phone-link:hover {
  color: #3f8cff;
  border-color: rgba(63, 140, 255, 0.3);
}

.phone-svg {
  color: var(--text-secondary);
}

.client-phone-link:hover .phone-svg {
  color: #3f8cff;
}

/* Badges styling */
.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
}

/* Plate badge: Grey/Silver */
.badge-tag.plate {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

/* Oil badge: Soft Amber/Yellow */
.badge-tag.oil {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
  border: 1px solid rgba(250, 140, 22, 0.2);
}

/* Brand badge: Soft Purple/Violet */
.badge-tag.brand {
  background: rgba(114, 46, 209, 0.1);
  color: #722ed1;
  border: 1px solid rgba(114, 46, 209, 0.2);
}

.badge-icon {
  display: flex;
  align-items: center;
}

/* Dates panel */
.dates-panel {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.active-body .dates-panel {
  background: rgba(255, 255, 255, 0.01);
}

.date-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.row-svg {
  color: var(--text-secondary);
}

.date-val {
  font-weight: 600;
  color: var(--text);
}

/* Colors depending on status */
.highlight-text.text-blue {
  color: #3f8cff !important;
  font-weight: 700;
}

.highlight-text.text-orange {
  color: #fa8c16 !important;
  font-weight: 700;
}

.highlight-text.text-red {
  color: #ff4d4f !important;
  font-weight: 700;
}

/* Footer & Controls */
.footer-control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

/* Cash styling */
.cash-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.cash-svg {
  color: #52c41a;
}

/* Actions box */
.buttonbox {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: rgba(63, 140, 255, 0.1);
  color: #3f8cff;
  border: 1px solid rgba(63, 140, 255, 0.2);
}

.edit-btn:hover {
  background: rgba(63, 140, 255, 0.18);
}

.delete-btn-card {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.delete-btn-card:hover {
  background: rgba(255, 77, 79, 0.18);
}
.pricebox{
  display: flex;
  flex-direction: column;
  gap: 8px;
}


.incr input {
  width: 120px;
  padding: 4px;
  border-radius: 6px;


}

.incr button {
  width: 80px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px;
}

.incr .add {
  background: #22c55e;
  color: white;
}

.remove {
  background: #ef4444;
  color: white;
}
</style>
