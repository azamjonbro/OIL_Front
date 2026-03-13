<template>
  <div :class="['app', { 'active-body': isDark }]">
    <header class="header">
      <div class="container header__container">
        <nav class="header__nav">
          <div class="theme" :class="{ 'active-toggle': isDark }" @click="toggleTheme"></div>
          <button class="header-created-btn" @click="openModal">Yaratish</button>
        </nav>
      </div>
    </header>

    <ModalForm
      v-if="modalVisible"
      @close="modalVisible = false"
      @create="createClient($event)"
    />

    <main>
      <section class="users">
        <div class="container user__container">
          <div class="user-header">
            <div class="left">
              <h2>Users</h2>
              <b>{{ users.length }}</b>
            </div>
            <div class="right">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="search"
                class="SearchUser"
              />
              <div class="filterUser" @click="filterForDate">
                <span>♺</span>
              </div>
            </div>
          </div>

          <div class="user-list">
            <UserCard
              v-for="user in filteredUsers"
              :key="user._id"
              :user="user"
              @update="fetchUsers"
              @delete="deleteUser"
              @edit="openEditModal"
              @select="showUser"
            />

            <p v-if="!filteredUsers.length" style="display:flex;justify-content:center">
              Foydalanuvchi mavjud emas
            </p>
          </div>
        </div>
      </section>

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
  </div>
</template>

<script>
import ModalForm from "./components/ModalForm.vue";
import UserCard from "./components/UserCard.vue";
import UserModal from "./components/UserModal.vue";
import EditClientModal from "./components/EditClientModal.vue";

export default {
  components: { ModalForm, UserCard, UserModal, EditClientModal },

  data() {
    return {
      API: "https://oil.techinfo.uz/clients",
      users: [],
      modalVisible: false,
      selectedUser: null,
      searchQuery: "",
      isDark: true,
      activeModal: null,
      sortByNextChange: false
    };
  },

  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase().trim();
      const numberQuery = query.replace(/\D/g, "");

      let result = this.users;

      // 🔍 SEARCH
      if (query) {
        result = result.filter(user =>
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.carNumber && user.carNumber.toLowerCase().includes(query)) ||
          (user.phone && user.phone.replace(/\D/g, "").includes(numberQuery))
        );
      }

      // ♺ SORT BY LAST history.nextChangeAt (closest to today)
      if (this.sortByNextChange) {
        const today = new Date();

        result = [...result].sort((a, b) => {
          const aLast = a.history?.[a.history.length - 1];
          const bLast = b.history?.[b.history.length - 1];

          if (!aLast?.nextChangeAt) return 1;
          if (!bLast?.nextChangeAt) return -1;

          const aDate = new Date(aLast.nextChangeAt);
          const bDate = new Date(bLast.nextChangeAt);

          return Math.abs(aDate - today) - Math.abs(bDate - today);
        });
      }

      return result;
    }
  },

  methods: {
    filterForDate() {
      this.sortByNextChange = !this.sortByNextChange;
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
        const res = await fetch(`${this.API}/${this.selectedUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });

        if (!res.ok) throw new Error("Server xatosi");

        alert("Muvaffaqiyatli saqlandi ✅");
        this.fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Xatolik yuz berdi ❌");
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark;
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
    }
  },

  mounted() {
    this.fetchUsers();
  }
};
</script>

<style>
/* styles here */
</style>
