let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let todos = 0;
let done = 0;
let urgent = 0;
let inBoard = 0;
let inProgress = 0;
let feedback = 0;

/**
 * test json
 */

let tasks = [];

function resetCounters() {
  todos = 0;
  done = 0;
  urgent = 0;
  inBoard = 0;
  inProgress = 0;
  feedback = 0;
}
resetCounters();
async function addToSummary() {
  // task = [
  //   {
  //     title: "test",
  //     description: "beispieltask in datenbank speichern",
  //     duedate: "10.12.2023",
  //     priority: "urgent",
  //     status: "inProgress",
  //   },
  //   {
  //     title: "test",
  //     description: "beispieltask in datenbank speichern",
  //     duedate: "15.01.2024",
  //     priority: "urgent",
  //     status: "feedback",
  //   },
  // ];
  
  await updateTaskCounts();
  updateTodoNumber();   


}



async function summaryInit() {
  init();
  
  await loadUser();
  await loadTasks();
  greet();
  addToSummary(); 
  checkEmailSummary();
  displayEarliestDueDate();
  renderUserName();

   
 

}
async function loadTasks() {
  tasks = JSON.parse(await getItem("tasks"));
}


// function loadTask(){
//   try{
//     task=JSON.parse(await getItem())
//   }
// }

/**
 * daytime and display user
 */
function greet() {
  let hour = new Date().getHours();
  let greeting;

  if (hour < 11) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  document.getElementById("demo").innerHTML = greeting;
}

greet();

function renderUserName(){
  const guestUser = localStorage.getItem("guestUser");
  if (guestUser === "Guest") {
    document.getElementById("userName").innerHTML = "Guest";
  } else {
    document.getElementById("userName").innerHTML = matchingUser.name;
  }
}



/**
 * count tasks
 */
function countTasksByStatus(status) {
  let count = 0;

  tasks.forEach((tasks) => {
    if (tasks.status === status) {
      count++;

      if (tasks.prio === 'urgent') {
        urgent++;
      }
    }
  });
  
  return count;
}

function countAllTasks() {
  return tasks.length;
}


async function updateTaskCounts() {
  todos = countTasksByStatus("todo");
  done = countTasksByStatus("done");
  urgent = countTasksByStatus("urgent");
  inBoard = countAllTasks();
  inProgress = countTasksByStatus("inProgress");
  feedback = countTasksByStatus("awaitFeedback");

}


function updateTodoNumber() {
  document.getElementById("todos").innerText = todos;
  document.getElementById("done").innerText = done;
  document.getElementById("urgent").innerText = urgent;
  document.getElementById("inBoard").innerText = inBoard;
  document.getElementById("inProgress").innerText = inProgress;
  document.getElementById("feedback").innerText = feedback;
}


// display the earliest prio:urgent dueDate
function displayEarliestDueDate() {
  const earliestTask = findEarliestDueDate(tasks);

  if (earliestTask && earliestTask.prio === 'urgent') {
    const earliestDate = new Date(earliestTask.date.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    const monthIndex = earliestDate.getMonth();
    const month = months[monthIndex];
    const formattedDate = `${month} ${earliestDate.getDate()}, ${earliestDate.getFullYear()}`;

    document.getElementById("date").innerHTML = formattedDate;
  } else {
    document.getElementById("date").innerHTML = "No urgent tasks found.";
  }
}

function findEarliestDueDate(tasks) {
  const urgentTasks = tasks.filter(tasks => tasks.prio === 'urgent');

  if (urgentTasks.length === 0) {
    return null; 
  }

  return urgentTasks.reduce((earliest, current) => {
    const currentDate = new Date(current.date.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    const earliestDate = new Date(earliest.date.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    return currentDate < earliestDate ? current : earliest;
  }, urgentTasks[0]); 
}
findEarliestDueDate(tasks);
