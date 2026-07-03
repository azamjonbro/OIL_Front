<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="user-form container history-modal-width">
      <!-- Modal Header -->
      <div class="model-header">
        <div>
          <h2 class="modal-main-title">{{ user.name }}</h2>
          <p class="modal-subtitle">Barcha moy almashtirish tarixi</p>
        </div>
        <button class="modal-close-btn" @click="$emit('close')" type="button" aria-label="Yopish">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Client Quick Specs Grid -->
      <div class="specs-grid">
        <a :href="'tel:' + user.phone" class="spec-tile phone" @click="handlePhoneCall(user.phone, $event)">
          <span class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <div class="spec-info">
            <span class="spec-label">Telefon</span>
            <span class="spec-val font-bold">{{ user.phone }}</span>
          </div>
        </a>

        <div class="spec-tile plate">
          <span class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="6" y1="9" x2="6" y2="15"/>
              <line x1="18" y1="9" x2="18" y2="15"/>
            </svg>
          </span>
          <div class="spec-info">
            <span class="spec-label">Avto Raqam</span>
            <span class="spec-val font-bold">{{ user.carNumber }}</span>
          </div>
        </div>

        <div class="spec-tile brand">
          <span class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </span>
          <div class="spec-info">
            <span class="spec-label">Mashina Markasi</span>
            <span class="spec-val font-bold">{{ user.carBrand }}</span>
          </div>
        </div>

        <div class="spec-tile cash">
          <span class="spec-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </span>
          <div class="spec-info">
            <span class="spec-label">Keshbek Balans</span>
            <span class="spec-val font-bold text-green">{{ user.cash || 0 }} UZS</span>
          </div>
        </div>
      </div>

      <!-- History Timeline List -->
      <div class="history-scroll-area">
        <h3 class="history-section-title">Xizmatlar Tarixi</h3>

        <div v-if="user.history && user.history.length" class="timeline-list">
          <div
            v-for="(item, index) in user.history"
            :key="item._id || index"
            class="timeline-item"
          >
            <!-- Timeline Line Node -->
            <div class="timeline-node">
              <div class="node-dot"></div>
              <div class="node-line" v-if="index !== user.history.length - 1"></div>
            </div>

            <!-- Timeline Card Box -->
            <div class="timeline-card">
              <!-- Header Row -->
              <div class="timeline-card-header">
                <span class="service-date-badge">{{ formatDate(item.filledAt) }}</span>
                <span class="master-label" v-if="item.master">
                  Usta: <strong class="text-blue">{{ item.master }}</strong>
                </span>
              </div>

              <!-- Specs Grid -->
              <div class="item-specs">
                <!-- Oil -->
                <div class="spec-row">
                  <span class="spec-row-label">
                    <svg class="spec-row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/>
                    </svg>
                    Moy brendi:
                  </span>
                  <span class="spec-row-val">{{ item.oilBrand }}</span>
                </div>

                <!-- Kilometer -->
                <div class="spec-row">
                  <span class="spec-row-label">
                    <svg class="spec-row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Yurgan masofa:
                  </span>
                  <span class="spec-row-val">{{ item.klameter }} km</span>
                </div>

                <!-- Next recommendation -->
                <div class="spec-row">
                  <span class="spec-row-label">
                    <svg class="spec-row-svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    Keyingi tavsiya:
                  </span>
                  <span class="spec-row-val text-blue font-bold">{{ formatDate(item.nextChangeAt) }}</span>
                </div>
              </div>

              <!-- Filters grid -->
              <div class="filters-badges">
                <span :class="['filter-pill', { active: item.oilFilter === '1' }]">
                  Moy filtri {{ item.oilFilter === '1' ? '✓' : '✗' }}
                </span>
                <span :class="['filter-pill', { active: item.airFilter === '1' }]">
                  Havo filtri {{ item.airFilter === '1' ? '✓' : '✗' }}
                </span>
                <span :class="['filter-pill', { active: item.cabinFilter === '1' }]">
                  Salon filtri {{ item.cabinFilter === '1' ? '✓' : '✗' }}
                </span>
              </div>

              <!-- Price, Cost, Profit -->
              <div class="financials-card-row">
                <div class="fin-box">
                  <span class="fin-label">Xizmat haqi</span>
                  <span class="fin-val">{{ formatCurrency(item.price) }} UZS</span>
                </div>
                <div class="fin-box">
                  <span class="fin-label">Xarajat</span>
                  <span class="fin-val text-orange">{{ formatCurrency(item.cost) }} UZS</span>
                </div>
                <div class="fin-box">
                  <span class="fin-label">Sof Foyda</span>
                  <span class="fin-val text-green font-bold">+{{ formatCurrency((item.price || 0) - (item.cost || 0)) }} UZS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-history-state">
          <div class="no-history-icon">🕵️‍♂️</div>
          <p>Servis tarixi mavjud emas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${d.getFullYear()}`;
    },
    formatCurrency(val) {
      if (!val) return "0";
      return Number(val).toLocaleString("ru-RU");
    },
    handlePhoneCall(phone, event) {
      const cleaned = phone.replace(/[^\d+]/g, "");
      const telUrl = `tel:${cleaned}`;
      if (window.Telegram?.WebApp?.openLink) {
        if (event) event.preventDefault();
        window.Telegram.WebApp.openLink(telUrl);
      }
    },
  },
};
</script>

<style scoped>
.history-modal-width {
  max-width: 620px !important;
}

.modal-main-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

.modal-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Specs Tiles */
.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.spec-tile {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  padding: 10px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s ease;
}

.spec-tile.phone:hover {
  border-color: #3f8cff;
}

.spec-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.spec-tile.phone:hover .spec-icon {
  color: #3f8cff;
}

.spec-info {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-val {
  font-size: 13px;
}

/* Timeline Scroll Area */
.history-scroll-area {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.history-section-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  border-left: 3px solid #3f8cff;
  padding-left: 8px;
  margin-top: 8px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  padding-left: 6px;
}

.timeline-item {
  display: flex;
  gap: 16px;
}

/* Timeline vertical track */
.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
}

.node-dot {
  width: 10px;
  height: 10px;
  background: #3f8cff;
  border-radius: 50%;
  margin-top: 20px;
  box-shadow: 0 0 0 3px rgba(63, 140, 255, 0.2);
}

.node-line {
  width: 2px;
  background: var(--border-color);
  flex: 1;
}

/* Timeline Card */
.timeline-card {
  flex: 1;
  background: rgba(0, 0, 0, 0.015);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-body .timeline-card {
  background: rgba(255, 255, 255, 0.01);
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-date-badge {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}

.master-label {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Item specs info */
.item-specs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.spec-row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.spec-row-svg {
  color: var(--text-secondary);
}

.spec-row-val {
  font-weight: 600;
  color: var(--text);
}

.font-bold {
  font-weight: 700;
}

.text-blue {
  color: #3f8cff;
}

.text-green {
  color: #52c41a;
}

.text-orange {
  color: #fa8c16;
}

/* Filters Pills */
.filters-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-pill {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.filter-pill.active {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

/* Financial summary inside items */
.financials-card-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: 12px;
  text-align: center;
}

.fin-box {
  display: flex;
  flex-direction: column;
}

.fin-label {
  font-size: 9px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 2px;
}

.fin-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}

/* Empty history style */
.no-history-state {
  text-align: center;
  padding: 30px;
  background: var(--input-bg);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 13px;
}

.no-history-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
</style>