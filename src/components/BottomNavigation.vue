<template>
  <nav class="bottom-nav">
    <button
      :class="['nav-item', { active: activeTab === 'users' }]"
      @click="$emit('update:activeTab', 'users')"
    >
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </span>
      <span class="label">Users</span>
    </button>
    <button
      :class="['nav-item', { active: activeTab === 'notifications' }]"
      @click="$emit('update:activeTab', 'notifications')"
    >
      <div class="icon-wrapper">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </span>
        <span v-if="notificationBadge > 0" class="badge">{{ notificationBadge }}</span>
      </div>
      <span class="label">Notifications</span>
    </button>
    <button
      :class="['nav-item', { active: activeTab === 'statistics' }]"
      @click="$emit('update:activeTab', 'statistics')"
    >
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </span>
      <span class="label">Statistics</span>
    </button>
  </nav>
</template>

<script>
export default {
  name: "BottomNavigation",
  props: {
    activeTab: {
      type: String,
      required: true,
    },
    notificationBadge: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:activeTab"],
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  height: 65px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 0 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.active-body .bottom-nav {
  background: rgba(45, 45, 45, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.4);
}

.nav-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: #777;
  cursor: pointer;
  gap: 4px;
  position: relative;
  transition: all 0.2s ease;
  font-family: inherit;
}

.active-body .nav-item {
  color: #aaa;
}

.nav-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.nav-item .label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-item.active {
  color: #3f8cff;
}

.active-body .nav-item.active {
  color: #3f8cff;
}

.nav-item.active .icon {
  transform: translateY(-4px) scale(1.15);
}

.icon-wrapper {
  position: relative;
  display: inline-block;
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  font-weight: bold;
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
}
</style>
