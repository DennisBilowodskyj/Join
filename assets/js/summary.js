let todos = 0;
let done = 0;
let urgent = 0;
let inBoard = 0;
let inProgress = 0;
let feedback = 0;

const STORAGE_TOKEN = "TZ7FHNN2CSHAW65PQ44EZFBYHAEPS99VXZJH45MK";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url).then((res) => res.json());
}

/**
 * test json
 */
let testTask = [];

async function addToSummary() {
  let task = {
    title: "test",
    description: "beispieltask in datenbank speichern",
    "due date": "10.12.2023",
    priority: "urgent",
  };
  testTask.push(task);
  await setItem("allTasks", testTask);
  console.log(testTask);
  countTodo();
}

/**
 * implement daytime
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

/**
 * count tasks
 */
function countTodo() {
  const totalTasks = testTask.length
  const todosElement = document.getElementById('todos');
  todosElement.innerText = totalTasks;
}

function updateTodoNumber() {
  document.getElementById("todos").innerText = todos;
  document.getElementById("done").innerText = done;
  document.getElementById("urgent").innerText = urgent;
  document.getElementById("inBoard").innerText = inBoard;
  document.getElementById("inProgress").innerText = inProgress;
  document.getElementById("feedback").innerText = feedback;
}
updateTodoNumber();
