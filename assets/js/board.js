async function boardInit() {
  init();
  await loadTasks();
  valueAppender();
  saveFunction();
  await getContacts();
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
    if ("id" in task) {
    } else {
      task.id = i;
    }
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
    if ("progressValue" in task) {
    } else {
      task.progressValue = [];
      calcValuesToAppend(task);
    }
  }
}

function calcValuesToAppend(task) {
  let subtasks = task["subtask"];
  for (let i = 0; i < subtasks.length; i++) {
    task.progressValue.push(0);
  }
}
// ########################### Render Cards ############################
// #####################################################################
function renderCards() {
  renderCardsTodo("toDo");
  renderCardsProgress("inProgress");
  renderCardsAwait("awaitFeedback");
  renderCardsDone("done");
}

function renderCardsTodo(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    renderCardFunction(status, todo, i);
  }
}

function renderCardsProgress(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  for (let i = 0; i < inProgress.length; i++) {
    let inProgressTask = inProgress[i];
    renderCardFunction(status, inProgressTask, i);
  }
}

function renderCardsAwait(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  for (let i = 0; i < awaitFeedback.length; i++) {
    let awaitFeedbackTask = awaitFeedback[i];
    renderCardFunction(status, awaitFeedbackTask, i);
  }
}

function renderCardsDone(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  for (let i = 0; i < done.length; i++) {
    let doneTask = done[i];
    renderCardFunction(status, doneTask, i);
  }
}

function renderCardFunction(status, task, i) {
  document.getElementById(`${status}Cards`).innerHTML += `
  ${renderHeader(task, i)} 
  ${renderProgressBar(task, i)} 
  ${renderAssignedPerson(task, i)} 
  ${renderPrio(task, i)}`;
}

// ############################ Render Info ############################
// #####################################################################
function renderCardDetails(index) {
  renderCardDetailsHeader(index);
  renderCardDetailsTitel(index);
  renderCardDetailsDescription(index);
  renderCardDetailsDate(index);
  renderCardDetailsPriority(index);
  renderCardDetailsAssignedTo(index);
  renderCardDetailsSubTasks(index);
  renderCardDetailsDeleteEdit(index);
}

function renderCardDetailsHeader(index) {
  let category = tasks[index]["category"];
  category = changeCategoryValue(category);
  let color = categoryColorCheck(category);
  let header = document.getElementById("cardDetails_header");
  header.innerHTML = `<div class="category" 
  style="background-color: #${color}">${category}</div>
    <a onclick="closeCardDetails()" class="cardCloseButton">
      <img src="./assets/img/board/close.png" alt="" />
    </a>`;
}

function changeCategoryValue(category) {
  if (category == "technical_task") {
    return "Technical Task";
  } else if (category == "user_story") {
    return "User Story";
  } else {
    return "Standard Task";
  }
}

function renderCardDetailsTitel(index) {
  let titelText = tasks[index]["title"];
  let titelSection = document.getElementById("cardDetails_titel");
  titelSection.innerHTML = `<h2>${titelText}</h2>`;
}

function renderCardDetailsDescription(index) {
  let descriptionText = tasks[index]["description"];
  let descriptionSection = document.getElementById("cardDetails_description");
  descriptionSection.innerHTML = `${descriptionText}`;
}

function renderCardDetailsDate(index) {
  let dateText = tasks[index]["date"].split("-");
  let year = dateText[0];
  let month = dateText[1];
  let day = dateText[2];
  let dateSection = document.getElementById("cardDetails_date");
  dateSection.innerHTML = `${day}/${month}/${year}`;
}

function renderCardDetailsPriority(index) {
  let standardPrioText = tasks[index];
  prioText = standardPrioText["prio"];
  prioText = prioText.charAt(0).toUpperCase() + prioText.slice(1);
  let prioImg = rightPrioImg(standardPrioText);
  let prioSection = document.getElementById("cardDetails_prio");
  prioSection.innerHTML = `
    ${prioText} <img src="${prioImg}" alt="" />`;
}

function renderCardDetailsAssignedTo(index) {
  let assignedToArray = tasks[index]["assignedTo"];
  //   let prioImg = calcAssignedPersons(task);
  let assignedToSection = document.getElementById("assignedToCardName");
  assignedToSection.innerHTML = ``;
  for (let i = 0; i < assignedToArray.length; i++) {
    let assignedToText = assignedToArray[i].name;
    let assignedToColor = assignedToArray[i].color;
    assignedToSection.innerHTML += `
    <div class="assignedToCardNameValue">
        <div class="assignedToCardCyrcle" 
        style="background-color: #${assignedToColor};">${
      initialsAssignedTo(assignedToText, 0) +
      initialsAssignedTo(assignedToText, 1)
    }</div>
        <div>${assignedToText}</div>
    </div>`;
  }
}

function renderCardDetailsSubTasks(index) {
  let subTasksSection = document.getElementById("renderSubtasksToCard");
  subTasksSection.innerHTML = "";
  let subTasks = tasks[index]["subtask"];
  let progressValue = tasks[index]["progressValue"];
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i];
    subTasksSection.innerHTML += `
        <div class="renderSubtasksToCard" 
        onclick="addProgress(${index}, ${i})">
            <div>
                <img src="${progressCheckOnSubtask(progressValue[i])}" alt="" />
            </div>
            <div>${subTask}</div>
        </div>`;
  }
}

function progressCheckOnSubtask(progressValue) {
  if (progressValue == 1) {
    return "./assets/img/board/checkButton.png";
  } else {
    return "./assets/img/board/noneCheckButton.png";
  }
}

async function addProgress(task, subtask) {
  if (tasks[task]["progressValue"][subtask] == 0) {
    tasks[task]["progressValue"][subtask]++;
  } else if (tasks[task]["progressValue"][subtask] == 1) {
    tasks[task]["progressValue"][subtask]--;
  }
  renderCardDetailsSubTasks(task);
  saveFunction();
}

function renderCardDetailsDeleteEdit(index) {
  let deleteEdit = document.getElementById("deleteEditCard");
  deleteEdit.innerHTML = `<div class="deleteEditCardContent">
    <div class="renderDeleteEditCardContent" onclick="deleteTask(${index})">
      <img src="./assets/img/board/delete.png" alt="" />
      <div>Delete</div>
    </div>
    <hr />
    <div class="renderDeleteEditCardContent" onclick="editTask(${index})">
      <img src="./assets/img/board/edit.png" alt="" />
      <div>Edit</div>
    </div>
  </div>`;
}

// ################### Open & Close Layer and Cards ####################
// #####################################################################
function openAddTaskOverlay(status) {
  statusCheck = status;
  let submitFunction = document.getElementById("addTaksForm");
  submitFunction.onsubmit = overlayerAddTask;
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

function closeAddTaskOverlay() {
  clearInput();
  changeButtonToRegularAddTask();
  document.getElementById("addTaskOverlay").classList.add("d_none");
}

function closeCardDetails() {
  document.getElementById("card_details_bg").classList.add("d_none");
}

function openCardDetails(index) {
  renderCardDetails(index);
  document.getElementById("card_details_bg").classList.remove("d_none");
}

// document.getElementById("addTaskOverlay").style.transform = "translateX(0)";

// function closeAddTaskOverlay() {
//   document.getElementById("addTaskOverlay").style.transform =
//     "translateX(100%)";
// }

// ############################ Card Templets ##########################
// #####################################################################
function renderHeader(task, i) {
  let category = changeCategoryValue(task["category"]);
  let color = categoryColorCheck(category);
  return `<div class="user_cards" draggable="true" ondragstart="startDragging(${task.id})"
  onclick="openCardDetails(${task.id})">
    <div class="user_card_content"> <div class="category" 
        style="background-color: #${color}">${category}</div>
        <div class="text_content_card">
            <div class="titel_content_card">
                ${task["title"]}
            </div>
            <div class="description_content_card">
                ${task["description"]}
            </div></div>`;
}

function renderProgressBar(task, i) {
  let finalSubTasks = calcSubtask(task);
  let sumOfTasks = task["progressValue"].length;
  let calcValueOfProgress = calcValueOfProgressbar(finalSubTasks, sumOfTasks);
  return `<div class="progress_bar_card">
        <progress id="fileSubtask(${task.id})" max="100" value="${calcValueOfProgress}">
        </progress>
        <div id="calcSubtask(${task.id})">${finalSubTasks}/${sumOfTasks} Subtask</div>
    </div>`;
}

function renderAssignedPerson(task) {
  return `<div class="contact_prio">
    <div class="assigned_list">
    ${calcAssignedPersons(task)}
    </div>`;
}
function renderPrio(task, i) {
  return `<div class="prio_card">
            <img src="${rightPrioImg(task)}" alt="" />
            </div></div></div></div>`;
}

function calcSubtask(task) {
  let sum = 0;
  let values = task["progressValue"];
  if (values.length > 0) {
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      sum += value;
    }
  }
  return sum;
}

function calcValueOfProgressbar(finalSubTasks, sumOfTasks) {
  let progressBarValue = 0;
  progressBarValue = (finalSubTasks / sumOfTasks) * 100;
  return progressBarValue;
}

function calcAssignedPersons(task) {
  let assignedToHTML = "";
  for (let i = 0; i < task["assignedTo"].length; i++) {
    let assignedTo = task["assignedTo"][i];
    assignedToHTML += `<div class="assigned_person" 
    style = "background-color: #${assignedTo.color};">${
      initialsAssignedTo(assignedTo.name, 0) +
      initialsAssignedTo(assignedTo.name, 1)
    }</div>`;
  }
  return assignedToHTML;
}

function initialsAssignedTo(name, position) {
  let nameArray = name.split(" ");
  return nameArray[position].charAt(0);
}

function rightPrioImg(task) {
  if (task["prio"] == "urgent") {
    return "./assets/img/board/PrioUrgent.png";
  } else if (task["prio"] == "medium") {
    return "./assets/img/board/PrioMedia.png";
  } else {
    return "./assets/img/board/PrioLight.png";
  }
}

function categoryColorCheck(category) {
  if (category == "Technical Task") {
    return "1FD7C1";
  } else if (category == "User Story") {
    return "0938FF";
  } else {
    return "808080";
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
  closeCardDetails();
  openEditContactDialog(id);
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

function openEditContactDialog(id) {
  let titel = tasks[id]["title"];
  let description = tasks[id]["description"];
  //   let assignedTo = tasks[id]["assignedTo"];
  let dueDate = tasks[id]["date"];
  let prio = tasks[id]["prio"];
  let category = tasks[id]["category"];
  //   let subtasks = tasks[id]["subtask"];
  statusCheck = tasks[id]["status"];
  fillForm(titel, description, assignedTo, dueDate, prio, category, subtasks);
  changeOnSubmitFunction(id);
  changeTaskButtonOnEdit();
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

function changeOnSubmitFunction(id) {
  let submitFunction = document.getElementById("addTaksForm");
  submitFunction.onsubmit = saveTaskButton;
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

function fillForm(
  titel,
  description,
  assignedTo,
  dueDate,
  prio,
  category,
  subtasks
) {
  document.getElementById("taskTitle").value = titel;
  document.getElementById("taskDescription").value = description;
  //   document.getElementById("contactName").value = assignedTo;
  document.getElementById("date").value = dueDate;
  setPrio(prio);
  document.getElementById("categorySelect").value = category;
  //   document.getElementById("contactTel").value = subtasks;
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
  tasks[id]["category"] = categorySelect.value;
  tasks[id]["subtask"] = subtasks;
  statusCheck = tasks[id]["status"];
  saveFunction();
  valueAppender();
}

// ######################## Overlayer AddTask ##########################
// #####################################################################
async function overlayerAddTask() {
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
    status: statusCheck,
  });
  saveFunction();
  valueAppender();
  closeAddTaskOverlay();
  return false
}
