function init() {
  includeHTML();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  // activeMenu(); ****************** For later on - to activate the menu hover if the user is on the webside
}


function openPopUpNav(){
    let popupNav = document.getElementById("popupNav");
    popupNav.classList.toggle("d_none");
}
