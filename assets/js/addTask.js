let CameFrom = "addTask";
let taskPrio = 'medium';
let assignedTo = [];
let subtasks = [];
let tasks = [];
let contacts = [];
let taskOnEdit = 0;
let categoryFromAddTask = undefined;
let contactsRendered = false;

async function initAddTask() {
  await init();
  await loadTasks();
  await getContacts();
  renderContacts();
  setPrioBtn(prio_medium, "#FFA800", "prio_medium_white.svg");
}

async function loadTasks() {
  tasks = JSON.parse(await getItem("tasks"));
}
/**
 * open Overlay below Input and mark contacts if assigned
 */
function openAssignedInput() {
  let options = document.getElementById("contactsOverlay");

  options.classList.toggle("d_none");

  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].assigned) {
      markContactAssigned(i);
    } else {
      unmarkContactAssigned(i);
    }
  }
}

/**
 * set a contact as assigned
 * @param {index of contacts-array} i 
 */
function assign(i) {
  contacts[i].assigned = !contacts[i].assigned;

  if (contacts[i].assigned) {
    markContactAssigned(i);
    assignedTo.push(contacts[i]);
  } else {
    unmarkContactAssigned(i);
    let indexToRemove = assignedTo.findIndex(contact => contact.email === contacts[i]["email"]);
    if (indexToRemove !== -1) {
      assignedTo.splice(indexToRemove, 1);
    }
  }
  renderAssignedBadges();
}



/**
 * change css properties when assigned
 */
function markContactAssigned(i) {
  let contactContainer = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`assignedCechbox${i}`);

  contactContainer.classList.add("contactAktive");
  contactContainer.style.backgroundColor = "#2A3647";
  checkbox.src = "./assets/img/addTask_icons/checked-white.png";
}

/**
 * change css proberties to initially
 */
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

async function addTaskTest() {
  if (CameFrom == "addTask") {
    addTask()
  } else if (CameFrom == "AddTaskOnStatus") {
    overlayerAddTask()
  } else if (CameFrom == "EditTaskFromBoard") {
    saveTaskButton(taskOnEdit)
  }
}

async function addTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let date = document.getElementById("date").value;

  prioCheck();
  tasks.push({
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    prio: taskPrio,
    category: categoryFromAddTask,
    subtask: subtasks,
    status: "todo",
  });
  await setItem("tasks", JSON.stringify(tasks));
  clearInput();
}

function setCategory(element) {
  let input = document.getElementById('categoryInput');

  categoryFromAddTask = element.getAttribute('data-value');
  input.placeholder = element.innerHTML;
  openOverlay();
}

function clearCategory() {
  let input = document.getElementById('categoryInput');
  input.placeholder = "Select task category";
}
/**
 * open category-overlay
 */
function openOverlay() {
  const overlay = document.getElementById('categoryOverlay');
  overlay.style.display = 'block';
  overlay.classList.toggle('d_none');

  setCategorytoRequired(overlay);
}

function setCategorytoRequired(overlay) {
  if ((overlay.classList.contains('d_none')) && (overlay.innerHTML == 'Select task category')) {
    categoryInput.setAttribute('required', 'required');
  } else {
    categoryInput.removeAttribute('required');
  }
}

/**
 * set a default priority for undefined tasks
 */
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

  subtaskOutput.innerHTML += generateSubtaskContainerHtml(subtaskId, subtask);
  subtasks.push(subtask);

  resetSubtaskInput();
}

/**
 * generates html for subtask container 
 * @returns html
 */
function generateSubtaskContainerHtml(subtaskId, subtask) {
  return /*html*/ `
  <div id="subtask_${subtaskId}" class="subtaskContainer d_flex" ondblclick="editSubtask('${subtaskId}')">
       <li  >${subtask}</li>
       ${generateSubtaskChange(subtaskId)}
  </div>
`;
}


/**
 * generates html for subtask options button 
 * @returns html
 */
function generateSubtaskChange(subtaskId) {
  return /*html*/ `
        <div class="subtaskChange d_flex">
                <img src="./assets/img/addTask_icons/subtask_edit.png" alt=""  onclick="editSubtask('${subtaskId}')">
                <div class="seperatorSubtask"></div>
                <img src="./assets/img/addTask_icons/subtask_delete.png" alt="" onclick="deleteSubtask('${subtaskId}')">
            </div>
    `;
}


function editSubtask(subtaskId) {
  let subtaskElement = document.getElementById(`subtask_${subtaskId}`);
  let subtaskText = subtaskElement.querySelector("li");
  let subtaskContainer = subtaskElement.closest(".subtaskContainer");

  // make subtask editable
  subtaskText.contentEditable = true;
  subtaskText.focus();

  subtaskContainer.classList.add("subtaskContainerActive");

  // eventlistener to leave editable-modus
  subtaskText.addEventListener("blur", function () {
    subtaskText.contentEditable = false;
    subtasks[subtaskId] = subtaskText.innerHTML;
    subtaskContainer.classList.remove("subtaskContainerActive");
  });

  // eventlistener to leave editable-modus with "Enter"
  subtaskText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      subtaskText.contentEditable = false;
      subtasks[subtaskId] = subtaskText.innerHTML;
      subtaskContainer.classList.remove("subtaskContainerActive");
    }
  });
}

/**
 * close overlays when not focused
 */
document.addEventListener('click', function (event) {
  const contactsOverlay = document.getElementById('contactsOverlay');
  const categoryOverlay = document.getElementById('categoryOverlay');
  const categoryContainer = document.querySelector('.categoryContainer');
  const assignedContainer = document.querySelector('.assignedContainer');

  if (!assignedContainer.contains(event.target) && !contactsOverlay.contains(event.target)) {
    contactsOverlay.classList.add('d_none');
  }
  if (!categoryContainer.contains(event.target)) {
    categoryOverlay.classList.add('d_none');
  }
});


function deleteSubtask(subtaskId) {
  let subtaskContainer = document.getElementById(`subtask_${subtaskId}`);

  subtasks.splice(subtaskId, 1);
  subtaskContainer.remove();
}

async function getContacts() {
  contacts = JSON.parse(await getItem("contacts"));
}
/**
 * render otption button for subtasks oninput
 */
function renderSubtaskBtn() {
  subtaskControls.classList.remove("d_none");
  add_subtaskBtn.classList.add("d_none");
}
/**
 * set the value of subtaskInput to default
 */
function resetSubtaskInput() {
  subtaskInput.value = "";
  subtaskControls.classList.add("d_none");
  add_subtaskBtn.classList.remove("d_none");
}
/**
 * render the initials for the assigned contacts with different colors
 */
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
/**
 * set priority for the task in the global variable and set the button on active
 */
function setPrio(buttonID) {
  taskPrio = buttonID;
  let btnUrgent = document.getElementById("prio_urgent");
  let btnMedium = document.getElementById("prio_medium");
  let btnLow = document.getElementById("prio_low");
  let prioBtn = [btnUrgent, btnMedium, btnLow];

  prioBtn.forEach((btn) => {
    setPrioBtnInactive(btn);
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

function setPrioBtnInactive(btn) {
  btn.style.backgroundColor = "white";
  btn.style.color = "black";
  btn.style.boxShadow = "0px 0px 4px 0px #0000001A";

  let img = btn.querySelector("img");
  img.src = img.src.replace("_white.svg", ".svg");
}
/**
 * set priority to undefined an deselect the Button
 */
function deselectprio() {
  if (taskPrio === "urgent") {
    setPrioBtnInactive(document.getElementById("prio_urgent"));
  } else if (taskPrio === "medium") {
    setPrioBtnInactive(document.getElementById("prio_medium"));
  } else if (taskPrio === "low") {
    setPrioBtnInactive(document.getElementById("prio_low"));
  }
  taskPrio = undefined;
}
/**
 * clear the form
 */
function clearInput() {
  taskTitle.value = "";
  taskDescription.value = "";
  date.value = "";
  subtaskInput.value = "";
  badgesAssignedTo.innerHTML = "";
  subtaskListContainer.innerHTML = "";
  contactsRendered = false;
  resetAssignedContacts();
  assignedTo = [];
  deselectprio();
  clearCategory();
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
/**
 * @returns initials of the contact´s fullname
 */
function getInitials(fullName) {
  const names = fullName.split(" ");
  let initials = "";
  names.forEach((name) => {
    initials += name.charAt(0);
  });
  return initials.toUpperCase();
}
/**
 * set the available due Date to the present day
 */
function setMinDate() {
  const dateField = document.getElementById("date");
  const date = new Date();
  const dateFormated = date.toISOString().split("T")[0];
  dateField.min = dateFormated;
}



