"use strict";

const theme = document.querySelector(".theme");
const body = document.querySelector("body");
theme.classList.toggle("active-toggle");

theme.addEventListener("click", function () {
  theme.classList.toggle("active-toggle");
  if (theme.classList.contains("active-toggle")) {
    body.classList.add("active-body");
  } else {
    body.classList.remove("active-body");
  }
});

// model connections
const modal = document.querySelector(".model-user");
const modalOpenBtn = document.querySelector("#openModal");
const modalCloseIcon = document.querySelector(".xicon");

modalOpenBtn.addEventListener("click", function () {
  modal.classList.add("active");
});

modalCloseIcon.addEventListener("click", function () {
  modal.classList.remove("active");
});

modal.addEventListener("click", function (event) {
  if (event.target.classList.contains("model-user")) {
    modal.classList.remove("active");
  }
});
// back end integratsiya


const searchInput = document.querySelector(".SearchUser");
const usersContainer = document.querySelector(".user-list"); // Bu containerga user-cardlar joylanadi
let allUsers = []; // barcha userlar saqlanadi

// User card yaratish funksiyasi

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
function createUserCard(user) {
  console.log(user);
  
  return `
    <div class="user-card">
      <div class="user-top">
        <div class="user-name">${user.name}</div>
        <div class="user-phone">${user.phone}</div>
      </div>
      <div class="user-car">🚗 ${user.carNumber}</div>
      <div class="user-oil">🛢 ${user.oilBrand}</div>
      <div class="user-dates">
        <span>⛽ ${formatDate(user.filledAt)}</span>
        <span>🔁 ${formatDate(user.nextChangeAt)}</span>
      </div>
    </div>
  `;
}

// Barcha userlarni ekranga chiqarish
function renderUsers(users) {
  usersContainer.innerHTML = "";
  if (users.length === 0) {
    usersContainer.innerHTML = `<p>Hech qanday mos foydalanuvchi topilmadi</p>`;
    return;
  }
  users.forEach(user => {
    usersContainer.innerHTML += createUserCard(user);
  });
}

// Backenddan ma'lumotlarni olish
let counter = document.querySelector('#counter')
async function getAllUsers() {
  try {
    const res = await fetch('http://localhost:5000/clients');
    const data = await res.json();
    allUsers = data;
    renderUsers(allUsers);
    counter.innerHTML=data.length
  } catch (error) {
    console.log(error);
  }
}

// Search bo‘yicha filtrlash
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  if (value === "") {
    renderUsers(allUsers); // Bo‘sh bo‘lsa barcha userlar
  } else {
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) || 
      user.carNumber.toLowerCase().includes(value.toLowerCase())
    );
    renderUsers(filtered);
  }
});

getAllUsers();





const createBtn = document.querySelector("#clientCreatebtn");

  createBtn.addEventListener("click", async () => {
    const name = document.querySelector("#name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const carNumber = document.querySelector("#car_number").value.trim();
    const carBrand = document.querySelector("#car_brand").value.trim();
    const oilBrand = document.querySelector("#oil_brand").value.trim();
    const filledAt = document.querySelector("#oil_date").value.trim();
    const nextChangeAt = document.querySelector("#next_oil_date").value.trim();

    // 🔐 Agar inputlardan biri bo‘sh bo‘lsa, ogohlantirish chiqarsin
    if (!name || !phone || !carNumber || !carBrand || !oilBrand || !filledAt || !nextChangeAt) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    const client = {
      name,
      phone,
      carNumber,
      carBrand,
      oilBrand,
      filledAt: new Date(filledAt),
      nextChangeAt: new Date(nextChangeAt),
    };

    try {
      const res = await fetch("http://localhost:5000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Mijoz muvaffaqiyatli qo‘shildi ✅");
        // Optional: formani tozalash yoki modalni yopish
        document.getElementById("modal").classList.remove("active");
      } else {
        alert("Xatolik: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Serverga ulanib bo‘lmadi ❌");
    }
  });