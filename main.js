"use strict"


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



 // model connections

 let model = document.querySelector(".model-user")
 let modelOpenBtn = document.querySelector("#openModal")

 modelOpenBtn.addEventListener("click",function (){
  model.classList.toggle("active")
 })
 model.addEventListener("click", function (item) {
  if (item.target.classList.contains("model-user")) {
    model.classList.remove("active");
  }
});

 document.querySelector('.xicon').addEventListener ('click',function(){
  model.style.display="none"
 })