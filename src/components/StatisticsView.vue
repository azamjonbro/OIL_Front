<template>
  <div class="statistics-container">
    <!-- Time Filter Range Selector -->
    <div class="range-selector">
      <button
        v-for="range in ranges"
        :key="range.value"
        :class="['range-btn', { active: activeRange === range.value }]"
        @click="activeRange = range.value"
      >
        {{ range.label }}
      </button>
    </div>

    <!-- Hero Card: Sof Foyda (Net Profit) -->
    <div class="stats-hero-card profit-hero">
      <div class="hero-label">Sof Foyda</div>
      <div class="hero-val text-green">+{{ formatCurrency(filteredStats.profit) }} UZS</div>
      <div class="hero-trend">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        <span>Tanlangan davr bo'yicha</span>
      </div>
    </div>

    <!-- Quick Financial Grid -->
    <div class="stats-grid">
      <!-- O'rtacha Chek -->
      <div class="stat-card check">
        <span class="card-icon check-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f8cff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </span>
        <div class="card-content">
          <div class="card-label">O'rtacha Chek</div>
          <div class="card-val text-blue">{{ formatCurrency(filteredStats.avgCheck) }} UZS</div>
          <div class="card-sub">{{ filteredStats.transactions }} ta xizmat</div>
        </div>
      </div>

      <!-- Xarajatlar -->
      <div class="stat-card cost">
        <span class="card-icon cost-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fa8c16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <line x1="12" y1="10" x2="12" y2="14"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </span>
        <div class="card-content">
          <div class="card-label">Xarajatlar</div>
          <div class="card-val text-orange">{{ formatCurrency(filteredStats.cost) }} UZS</div>
          <div class="card-sub">Tannarx va materiallar</div>
        </div>
      </div>
    </div>

    <!-- Top Oil Brands Section -->
    <div class="analytics-section">
      <h3 class="section-title">Top Moy Brendlari</h3>
      <div class="brands-list" v-if="filteredStats.topBrands.length">
        <div
          v-for="(brand, idx) in filteredStats.topBrands"
          :key="brand.name"
          class="brand-progress-row"
        >
          <div class="brand-progress-header">
            <span class="brand-name">{{ brand.name }}</span>
            <span class="brand-pct font-bold">{{ brand.percentage }}%</span>
          </div>
          <div class="brand-progress-track">
            <div
              :class="['brand-progress-bar', getProgressColorClass(idx)]"
              :style="{ width: brand.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
      <p v-else class="no-data-text">Ma'lumotlar mavjud emas</p>
    </div>

    <!-- Masters Leaderboard Section -->
    <div class="analytics-section">
      <h3 class="section-title">Ustalar Reytingi</h3>
      <div class="masters-list" v-if="filteredStats.topMasters.length">
        <div
          v-for="master in filteredStats.topMasters"
          :key="master.name"
          class="master-row"
        >
          <div class="master-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="master-details">
            <div class="master-name font-bold">{{ master.name }}</div>
            <div class="master-sub">{{ master.cars }} ta mashina xizmati</div>
          </div>
          <div class="master-revenue font-bold">
            {{ formatCurrency(master.revenue) }} UZS
          </div>
        </div>
      </div>
      <p v-else class="no-data-text">Ma'lumotlar mavjud emas</p>
    </div>

    <!-- Active Notifications Progress Indicator -->
    <div class="progress-card">
      <div class="progress-header">
        <h3 class="progress-title">Yuborilgan Eslatmalar</h3>
        <span class="progress-pct">{{ completionRate }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: completionRate + '%' }"></div>
      </div>
      <div class="progress-summary">
        <span>Faol: {{ stats.completedNotifications || 0 }} ta</span>
        <span>Kutmoqda: {{ stats.needNotification || 0 }} ta</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsView",
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        totalClients: 0,
        needNotification: 0,
        today: 0,
        overdue: 0,
        thisMonth: 0,
        completedNotifications: 0,
      }),
    },
    clients: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      activeRange: "all",
      ranges: [
        { label: "Bugun", value: "today" },
        { label: "Shu hafta", value: "week" },
        { label: "Shu oy", value: "month" },
        { label: "Barchasi", value: "all" },
      ],
    };
  },
  computed: {
    completionRate() {
      const completed = this.stats.completedNotifications || 0;
      const total = completed + (this.stats.needNotification || 0);
      if (total === 0) return 100;
      return Math.round((completed / total) * 100);
    },
    filteredStats() {
      let revenue = 0;
      let cost = 0;
      let transactions = 0;
      const brandsMap = {};
      const mastersMap = {};

      const now = new Date();
      const limitDate = new Date();

      if (this.activeRange === "today") {
        limitDate.setHours(0, 0, 0, 0);
      } else if (this.activeRange === "week") {
        limitDate.setDate(now.getDate() - 7);
      } else if (this.activeRange === "month") {
        limitDate.setDate(now.getDate() - 30);
      } else {
        limitDate.setTime(0); // All time
      }

      this.clients.forEach((client) => {
        if (!client.history) return;
        client.history.forEach((record) => {
          const date = new Date(record.filledAt);
          if (this.activeRange !== "all" && date < limitDate) return;

          const recPrice = Number(record.price) || 0;
          const recCost = Number(record.cost) || 0;

          revenue += recPrice;
          cost += recCost;
          transactions++;

          // Brands tally
          const brand = record.oilBrand || "Noma'lum";
          brandsMap[brand] = (brandsMap[brand] || 0) + 1;

          // Masters tally
          const master = record.master || "Asosiy usta";
          if (!mastersMap[master]) {
            mastersMap[master] = { cars: 0, revenue: 0 };
          }
          mastersMap[master].cars++;
          mastersMap[master].revenue += recPrice;
        });
      });

      const profit = revenue - cost;
      const avgCheck = transactions > 0 ? Math.round(revenue / transactions) : 0;

      // Map and sort top brands
      const topBrands = Object.keys(brandsMap)
        .map((name) => {
          const count = brandsMap[name];
          const percentage = transactions > 0 ? Math.round((count / transactions) * 100) : 0;
          return { name, count, percentage };
        })
        .sort((a, b) => b.count - a.count);

      // Map and sort top masters
      const topMasters = Object.keys(mastersMap)
        .map((name) => ({
          name,
          cars: mastersMap[name].cars,
          revenue: mastersMap[name].revenue,
        }))
        .sort((a, b) => b.cars - a.cars);

      return {
        revenue,
        cost,
        profit,
        transactions,
        avgCheck,
        topBrands,
        topMasters,
      };
    },
  },
  methods: {
    formatCurrency(val) {
      if (!val) return "0";
      return Number(val).toLocaleString("ru-RU");
    },
    getProgressColorClass(index) {
      if (index === 0) return "bar-orange";
      if (index === 1) return "bar-blue";
      return "bar-green";
    },
  },
};
</script>

<style scoped>
.statistics-container {
  padding: 10px 0 80px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Time range selector */
.range-selector {
  display: flex;
  background: var(--card-bg);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.range-btn {
  flex: 1;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-btn.active {
  background: var(--input-bg);
  color: var(--text);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Hero Section: Sof Foyda */
.stats-hero-card {
  background: var(--card-bg);
  color: var(--text);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 8px 24px var(--card-shadow);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.hero-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.hero-val {
  font-size: 32px;
  font-weight: 800;
  margin: 6px 0;
}

.hero-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.text-green {
  color: #52c41a !important;
}

.text-blue {
  color: #3f8cff !important;
}

.text-orange {
  color: #fa8c16 !important;
}

/* Quick stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.card-val {
  font-size: 15px;
  font-weight: 800;
}

.card-sub {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 1px;
}

/* Section general style */
.analytics-section {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  border-left: 3px solid #3f8cff;
  padding-left: 10px;
}

.no-data-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  padding: 10px 0;
}

/* Brands Progress Rows */
.brands-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-progress-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand-progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.brand-name {
  font-weight: 600;
  color: var(--text);
}

.brand-pct {
  color: var(--text-secondary);
}

.brand-progress-track {
  height: 6px;
  background: var(--input-bg);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.brand-progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* Progress bar themes */
.bar-orange {
  background: linear-gradient(90deg, #ff9c12, #fa8c16);
}

.bar-blue {
  background: linear-gradient(90deg, #599bff, #3f8cff);
}

.bar-green {
  background: linear-gradient(90deg, #73d13d, #52c41a);
}

/* Masters Leaderboard Rows */
.masters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.master-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--input-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.master-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(63, 140, 255, 0.15);
  color: #3f8cff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.master-details {
  flex: 1;
}

.master-name {
  font-size: 13px;
  color: var(--text);
}

.master-sub {
  font-size: 11px;
  color: var(--text-secondary);
}

.master-revenue {
  font-size: 13px;
  color: #52c41a;
}

/* Progress card general */
.progress-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px var(--card-shadow);
  border: 1px solid var(--border-color);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.progress-pct {
  font-size: 16px;
  font-weight: 800;
  color: #3f8cff;
}

.progress-track {
  height: 8px;
  background: var(--input-bg);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3f8cff 0%, #52c41a 100%);
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-summary {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
