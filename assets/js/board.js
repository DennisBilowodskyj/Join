async function boardInit() {
  init();
  await loadTasks();
  valueAppender();
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
  //   renderCardsProgress("inProgress");
  //   renderCardsAwait("awaitFeedback");
  //   renderCardsDone("done");
}

function renderCardsTodo(status) {
  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    renderCardFunction(status, todo, i);
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
function renderCardDetails() {
  console.log("Should open the dialog!");
}

// ################### Open & Close Layer and Cards ####################
// #####################################################################
function openAddTaskOverlay() {
  document.getElementById("addTaskOverlay").classList.toggle("d_none");
}

function closeAddTaskOverlay() {
  document.getElementById("addTaskOverlay").classList.toggle("d_none");
}

function closeCardDetails() {
  document.getElementById("card_details_bg").classList.add("d_none");
}

function openCardDetails(index) {
  renderCardDetails(index);
  document.getElementById("card_details_bg").classList.remove("d_none");
}

// document.getElementById('addTaskOverlay').classList.toggle("d_none");
document.getElementById("addTaskOverlay").style.transform = "translateX(0)";

function closeAddTaskOverlay() {
  document.getElementById("addTaskOverlay").style.transform =
    "translateX(100%)";
}

// ############################ Card Templets ##########################
// #####################################################################
function renderHeader(task, i) {
  return `<div class="user_cards" onclick="openCardDetails(${i})">
    <div class="user_card_content">
        <div class="category">${task["category"]}</div>
        <div class="text_content_card">
            <div class="titel_content_card">
                ${task["title"]}
            </div>
            <div class="description_content_card">
                ${task["description"]}
            </div>
        </div>`;
}

function renderProgressBar(task, i) {
  let finalSubTasks = calcSubtask(task);
  let sumOfTasks = task["progressValue"].length;
  let calcValueOfProgress = calcValueOfProgressbar(finalSubTasks, sumOfTasks);
  return `<div class="progress_bar_card">
        <progress id="fileSubtask()" max="100" value="${calcValueOfProgress}">
        </progress>
        <div id="calcSubtask(${i})">${finalSubTasks}/${sumOfTasks} Subtask</div>
    </div>`;
}

function renderAssignedPerson(task, i) {
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
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    sum + value;
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

function rightPrioImg(task){
    if (task["prio"] == "urgent") {
        return "./assets/img/board/PrioUrgent.png"
    } else if (task["prio"] == "medium") {
        return "./assets/img/board/PrioMedia.png"
    } else {
        return "./assets/img/board/PrioLight.png"
    }
}