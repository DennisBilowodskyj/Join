let taskPrio;
let assignedTo = [];
let subtasks = [];
let tasks = [];
let contacts = [];

let contactsRendered = false;

async function initAddTask() {
  await init();
  await loadTasks();
  await getContacts();
  renderContacts();
}

async function loadTasks() {
  tasks = JSON.parse(await getItem("tasks"));
}

function openAssignedInput() {
  let options = document.getElementById("contactsOverlay");

  options.classList.toggle("d_none");
  // Überprüfen, ob ein Kontakt zugewiesen ist
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].assigned) {
      markContactAssigned(i);
    } else {
      unmarkContactAssigned(i);
    }
  }
}

function assign(i) {
    // Toggle assigned status
    contacts[i].assigned = !contacts[i].assigned;

    if (contacts[i].assigned) {
        markContactAssigned(i);
        assignedTo.push(contacts[i]);
    } else {
        unmarkContactAssigned(i);
        let indexToRemove = assignedTo.findIndex(contact => contact === contacts[i]);
        if (indexToRemove !== -1) {
            assignedTo.splice(indexToRemove, 1);
        }
    }
    renderAssignedBadges();
}


function markContactAssigned(i) {
  let contactContainer = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`assignedCechbox${i}`);

  contactContainer.classList.add("contactAktive");
  contactContainer.style.backgroundColor = "#2A3647";
  checkbox.src = "./assets/img/addTask_icons/checked-white.png";
}

function unmarkContactAssigned(i) {
  let contactContainer = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`assignedCechbox${i}`);

  contactContainer.classList.remove("contactAktive");
  contactContainer.style.backgroundColor = "";
  checkbox.src = "./assets/img/addTask_icons/check_button.png";
}

function resetAssignedContacts() {
  contacts.forEach((contact) => {
    contact.assigned = false;
  });
}

async function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("categorySelect").value;
  prioCheck();
  tasks.push({
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    prio: taskPrio,
    category: category,
    subtask: subtasks,
    status: "todo",
  });
  await setItem("tasks", JSON.stringify(tasks));
  clearInput();
}

function prioCheck() {
  if (taskPrio === undefined) {
    taskPrio = "medium";
  }
}

function addSubtask() {
  let subtaskInput = document.getElementById("subtaskInput");
  let subtaskOutput = document.getElementById("subtaskListContainer");

  let subtask = subtaskInput.value;
  let subtaskId = subtasks.length;

  subtaskOutput.innerHTML += /*html*/ `
       <div id="subtask_${subtaskId}" class="subtaskContainer d_flex" ondblclick="editSubtask('${subtaskId}')">
            <li  >${subtask}</li>
            ${generateSubtaskChange(subtaskId)}

       </div>
    `;
  subtasks.push(subtask);

  resetSubtaskInput();
}

function generateSubtaskChange(subtaskId) {
  return /*html*/ `
        <div class="subtaskChange d_flex">
                <img src="./assets/img/addTask_icons/subtask_edit.png" alt=""  onclick="editSubtask('${subtaskId}')">
                <div class="seperatorSubtask"></div>
                <img src="./assets/img/addTask_icons/subtask_delete.png" alt="" onclick="deleteSubtask('${subtaskId}')">
            </div>
    `;
}

// Edit subtask
function editSubtask(subtaskId) {
  let subtaskElement = document.getElementById(`subtask_${subtaskId}`);
  let subtaskText = subtaskElement.querySelector("li");
  let subtaskContainer = subtaskElement.closest(".subtaskContainer");

  // Element bearbeitbar machen
  subtaskText.contentEditable = true;
  subtaskText.focus();

  subtaskContainer.classList.add("subtaskContainerActive");

  // Eventlistener für Verlassen des Editiermodus (Blur-Event)
  subtaskText.addEventListener("blur", function () {
    subtaskText.contentEditable = false;
    subtasks[subtaskId] = subtaskText.innerHTML;
    subtaskContainer.classList.remove("subtaskContainerActive");
  });

  // Eventlistener für Drücken der Enter-Taste
  subtaskText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      subtaskText.contentEditable = false;
      subtasks[subtaskId] = subtaskText.innerHTML;
      subtaskContainer.classList.remove("subtaskContainerActive");
    }
  });
}

// delete subtask
function deleteSubtask(subtaskId) {
  let subtaskContainer = document.getElementById(`subtask_${subtaskId}`);

  subtasks.splice(subtaskId, 1);

  subtaskContainer.remove();
}

async function getContacts() {
  contacts = JSON.parse(await getItem("contacts"));
}

function renderSubtaskBtn() {
  subtaskControls.classList.remove("d_none");
  add_subtaskBtn.classList.add("d_none");
}

function resetSubtaskInput() {
  subtaskInput.value = "";
  subtaskControls.classList.add("d_none");
  add_subtaskBtn.classList.remove("d_none");
}

function renderAssignedBadges() {
  let badgesContainer = document.getElementById("badgesAssignedTo");
  badgesContainer.innerHTML = "";

  assignedTo.forEach((contact) => {
    let initials = getInitials(contact.name);
    badgesContainer.innerHTML += `
            <div class="contactBadge" style="background-color: #${contact.color};">${initials}</div>
        `;
  });
}

function setPrio(buttonID) {
  taskPrio = buttonID;
  let btnUrgent = document.getElementById("prio_urgent");
  let btnMedium = document.getElementById("prio_medium");
  let btnLow = document.getElementById("prio_low");
  let prioBtn = [btnUrgent, btnMedium, btnLow];

  prioBtn.forEach((btn) => {
    setPrioInactive(btn);
  });
  if (taskPrio === "urgent") {
    setPrioBtn(btnUrgent, "#FF3D00", "prio_urgent_white.svg");
  } else if (taskPrio === "medium") {
    setPrioBtn(btnMedium, "#FFA800", "prio_medium_white.svg");
  } else if (taskPrio === "low") {
    setPrioBtn(btnLow, "#7AE229", "prio_low_white.svg");
  }
}

function setPrioBtn(btnID, bgColor, imgSrc) {
  btnID.style.backgroundColor = bgColor;
  btnID.style.color = "white";
  btnID.style.boxShadow = "0px 4px 4px 0px #00000040";
  let img = btnID.querySelector("img");
  img.src = "./assets/img/addTask_icons/" + imgSrc;
}

function setPrioInactive(btn) {
  btn.style.backgroundColor = "white";
  btn.style.color = "black";
  btn.style.boxShadow = "0px 0px 4px 0px #0000001A";

  let img = btn.querySelector("img");
  img.src = img.src.replace("_white.svg", ".svg");
}

function deselectprio() {
  if (taskPrio === "urgent") {
    setPrioInactive(document.getElementById("prio_urgent"));
  } else if (taskPrio === "medium") {
    setPrioInactive(document.getElementById("prio_medium"));
  } else if (taskPrio === "low") {
    setPrioInactive(document.getElementById("prio_low"));
  }
  taskPrio = undefined;
}

function clearInput() {
  taskTitle.value = "";
  taskDescription.value = "";
  date.value = "";
  subtaskInput.value = "";
  badgesAssignedTo.innerHTML = "";
  categorySelect.value = "";
  subtaskListContainer.innerHTML = "";
  contactsRendered = false;
  resetAssignedContacts();
  assignedTo = [];
  deselectprio();
}

function renderContacts() {
  let contactsOverlay = document.getElementById("contactsContent");

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials = getInitials(contact.name);

    contactsOverlay.innerHTML += generateContactsHTML(i, contact, initials);
  }
}

function generateContactsHTML(i, contact, initials) {
  return /*html*/ `
         <div class="contact d_flex" id='contact${i}' onclick="assign(${i})">
                 <div class="contactLeft d_flex">
                     <div class="contactBadge" style="background-color: #${contact.color};">${initials}</div>
                    <div class="contactName"><span>${contact.name}</span></div>
                 </div>
                <div class="contactRight">
                    <img id="assignedCechbox${i}" src="./assets/img/addTask_icons/check_button.png" alt="">
                </div>
            </div>
    `;
}

function getInitials(fullName) {
  const names = fullName.split(" ");
  let initials = "";
  names.forEach((name) => {
    initials += name.charAt(0);
  });
  return initials.toUpperCase();
}

function setMinDate() {
  const dateField = document.getElementById("date");
  const date = new Date();
  const dateFormated = date.toISOString().split("T")[0];
  dateField.min = dateFormated;
}

function createContact() {
  alert("new contact");
}
