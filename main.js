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
