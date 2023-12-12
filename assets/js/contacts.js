let contacts = [
  {
    name: "Albert Einstein",
    email: "albert.einstein@physics.com",
    tel: "+41 14031879 160",
  },
  {
    name: "Adam Sandler",
    email: "adam.sandler@funny.com",
    tel: "+41 09091966 000",
  },
];
let filterLetters = [];
let activeNameList = [];

/**
 * This function is used to create contact informations on the right side.
 *
 * @param {number} id - This id is the position of the Elements name
 */
function showName(id) {
  removeActiveName();
  addORremoveActiveName(id);
  renderContactInformation(id);
  openRensponse();
}

function addORremoveActiveName(id) {
  let markedElement = document.getElementById(`name` + id);
  if (activeNameList.includes(`name` + id)) {
    removeAllActiveElements(markedElement)
  } else {
    markedElement.classList.add("activeName");
    document.getElementById("contact_overview").classList.add("display_flex");
    activeNameList = [];
    activeNameList.push(`name${id}`);
  }
}

function removeActiveName() {
  for (let i = 0; i < activeNameList.length; i++) {
    let activeElement = activeNameList[i];
    document.getElementById(activeElement).classList.remove("activeName");
  }
}

function removeAllActiveElements(markedElement){
    markedElement.classList.remove("activeName");
    document.getElementById("contact_overview").classList.remove("display_flex");
    activeNameList = [];
}

function openRensponse() {
  let screenWidth = window.innerWidth;
  if (screenWidth < 750) {
    document.getElementById("left_container").classList.add("display_none");
    document.getElementById("right_container").classList.add("display_block");
  }
}

function rensponseBackToList() {
  document.getElementById("left_container").classList.remove("display_none");
  document.getElementById("right_container").classList.remove("display_block");
  removeActiveName();
}

function contactInit() {
  init();
  loadNames();
  filterLetter();
}

async function loadNames() {
  try {
    users = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.info("Could not load Contacts");
  }
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
        <div id="contact_Users"></div>`;
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
    "contact_Users"
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
  let name = contacts[id]["name"];
  renderBigCircle(name);
  document.getElementById("name_rightContainer").innerHTML = name;
  renderEditDelete(id);
  renderEmail(id);
  renderPhone(id);
}

function renderBigCircle(name) {
  document.getElementById("big_circle").innerHTML = "";
  document.getElementById("big_circle").innerHTML +=
    initials(name, 0) + initials(name, 1);
}

function renderEditDelete(id) {
  document.getElementById("edit_delete").innerHTML = "";
  document.getElementById("edit_delete").innerHTML = `
    <a>
        <img src="./assets/img/contact_icons/edit.svg"
        onclick="edit(${id})"
        alt="Edit Icon"/>Edit
    </a>
    <a>
        <img src="./assets/img/contact_icons/delete.svg"
        onclick="delete(${id})"
        alt="Delete Icon"/>Delete
    </a>`;
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



// function edit(id){
// }

// function delete(id){
// }
