<template>
  <div :class="['app', { 'active-body': isDark }]">
    <!-- Header -->
    <header class="header">
      <div class="container header__container">
        <h1 class="logo">Oil CRM</h1>
        <nav class="header__nav">
          <div class="theme-toggle-container" @click="toggleTheme" title="Mavzuni almashtirish">
            <span class="theme-icon">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </span>
          </div>
          <button v-if="currentTab === 'users'" class="header-created-btn" @click="openModal">
            + Mijoz qo'shish
          </button>
        </nav>
      </div>
    </header>

    <ModalForm
      v-if="modalVisible"
      @close="modalVisible = false"
      @create="createClient($event)"
    />

    <!-- Main Container -->
    <main class="container main-content-area">
      <!-- Users Tab -->
      <section v-if="currentTab === 'users'" class="users-section">
        <div class="user-header">
          <div class="left">
            <h2>Mijozlar</h2>
            <span class="count-badge">{{ users.length }}</span>
          </div>
          <div class="right">
            <input type="text" v-model="searchQuery" placeholder="Mijoz qidirish..." class="SearchUser" />
          </div>
        </div>

        <div class="user-list">
          <UserCard
            v-for="user in filteredUsers"
            :key="user._id"
            :user="user"
            @delete="deleteUser"
            @edit="openEditModal"
            @select="showUser"
          />

          <div v-if="!filteredUsers.length" class="empty-state">
            <span class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <h3>Mijozlar topilmadi</h3>
            <p>Qidiruv shartlariga mos keladigan mijoz mavjud emas.</p>
          </div>
        </div>
      </section>

      <!-- Notifications Tab -->
      <NotificationsView
        v-else-if="currentTab === 'notifications'"
        :clients="users"
        :loading="loadingNotifications"
        @confirm-notification="confirmNotification"
        @refresh="fetchUsers"
      />

      <!-- Statistics Tab -->
      <StatisticsView
        v-else-if="currentTab === 'statistics'"
        :stats="computedStats"
        :clients="users"
      />

      <!-- Modal Views -->
      <EditClientModal
        v-if="selectedUser && activeModal === 'edit'"
        :user="selectedUser"
        :isOpen="true"
        @close="selectedUser = null; activeModal = null"
        @update="saveHistory"
      />

      <UserModal
        v-if="selectedUser && activeModal === 'view'"
        :user="selectedUser"
        @close="selectedUser = null; activeModal = null"
      />
    </main>

    <!-- Bottom Navigation Bar -->
    <BottomNavigation
      :activeTab="currentTab"
      @update:activeTab="switchTab"
      :notificationBadge="notificationBadgeCount"
    />
  </div>
</template>

<script>
import ModalForm from "./components/ModalForm.vue";
import UserCard from "./components/UserCard.vue";
import UserModal from "./components/UserModal.vue";
import EditClientModal from "./components/EditClientModal.vue";
import BottomNavigation from "./components/BottomNavigation.vue";
import NotificationsView from "./components/NotificationsView.vue";
import StatisticsView from "./components/StatisticsView.vue";

export default {
  components: {
    ModalForm,
    UserCard,
    UserModal,
    EditClientModal,
    BottomNavigation,
    NotificationsView,
    StatisticsView,
  },
  data() {
    return {
      API: "https://oil.techinfo.uz/clients",
      users: [],
      currentTab: "users",
      modalVisible: false,
      selectedUser: null,
      searchQuery: "",
      isDark: true,
      activeModal: null,
      loadingNotifications: false,
    };
  },

  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase().trim();
      const numberQuery = query.replace(/\D/g, "");
      if (!query) return this.users;

      return this.users.filter((user) => {
        return (
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.carNumber && user.carNumber.toLowerCase().includes(query)) ||
          (user.phone && user.phone.replace(/\D/g, "").includes(numberQuery))
        );
      });
    },
    notificationBadgeCount() {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      return this.users.filter((user) => {
        if (!user.history || user.history.length === 0) return false;
        const latest = user.history[user.history.length - 1];
        const notifDate = latest.notificationDate 
          ? new Date(latest.notificationDate) 
          : (latest.nextChangeAt ? new Date(latest.nextChangeAt) : null);
        return !notifDate || notifDate <= today;
      }).length;
    },
    computedStats() {
      const totalClients = this.users.length;
      let needNotificationCount = 0;
      let todayCount = 0;
      let overdueCount = 0;
      let thisMonthCount = 0;
      let completedNotifications = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.users.forEach((user) => {
        if (!user.history || user.history.length === 0) return;
        const latest = user.history[user.history.length - 1];

        const notifDate = latest.notificationDate 
          ? new Date(latest.notificationDate) 
          : (latest.nextChangeAt ? new Date(latest.nextChangeAt) : null);
        const nextChange = latest.nextChangeAt ? new Date(latest.nextChangeAt) : null;

        // Check if notification is due: empty/missing notificationDate OR <= today
        const isDue = !notifDate || notifDate <= new Date();

        if (isDue) {
          needNotificationCount++;

          // Overdue if nextChangeAt has passed
          if (nextChange && nextChange < new Date()) {
            overdueCount++;
          }

          if (notifDate) {
            const d = new Date(notifDate);
            d.setHours(0, 0, 0, 0);
            if (d.getTime() === today.getTime()) {
              todayCount++;
            }
            if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
              thisMonthCount++;
            }
          } else {
            // Empty notificationDate is treated as due today
            todayCount++;
          }
        } else {
          completedNotifications++;
        }
      });

      return {
        totalClients,
        needNotification: needNotificationCount,
        today: todayCount,
        overdue: overdueCount,
        thisMonth: thisMonthCount,
        completedNotifications,
      };
    },
  },

  methods: {
    switchTab(tab) {
      this.currentTab = tab;
      this.fetchUsers();
    },
    showUser(user) {
      this.selectedUser = user;
      this.activeModal = "view";
    },

    openEditModal(user) {
      this.selectedUser = user;
      this.activeModal = "edit";
    },

    async saveHistory(item) {
      try {
        const response = await fetch(`${this.API}/${this.selectedUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error("Serverga yozishda xatolik yuz berdi");
        }
        alert("Servis tarixi muvaffaqqiyatli qo'shildi");
        this.fetchUsers();
        
        const updatedClient = await response.json();
        if (this.selectedUser) {
          this.selectedUser.history = updatedClient.history;
        }
      } catch (err) {
        console.error("Xatolik:", err.message);
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDark) {
        document.body.classList.add("active-body");
      } else {
        document.body.classList.remove("active-body");
      }
    },

    openModal() {
      this.modalVisible = true;
    },

    async fetchUsers() {
      try {
        const res = await fetch(this.API);
        const data = await res.json();
        this.users = data.reverse();
      } catch (err) {
        console.error(err);
      }
    },

    async createClient(client) {
      try {
        const res = await fetch(this.API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client)
        });

        if (res.ok) {
          alert("Mijoz qo‘shildi ✅");
          this.modalVisible = false;
          this.fetchUsers();
        } else {
          const err = await res.json();
          alert("Xatolik: " + err.error);
        }
      } catch (err) {
        console.error(err);
        alert("Serverga ulanib bo‘lmadi ❌");
      }
    },

    async deleteUser(id) {
      if (!confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

      try {
        const res = await fetch(`${this.API}/${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("O‘chirildi ✅");
          this.fetchUsers();
        } else {
          alert("O‘chirishda xatolik ❌");
        }
      } catch (err) {
        console.error(err);
      }
    },
    async confirmNotification(clientId) {
      this.loadingNotifications = true;
      try {
        // Try the dedicated confirmation endpoint first
        const res = await fetch(`${this.API}/${clientId}/confirm-notification`, {
          method: "POST",
        });
        
        if (res.ok) {
          alert("Xabarnoma yuborilganligi muvaffaqiyatli tasdiqlandi! ✅");
          await this.fetchUsers();
          return;
        }

        // If 404 or other errors, fall back to updating the latest history record with PUT
        if (res.status === 404 || res.status === 500) {
          console.warn("Dedicated confirm-notification endpoint not found on production server. Falling back to PUT update.");
          
          const client = this.users.find(u => u._id === clientId);
          if (client && client.history && client.history.length) {
            const latest = client.history[client.history.length - 1];
            
            // Calculate next notification date
            let nextDate = latest.nextChangeAt ? new Date(latest.nextChangeAt) : null;
            if (!nextDate || isNaN(nextDate.getTime()) || nextDate <= new Date()) {
              nextDate = new Date();
              nextDate.setDate(nextDate.getDate() + 30);
            }

            // Body payload matching model fields
            const updatedHistoryItem = {
              filledAt: latest.filledAt,
              nextChangeAt: latest.nextChangeAt,
              price: latest.price,
              notificationDate: nextDate,
              oilFilter: latest.oilFilter,
              airFilter: latest.airFilter,
              cabinFilter: latest.cabinFilter,
              klameter: latest.klameter,
              oilBrand: latest.oilBrand
            };

            const putRes = await fetch(`${this.API}/${clientId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedHistoryItem),
            });

            if (putRes.ok) {
              alert("Xabarnoma muvaffaqiyatli tasdiqlandi! (Frontend Fallback) ✅");
              await this.fetchUsers();
              return;
            }
          }
        }

        const err = await res.json();
        alert("Xatolik: " + (err.error || "Tasdiqlab bo'lmadi"));
      } catch (err) {
        console.error(err);
        alert("Tizimga ulanishda xato ❌");
      } finally {
        this.loadingNotifications = false;
      }
    },
  },

  mounted() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.isDark = savedTheme === "dark";
    }
    this.applyTheme();
    this.fetchUsers();
  }
};
</script>

<style>
/* App Layout Container styles */
.app {
  min-height: 100vh;
  padding-bottom: 90px;
  background: var(--bg);
  color: var(--text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-content-area {
  padding-top: 10px;
}

.header {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.logo {
  font-size: 18px;
  font-weight: 800;
  color: #3f8cff;
}

.theme-toggle-container {
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  background: var(--input-bg);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
}

.count-badge {
  background: #3f8cff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}
</style>
