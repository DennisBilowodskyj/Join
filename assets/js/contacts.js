let contacts = [];
let filterLetters = [];
let activeNameList = [];

// #################### Inition of the functions #############################
// ###########################################################################
async function contactInit() {
  init();
  await loadContacts();
  filterLetter();
}

// ################## Load and Save User Contacts ############################
// ###########################################################################
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    sortNames(contacts);
  } catch (e) {
    console.info("Could not load Contacts");
  }
}

async function sortNames(daten) {
  daten.sort(function (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

async function saveContact() {
  createButton.disabled = true;
  contactNameUppercase = capitalizedName(contactName.value);
  contacts.push({
    name: contactNameUppercase,
    email: contactEmail.value,
    tel: contactTel.value,
  });
  await setItem("contacts", JSON.stringify(contacts));
  resetForm();
  filterLetters = [];
  await contactInit();
}

function resetForm() {
  contactName.value = "";
  contactEmail.value = "";
  contactTel.value = "";
  createButton.disabled = false;
}

function capitalizedName(Name) {
  let FirstName = Name.split(" ")[0];
  let SecondName = Name.split(" ")[1];
  FirstName = FirstName.charAt(0).toUpperCase() + FirstName.slice(1);
  SecondName = SecondName.charAt(0).toUpperCase() + SecondName.slice(1);
  contactNameUppercase = FirstName + " " + SecondName;
  return contactNameUppercase;
}

// ################## Button and Design funktions ############################
// ###########################################################################
/**
 * This function is used to create contact informations on the right side.
 *
 * @param {number} id - This id is the position of the Elements name
 */
function showName(id) {
  removeActiveName();
  addORremoveActiveName(id);
  renderContactInformation(id);
  responseTestToOpenWindow(id);
}

function removeActiveName() {
  for (let i = 0; i < activeNameList.length; i++) {
    let activeElement = activeNameList[i];
    document.getElementById(activeElement).classList.remove("activeName");
  }
}

function addORremoveActiveName(id) {
  let markedElement = document.getElementById(`name` + id);
  if (activeNameList.includes(`name` + id)) {
    removeAllActiveElements(markedElement);
  } else {
    markedElement.classList.add("activeName");
    document.getElementById("contact_overview").classList.add("display_flex");
    activeNameList = [];
    activeNameList.push(`name${id}`);
  }
}

function removeAllActiveElements(markedElement) {
  markedElement.classList.remove("activeName");
  document.getElementById("contact_overview").classList.remove("display_flex");
  activeNameList = [];
}

function responseTestToOpenWindow(id) {
  let screenWidth = window.innerWidth;
  if (screenWidth <= 750) {
    document.getElementById("contact_overview").classList.add("display_flex");
    openRensponse(id);
  }
}

window.addEventListener('resize', function() {
  let screenWidth = window.innerWidth;
  if (screenWidth >= 750) {
    document.getElementById("left_container").classList.remove("display_none");
  } else if (screenWidth <= 750) {
    document.getElementById("right_container").classList.remove("display_block");
  }
});

function openRensponse() {
  document.getElementById("left_container").classList.add("display_none");
  document.getElementById("right_container").classList.add("display_block");
}

function rensponseBackToList() {
  document.getElementById("left_container").classList.remove("display_none");
  document.getElementById("right_container").classList.remove("display_block");
  removeActiveName();
  activeNameList = [];
}

function filterLetter() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i]["name"];
    let letter = contact.charAt(0);
    appendLetter(letter);
  }
  renderContacts();
}

function renderContacts() {
  document.getElementById("contact_List").innerHTML = "";
  for (let i = 0; i < filterLetters.length; i++) {
    let firstLetter = filterLetters[i];
    document.getElementById("contact_List").innerHTML += `
        <div class="first_Latter">${firstLetter}</div>
        <hr class="name_Seperator" />
        <div id="contact_Users(${firstLetter})"></div>`;
    filterContactNames(firstLetter);
  }
}

function appendLetter(letter) {
  let i = filterLetters.indexOf(letter);
  if (i < 0) {
    filterLetters.push(letter);
  }
}

function filterContactNames(letter) {
  letter = letter.toLowerCase();

  for (let i = 0; i < contacts.length; i++) {
    let name = contacts[i]["name"];
    let email = contacts[i]["email"];
    if (name.toLowerCase().charAt(0).includes(letter)) {
      renderContactNames(i, name, email);
    }
  }
}

function renderContactNames(i, name, email) {
  document.getElementById(
    `contact_Users(${initials(name, 0)})`
  ).innerHTML += `<div class="centersizer">
    <div onclick="showName(${i})" id="name${i}" class="name_contant">
        <div class="nameIcon_leftContainer">${
          initials(name, 0) + initials(name, 1)
        }</div>
            <div>
                <div class="name_leftContainer">${name}</div>
                <div class="email_leftContainer">${email}</div>
            </div>
        </div>
    </div>`;
}

function initials(name, position) {
  let nameArray = name.split(" ");
  return nameArray[position].charAt(0);
}

function renderContactInformation(id) {
  if (id >= 0 && id < contacts.length) {
    let name = contacts[id]["name"];
    renderBigCircle(name);
    document.getElementById("name_rightContainer").innerHTML = name;
    renderEditDelete(id);
    renderResponseEditDelete(id);
    renderEmail(id);
    renderPhone(id);
  }
}

function renderBigCircle(name) {
  document.getElementById("big_circle").innerHTML = "";
  document.getElementById("big_circle").innerHTML +=
    initials(name, 0) + initials(name, 1);
}

function renderEditDelete(id) {
  document.getElementById("edit_delete").innerHTML = "";
  document.getElementById("edit_delete").innerHTML = `
    <a onclick="editContact(${id})">
        <img src="./assets/img/contact_icons/edit.svg"
        alt="Edit Icon"/>Edit
    </a>
    <a onclick="deleteContact(${id})">
        <img src="./assets/img/contact_icons/delete.svg"
        alt="Delete Icon"/>Delete
    </a>`;
}

function renderResponseEditDelete(id) {
  document.getElementById("editDeletOverlay").innerHTML = "";
  document.getElementById("editDeletOverlay").innerHTML = `
  <button onclick="editContact(${id})" class="editDeletOverlayButton">
    <img class="editDeletOverlayIMG" src="./assets/img/contact_icons/edit.svg"/>
      Edit
  </button>
  <button onclick="deleteContact(${id})" class="editDeletOverlayButton">
    <img class="editDeletOverlayIMG" src="./assets/img/contact_icons/delete.svg"
    onclick=""/>
      Delete
  </button>`;
}

function showEditDeletOverlayButton() {
  document.getElementById("editDeletOverlay").classList.add("display_flex");
}

function renderEmail(id) {
  let email = contacts[id]["email"];
  document.getElementById("email_rightContainer").innerHTML = "";
  document.getElementById("email_rightContainer").innerHTML = `
    <span>Email</span>
    <a href="mailto:${email}?subject=Feedback&body=Message">
        ${email}
    </a>`;
}

function renderPhone(id) {
  let tel = contacts[id]["tel"];
  document.getElementById("phone_rightContainer").innerHTML = "";
  document.getElementById("phone_rightContainer").innerHTML = `
    <span>Email</span>
    <a href="mailto:${tel}?subject=Feedback&body=Message">
        ${tel}
    </a>`;
}

// ######### Overlayer Functions for Add, delete and Create Contacts #########
// ###########################################################################
function closeButton() {
  document.getElementById("newContact_bg").classList.add("display_none");
}

function openNewContactDialog() {
  document.getElementById("newContact_bg").classList.remove("display_none");
}

// function editContact(id){
// }

async function deleteContact(id) {
  contacts.splice(id, 1);
  await setItem("contacts", JSON.stringify(contacts));
  removeOptionsAfterDelete(id);
}

function removeOptionsAfterDelete(id) {
  filterLetters = [];
  contactInit();
  showName(id);
  rensponseBackToList();
  hideEditDeletOverlay();
}

document.addEventListener("DOMContentLoaded", function () {
  let menuButton = document.getElementById("editRemoveButtonResponse");
  let menu = document.getElementById("editDeletOverlay");
  document.addEventListener("click", function (event) {
    if (!menuButton.contains(event.target)) {
      menu.classList.remove("display_flex");
    }
  });
});
