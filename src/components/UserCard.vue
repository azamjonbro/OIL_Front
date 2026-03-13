<template>
  <div
    class="user-card grid gap-2 rounded-2xl p-4 shadow hover:shadow-lg transition duration-200 cursor-pointer bg-white dark:bg-gray-800"
    @click="handleSelect">
    <div class="card-title flex justify-between items-center">
      <h3 class="font-semibold text-lg truncate">{{ user.name }}</h3>
      <div class="flex gap-2 justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{
          user.phone
          }}</span>
        <div class="box">
          <span>🚗</span>
          <span class="font-medium">{{ user.carNumber }}</span>
        </div>
        <div class="box">
          <span>🛢</span>
          <span>{{ user.history[user.history.length - 1].oilBrand }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2"></div>
    <div style="display: flex; justify-content: space-between">
      <span>⛽
        {{ formatDate(user.history[user.history.length - 1].filledAt) }}</span>
      <span>🔔
        {{
          formatDate(user.history[user.history.length - 1].notificationDate)
        }}</span>
      <span>🔁
        {{
          formatDate(user.history[user.history.length - 1].nextChangeAt)
        }}</span>
    </div>
    <div class="pricebox" @click.stop>
      <p>{{ formatPrice(user.cash) }}</p>
      <label for="increment" class="incr" style="
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #555;
        ">
        <input id="increment" type="number" placeholder="summa kiriting" v-model="user.increment" />
        <!-- <button @click="incrbutton(user._id)" class="add">Qo'shish</button> -->
        <button @click="decrbutton(user._id)" class="remove">Ayrish</button>
      </label>
    </div>
    <div class="buttonbox">
      <button class="header-created-btn" @click.stop="onEdit">
        O'zgartirish
      </button>
      <button class="delete-btn" @click.stop="onDelete">O'chirish</button>
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
      if (isNaN(d.getTime())) return "-";
      return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
    },
  },
};
</script>

<style scoped>
.user-card {
  /* fallback for users not using Tailwind */
  border: 1px solid rgba(109, 109, 109, 0.78);
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
