/**
 * initiates functions in board, which are triggered when loading
 */
async function boardInit() {
  init();
  await loadTasks();
  valueAppender();
  saveFunction();
  await getContacts();
  renderContacts();
}

/**
 * When this function is called, it triggers some additional functions that are necessary when saving the values
 */
async function saveFunction() {
  setIdFunction();
  await setItem("tasks", JSON.stringify(tasks));
  filterStatus();
  renderCards();
}

// ####################### Filter Cards on Status ######################
/**
 * Creates some parameters that are needed globally
 */
let todos = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;
let currentMenuOpen = "";
let statusCheck = "todo";
let wasSubmenuOpen = false;

/**
 * This function assigns an ID to all tasks
 */
function setIdFunction() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    task.id = i;
  }
}

/**
 * This function divides the tasks into different categories
 */
function filterStatus() {
  todos = tasks.filter((task) => task["status"] == "todo");
  inProgress = tasks.filter((task) => task["status"] == "inProgress");
  awaitFeedback = tasks.filter((task) => task["status"] == "awaitFeedback");
  done = tasks.filter((task) => task["status"] == "done");
}

// ###################### Append Values in Tasks #######################
/**
 * This function checks whether SubTasks exist and whether they were already known before the last call was saved.
 * If distinctions were found, the function calcValuesToAppend is called
 */
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

/**
 * Depending on whether distinctions were found in the valueAppender function. New values ​​are added or deleted here
 *
 * @param {Array} task
 * @param {number} difference
 */
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
/**
 * This function is triggered when a card is lifted and its ID is stored in the global variable currentDraggedElement
 *
 * @param {number} id
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Function allows to drop the card at the desired location when carrying out an event
 *
 * @param {event} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * The function is triggered when ondrop and gives the card the new function in status
 *
 * @param {string} status
 */
function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  let rightID = findIdToRemoveHighlight();
  removeHighlight(rightID);
  saveFunction();
}

/**
 * Function highlights the area over which you can drop the card when hovering over the area
 *
 * @param {number} id
 */
function highlight(id) {
  document.getElementById(id).classList.add("dragHighlight");
}

/**
 * Function ensures that the area is no longer highlighted when you leave the area with the card
 *
 * @param {number} id
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("dragHighlight");
}

/**
 * Is called in the moveTo() function in order to be able to execute the removeHighlight() function when the cacrd is dropped
 *
 * @returns status of the dropped Card
 */
function findIdToRemoveHighlight() {
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

// ###################### Open and Close Submenu #######################
/**
 * Allows you to open the submenu without opening the card information
 *
 * @param {event} event
 * @param {number} taskId
 */
function openPositionMenu(event, taskId) {
  event.stopPropagation();
  let positionNav = document.getElementById(`positionNav${taskId}`);
  positionNav.classList.remove("d_none");
  currentMenuOpen = taskId;
  currentDraggedElement = taskId;
  wasSubmenuOpen = true;
}

/**
 * Closes submenu when you press another area
 */
document.addEventListener("click", function (event) {
  let positionNav = document.getElementById(`positionNav${currentMenuOpen}`);
  if (wasSubmenuOpen) {
    if (
      !positionNav.contains(event.target) &&
      event.target.id !== "responseDragAndDropButton"
    ) {
      positionNav.classList.add("d_none");
    }
  }
});

// ########################## Delete and Edit ##########################
/**
 * This function is executed when you click on the Delete button and deletes the task with the number ID
 *
 * @param {number} id
 */
async function deleteTask(id) {
  tasks.splice(id, 1);
  closeCardDetails();
  saveFunction();
}

/**
 * Opens the overlayer to change the desired ID
 *
 * @param {number} id
 */
async function editTask(id) {
  taskOnEdit = id;
  closeCardDetails();
  openEditContactDialog(id);
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

/**
 * Changes the execute button in the overlayer if the editTask() function was previously listed
 */
function changeTaskButtonOnEdit() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <button class="createBtn d_flex" type="submit">
          <span>Save Task</span>
          <img src="../assets/img/addTask_icons/check.png" />
    </button>`;
}

/**
 * Changes the button to the normal state when a new task is created
 */
function changeButtonToRegularAddTask() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <div class="clearBtn d_flex" onclick="clearInput()">
        <span>Clear</span>
        <img src="../assets/img/addTask_icons/cancel.png" />
    </div>
    <button class="createBtn d_flex" type="submit">
        <span>Create Task</span>
        <img src="../assets/img/addTask_icons/check.png" />
    </button>`;
}

/**
 * This function makes the Category output more beautiful
 *
 * @param {string} category
 * @returns A nice version of the category
 */
function prettyCategory(category) {
  if (category == "user_story") {
    return "User Story";
  } else {
    return "Technical Task";
  }
}

/**
 * This function fills the shape with the contents of the current card so that they can be changed
 *
 * @param {string} titel
 * @param {string} description
 * @param {Array} assignedToEdit
 * @param {date} dueDate
 * @param {string} prio
 * @param {string} category
 * @param {Array} subtasksEdit
 */
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

/**
 * Makes the different buttons visible, which are necessary to change or create the tasks
 */
function changeEditSettings() {
  document.getElementById("createButton").classList.add("d_none");
  document.getElementById("createButton").classList.remove("d_flex");
  document.getElementById("editButtons").classList.add("d_flex");
  document.getElementById("editButtons").classList.remove("d_none");
}

/**
 * The function passes the changed values ​​to the card with the number ID
 *
 * @param {number} id
 */
function saveTaskButton(id) {
  prioCheck();
  tasks[id]["title"] = taskTitle.value;
  tasks[id]["description"] = taskDescription.value;
  tasks[id]["assignedTo"] = assignedTo;
  tasks[id]["date"] = date.value;
  tasks[id]["prio"] = taskPrio;
  tasks[id]["category"] = categoryFromAddTask;
  tasks[id]["subtask"] = subtasks;
  statusCheck = tasks[id]["status"];
  saveFunction();
  valueAppender();
  showTaskAddedOverlay();
  setTimeout(() => {
    closeAddTaskOverlay();
    hideTaskAddedOverlay();
  }, 1500);
}

// ######################## Overlayer AddTask ##########################
/**
 * This function creates variables and fills them with the values ​​of the card with the number ID and calls other functions to make changes
 *
 * @param {number} id
 */
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

/**
 * This function calls other functions that are necessary for processing the tasks
 *
 * @param {number} id
 */
function necessaryFunctionsToEditTasks(id) {
  renderAssignedBadges();
  renderSubtasksToEdit();
  changeTaskButtonOnEdit();
  addAssignedToContacts(id);
  CameFrom = "EditTaskFromBoard";
}

/**
 * This function is called when the tasks are created.
 */
async function overlayerAddTask() {
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
    status: statusCheck,
  });
  saveFunction();
  valueAppender();
  showTaskAddedOverlay();
  setTimeout(() => {
    closeAddTaskOverlay();
    hideTaskAddedOverlay();
  }, 1500);
}

/**
 * This function displays the existing subtasks and displays them in the overlayer for editing
 */
function renderSubtasksToEdit() {
  if (subtasks.length > 0) {
    let subtaskOutput = document.getElementById("subtaskListContainer");
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      renderSubtasksHTML(subtaskOutput, subtask, i);
    }
  }
}

/**
 * This function outputs the HTML code for the renderSubtasksToEdit() function
 *
 * @param {string} subtaskOutput
 * @param {string} subtask
 * @param {number} i
 */
function renderSubtasksHTML(subtaskOutput, subtask, i) {
  let subtaskId = i;
  subtaskOutput.innerHTML += `
  <div id="subtask_${subtaskId}" class="subtaskContainer d_flex" ondblclick="editSubtask('${subtaskId}')">
       <li  >${subtask}</li>
       ${generateSubtaskChange(subtaskId)}
  </div>`;
}

/**
 * This function renders the people assigned to the task
 *
 * @param {number} id
 */
function addAssignedToContacts(id) {
  AssignedPersons = tasks[id].assignedTo;
  for (let i = 0; i < AssignedPersons.length; i++) {
    let AssignedPerson = AssignedPersons[i];
    for (let y = 0; y < contacts.length; y++) {
      let contact = contacts[y];
      addAssignedTrueTest(AssignedPerson, contact);
    }
  }
}

/**
 * This function checks whether a person in Contacts has already been assigned to the task that is being processed
 * 
 * @param {string} AssignedPerson 
 * @param {string} contact 
 */
function addAssignedTrueTest(AssignedPerson, contact) {
  if (contact.assigned == false || contact.assigned == undefined) {
    if (AssignedPerson.email == contact.email) {
      contact.assigned = true;
    } else {
      contact.assigned = false;
    }
  }
}

// ########################## Searching Cards ##########################
/**
 * This function starts the search for the values ​​in the search field
 */
function searchingCard() {
  let filterTask = [];
  let wantedTask = inputFieldFinder();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (
      task["title"].toLowerCase().includes(wantedTask) ||
      task["description"].toLowerCase().includes(wantedTask)
    ) {
      filterTask.push(task);
    }
  }
  filterTasksOnSearchingCards(filterTask);
}

/**
 * This function renders the found cards from the searchingCard() function
 * 
 * @param {Array} fillterdtasks 
 */
function filterTasksOnSearchingCards(fillterdtasks) {
  todos = fillterdtasks.filter((task) => task["status"] == "todo");
  inProgress = fillterdtasks.filter((task) => task["status"] == "inProgress");
  awaitFeedback = fillterdtasks.filter(
    (task) => task["status"] == "awaitFeedback"
  );
  done = fillterdtasks.filter((task) => task["status"] == "done");
  renderCards();
}

/**
 * This function ensures that the input text is written the same as the searched text
 * 
 * @returns The text entered for the search
 */
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
