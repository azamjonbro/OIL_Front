let theme = document.querySelector(".theme")
let body = document.querySelector("body")
theme.addEventListener("click", function () {
 theme.classList.toggle("active-toggle")
 if (theme.classList.contains("active-toggle")) {
  body.classList.add("active-body")
 }else {
  body.classList.remove("active-body")
 }
 })