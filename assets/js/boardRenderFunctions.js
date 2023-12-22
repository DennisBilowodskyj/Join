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
  if (todos.length > 0) {
    for (let i = 0; i < todos.length; i++) {
      let todo = todos[i];
      renderCardFunction(status, todo, i);
    }} else {renderEmptyField(status);}
}

function renderCardsProgress(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  if (inProgress.length > 0) {
    for (let i = 0; i < inProgress.length; i++) {
      let inProgressTask = inProgress[i];
      renderCardFunction(status, inProgressTask, i);
    }} else {renderEmptyField(status);}
}

function renderCardsAwait(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  if (awaitFeedback.length > 0) {
    for (let i = 0; i < awaitFeedback.length; i++) {
      let awaitFeedbackTask = awaitFeedback[i];
      renderCardFunction(status, awaitFeedbackTask, i);
    }} else {renderEmptyField(status);}
}

function renderCardsDone(status) {
  document.getElementById(`${status}Cards`).innerHTML = "";
  if (done.length > 0) {
    for (let i = 0; i < done.length; i++) {
      let doneTask = done[i];
      renderCardFunction(status, doneTask, i);
    }} else {renderEmptyField(status);}
}

function renderCardFunction(status, task, i) {
  document.getElementById(`${status}Cards`).innerHTML += `
    ${renderHeader(task, i)} 
    ${renderProgressBar(task)} 
    ${renderAssignedPerson(task, i)} 
    ${renderPrio(task, i)}`;
}

function renderEmptyField(status) {
  document.getElementById(`${status}Cards`).innerHTML = `
    <div class="emptyTasks">No tasks</div>`;
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
    }</div><div>${assignedToText}</div></div>`;
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
                  <img src="${progressCheckOnSubtask(
                    progressValue[i]
                  )}" alt="" />
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
  CameFrom = "AddTaskOnStatus";
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

function closeAddTaskOverlay() {
  clearInput();
  changeButtonToRegularAddTask();
  CameFrom = "addTask";
  document.getElementById("addTaskOverlay").classList.add("d_none");
}

function closeCardDetails() {
  document.getElementById("card_details_bg").classList.add("d_none");
}

function openCardDetails(index) {
  renderCardDetails(index);
  document.getElementById("card_details_bg").classList.remove("d_none");
}

// ############################ Card Templets ##########################
// #####################################################################
function renderHeader(task) {
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

function renderProgressBar(task) {
  let finalSubTasks = calcSubtask(task);
  let sumOfTasks = task["progressValue"].length;
  if (sumOfTasks > 0) {
    let calcValueOfProgress = calcValueOfProgressbar(finalSubTasks, sumOfTasks);
    return `<div class="progress_bar_card">
          <progress id="fileSubtask(${task.id})" max="100" value="${calcValueOfProgress}">
          </progress>
          <div id="calcSubtask(${task.id})">${finalSubTasks}/${sumOfTasks} Subtask</div>
      </div>`;
  } else {
    return `<div class="progress_bar_card"></div>`;
  }
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
