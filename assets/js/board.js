async function boardInit() {
  init();
  await loadTasks();
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
        renderCardFunction(status, todo)
    }
}

function renderCardFunction(status, task, i) {
  document.getElementById(`${status}Cards`).innerHTML += `
  ${renderHeader(task,i)} 
  ${renderProgressBar(task, i)} 
  ${renderAssignedPerson(task, i)} 
  ${renderPrio(task, i)}` 
}

// ############################ Render Info ############################
// #####################################################################

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

function openCardDetails() {
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
    // Berechnung der Progressbar muss noch erledigt werden
    return `<div class="progress_bar_card">
        <progress id="fileSubtask()" max="100" value="50"></progress>
        <div id="calcSubtask(${i})">1/2 Subtask</div>
    </div>`
}

function renderAssignedPerson(task, i){
    return `<div class="contact_prio">
    <div class="assigned_list">
      <div class="assigned_person">SB</div>
      <div class="assigned_person">SB</div>
      <div class="assigned_person">SB</div>
      <div class="assigned_person">2+</div>
    </div>`
}
function renderPrio(task, i){
    return `<div class="prio_card">
            <img src="./assets/img/board/PrioUrgent.png" alt="" />
            </div></div></div></div>`
}