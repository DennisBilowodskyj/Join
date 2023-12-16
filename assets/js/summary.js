let todos = 0;
let done = 0;
let urgent = 0;
let inBoard = 0;
let inProgress = 0;
let feedback = 0;

/**
 * test json
 */

let task = [];

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
  task = [
    {
      title: "test",
      description: "beispieltask in datenbank speichern",
      "due date": "10.12.2023",
      priority: "urgent",
      status: "inProgress",
    },
    {
      title: "test",
      description: "beispieltask in datenbank speichern",
      "due date": "10.12.2023",
      priority: "urgent",
      status: "feedback",
    },
  ];

  await updateTaskCounts();
  updateTodoNumber();
}
function summaryInit() {
  init();
  addToSummary();
  greetByUser();
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

async function greetByUser(){
  const users = JSON.parse(await getItem("users"));
  const lastUser = users[users.length - 1];  
  const userName = lastUser.name;
  document.getElementById('userName').innerHTML = userName;
}

/**
 * count tasks
 */
function countTasksByStatus(status) {
  let count = 0;

  task.forEach((task) => {
    if (task.status === status) {
      count++;
    }
  });
  
  return count;
}

async function updateTaskCounts() {
  todos = countTasksByStatus("todo");
  done = countTasksByStatus("done");
  urgent = countTasksByStatus("urgent");
  inBoard = countTasksByStatus("inBoard");
  inProgress = countTasksByStatus("inProgress");
  feedback = countTasksByStatus("feedback");
}

function updateTodoNumber() {
  document.getElementById("todos").innerText = todos;
  document.getElementById("done").innerText = done;
  document.getElementById("urgent").innerText = urgent;
  document.getElementById("inBoard").innerText = inBoard;
  document.getElementById("inProgress").innerText = inProgress;
  document.getElementById("feedback").innerText = feedback;
}
