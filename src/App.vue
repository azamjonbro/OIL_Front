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

    <ModalForm v-if="modalVisible" @close="modalVisible = false" @create="createClient($event)" />

    <main>
      <section class="users">
        <div class="container user__container">
          <div class="user-header">
            <div class="left">
              <h2>Users</h2>
              <b>{{ users.length }}</b>
            </div>
            <div class="right">
              <input type="text" v-model="searchQuery" placeholder="search" class="SearchUser" />
            </div>
          </div>
          <div class="user-list">
            <UserCard v-for="user in filteredUsers" :key="user._id" :user="user" @delete="deleteUser"
              @edit="openEditModal" @select="showUser" />

            <p v-if="!filteredUsers.length" style="display: flex; justify-content: center">
              Foydalanuvchi mavjud emas
            </p>
          </div>
        </div>
      </section>
      <EditClientModal v-if="selectedUser && activeModal === 'edit'" :user="selectedUser" :isOpen="true"
        @close="selectedUser = null; activeModal = null" @update="saveHistory" />

      <UserModal v-if="selectedUser && activeModal === 'view'" :user="selectedUser"
        @close="selectedUser = null; activeModal = null" />
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
      // API: 'https://safonon.uz/clients',
      API: "https://safonon.uz/clients",
      users: [],
      modalVisible: false,
      selectedUser: null,
      searchQuery: "",
      isDark: true,
      activeModal: null,
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
  }
  },
  methods: {
    showUser(user) {
      this.selectedUser = user;
      this.activeModal = 'view';
    },
    openEditModal(user) {
      this.selectedUser = user;
      this.activeModal = 'edit';
    },
    async saveHistory(item) {
      try {
        const response = await fetch(this.API+`/${this.selectedUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });

        if (!response.ok) {
          throw new Error('Serverga yozishda xatolik yuz berdi');
        }
        alert("muvaffaqqiyatli qo'shildi")
        this.fetchUsers()
        const updatedClient = await response.json();
        this.user.history = updatedClient.history;

        console.log('Tarix muvaffaqiyatli saqlandi');
      } catch (err) {
        console.error('Xatolik:', err.message);
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
      console.log(client);
      
      try {
        const res = await fetch(this.API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        });
        if (res.ok) {
          alert("Mijoz muvaffaqiyatli qo‘shildi ✅");
          this.modalVisible = false;
          this.fetchUsers();
        } else {
          const err = await res.json();
          alert("Xatolik: " + err.error);
        }
        this.fetchUsers()
      } catch (err) {
        console.error(err);
        alert("Serverga ulanib bo‘lmadi ❌");
      }
    },
    async deleteUser(id) {
      const confirmed = confirm("Rostdan ham o'chirmoqchimisiz?");
      if (!confirmed) return;
      try {
        const res = await fetch(`${this.API}/${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("O‘chirildi ✅");
          this.fetchUsers();
        } else {
          const err = await res.json();
          alert("Xatolik: " + err.message);
        }
      } catch (err) {
        console.error(err);
        alert("O‘chirishda xatolik yuz berdi ❌");
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style>
/* Import your styles here or use Tailwind classes */
</style>
