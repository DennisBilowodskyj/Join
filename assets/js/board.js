async function boardInit() {
  init();
  await loadTasks();
  valueAppender();
  saveFunction();
  await getContacts();
  renderContacts();
}

async function saveFunction() {
  setIdFunction();
  await setItem("tasks", JSON.stringify(tasks));
  filterStatus();
  renderCards();
}

// ####################### Filter Cards on Status ######################
// #####################################################################
let todos = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;
let statusCheck = "todo";

function setIdFunction() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    task.id = i;
  }
}

function filterStatus() {
  todos = tasks.filter((task) => task["status"] == "todo");
  inProgress = tasks.filter((task) => task["status"] == "inProgress");
  awaitFeedback = tasks.filter((task) => task["status"] == "awaitFeedback");
  done = tasks.filter((task) => task["status"] == "done");
}

// ###################### Append Values in Tasks #######################
// #####################################################################
async function valueAppender() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let testSum = task["subtask"].length;
    if ("progressValue" in task && task.progressSum != testSum) {
      let difference = task.progressSum - testSum;
      calcValuesToAppend(task, difference);
    } else if ("progressValue" in task && task["progressValue"].length > 0) {
    } else {
      task.progressValue = [];
      task.progressSum = 0;
      difference = 0;
      calcValuesToAppend(task, difference);
    }
  }
}

function calcValuesToAppend(task, difference) {
  let subtasks = task["subtask"];
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      task.progressValue.push(0);
    }
    task.progressSum = subtasks.length;
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      task.progressValue.splice(subtasks.length, 1);
    }
    task.progressSum = subtasks.length;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      task.progressValue.push(0);
    }
    task.progressSum = subtasks.length;
  }
}

// ####################### Drag and Drop Card ##########################
// #####################################################################
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  let rightID = findIdToremoveHighlight();
  removeHighlight(rightID);
  saveFunction();
}

function highlight(id) {
  document.getElementById(id).classList.add("dragHighlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("dragHighlight");
}

function findIdToremoveHighlight() {
  let status = tasks[currentDraggedElement]["status"];
  if (status == "todo") {
    return "toDoCards";
  } else if (status == "inProgress") {
    return "inProgressCards";
  } else if (status == "awaitFeedback") {
    return "awaitFeedbackCards";
  } else {
    return "doneCards";
  }
}

// ########################## Delete and Edit ##########################
// #####################################################################
async function deleteTask(id) {
  tasks.splice(id, 1);
  closeCardDetails();
  saveFunction();
}

async function editTask(id) {
  taskOnEdit = id;
  closeCardDetails();
  openEditContactDialog(id);
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

function changeTaskButtonOnEdit() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <button class="createBtn d_flex" type="submit">
          <span>Save Task</span>
          <img src="./assets/img/addTask_icons/check.png" />
    </button>`;
}

function changeButtonToRegularAddTask() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <div class="clearBtn d_flex" onclick="clearInput()">
        <span>Clear</span>
        <img src="./assets/img/addTask_icons/cancel.png" />
    </div>
    <button class="createBtn d_flex" type="submit">
        <span>Create Task</span>
        <img src="./assets/img/addTask_icons/check.png" />
    </button>`;
}

function prettyCategory(category) {
  if (category == "user_story") {
    return "User Story";
  } else {
    return "Technical Task";
  }
}

function fillForm(
  titel,
  description,
  assignedToEdit,
  dueDate,
  prio,
  category,
  subtasksEdit
) {
  document.getElementById("taskTitle").value = titel;
  document.getElementById("taskDescription").value = description;
  assignedTo = assignedToEdit;
  document.getElementById("date").value = dueDate;
  setPrio(prio);
  document.getElementById("categoryInput").value = prettyCategory(category);
  categoryFromAddTask = category;
  subtasks = subtasksEdit;
}



function changeEditSettings() {
  document.getElementById("createButton").classList.add("d_none");
  document.getElementById("createButton").classList.remove("d_flex");
  document.getElementById("editButtons").classList.add("d_flex");
  document.getElementById("editButtons").classList.remove("d_none");
}

function saveTaskButton(id) {
  prioCheck();
  tasks[id]["title"] = taskTitle.value;
  tasks[id]["description"] = taskDescription.value;
  tasks[id]["assignedTo"] = assignedTo;
  tasks[id]["date"] = date.value;
  tasks[id]["prio"] = taskPrio;
  // tasks[id]["category"] = categorySelect.value;
  tasks[id]["category"] = categoryFromAddTask;
  tasks[id]["subtask"] = subtasks;
  statusCheck = tasks[id]["status"];
  saveFunction();
  valueAppender();
  closeAddTaskOverlay();
}

// ######################## Overlayer AddTask ##########################
// #####################################################################
function openEditContactDialog(id) {
  let titel = tasks[id]["title"];
  let description = tasks[id]["description"];
  let assignedToEdit = tasks[id]["assignedTo"];
  let dueDate = tasks[id]["date"];
  let prio = tasks[id]["prio"];
  let category = tasks[id]["category"];
  let subtasksEdit = tasks[id]["subtask"];
  statusCheck = tasks[id]["status"];
  fillForm(
    titel,
    description,
    assignedToEdit,
    dueDate,
    prio,
    category,
    subtasksEdit
  );
  necessaryFunctionsToEditTasks(id);
}

function necessaryFunctionsToEditTasks(id) {
  renderAssignedBadges();
  renderSubtasksToEdit();
  changeTaskButtonOnEdit();
  addAssignedToContacts(id);
  CameFrom = "EditTaskFromBoard";
}

async function overlayerAddTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let date = document.getElementById("date").value;
  // let category = document.getElementById("categorySelect").value;
  prioCheck();
  tasks.push({
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    prio: taskPrio,
    // category: category,
    category: categoryFromAddTask,
    subtask: subtasks,
    status: statusCheck,
  });
  saveFunction();
  valueAppender();
  closeAddTaskOverlay();
}

function renderSubtasksToEdit() {
  if (subtasks.length > 0) {
    let subtaskOutput = document.getElementById("subtaskListContainer");
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      renderSubtasksHTML(subtaskOutput, subtask, i);
    }
  }
}

function renderSubtasksHTML(subtaskOutput, subtask, i) {
  let subtaskId = i
  subtaskOutput.innerHTML += `
  <div id="subtask_${subtaskId}" class="subtaskContainer d_flex" ondblclick="editSubtask('${subtaskId}')">
       <li  >${subtask}</li>
       ${generateSubtaskChange(subtaskId)}
  </div>`;     
}

function addAssignedToContacts(id) {
  AssignedPersons = tasks[id].assignedTo;
  for (let i = 0; i < AssignedPersons.length; i++) {
    let AssignedPerson = AssignedPersons[i];
    for (let y = 0; y < contacts.length; y++) {
      let contact = contacts[y];
      addAssignedTrueTest(AssignedPerson, contact);
    }
  }

  function addAssignedTrueTest(AssignedPerson, contact) {
    if (contact.assigned == false || contact.assigned == undefined) {
      if (AssignedPerson.email == contact.email) {
        contact.assigned = true;
      } else {
        contact.assigned = false;
      }
    }
  }
}

// ########################## Searching Cards ##########################
// #####################################################################
function searchingCard() {
  let filterTask = [];
  let wantedTask = inputFieldFinder();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (task["title"].toLowerCase().includes(wantedTask)) {
      filterTask.push(task);
    }
  }
  filterTasksOnSearchingCards(filterTask);
}

function filterTasksOnSearchingCards(fillterdtasks) {
  todos = fillterdtasks.filter((task) => task["status"] == "todo");
  inProgress = fillterdtasks.filter((task) => task["status"] == "inProgress");
  awaitFeedback = fillterdtasks.filter(
    (task) => task["status"] == "awaitFeedback"
  );
  done = fillterdtasks.filter((task) => task["status"] == "done");
  renderCards();
}

function inputFieldFinder() {
  firstField = document.getElementById("searching_form_input");
  secondField = document.getElementById("responseSearching_form_input");
  if (firstField.value.length > 0) {
    return firstField.value.toLowerCase();
  } else if (secondField.value.length > 0) {
    return secondField.value.toLowerCase();
  } else {
    return firstField.value.toLowerCase();
  }
}
