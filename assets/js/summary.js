
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
      duedate: "10.12.2023",
      priority: "urgent",
      status: "inProgress",
    },
    {
      title: "test",
      description: "beispieltask in datenbank speichern",
      duedate: "15.01.2024",
      priority: "urgent",
      status: "feedback",
    },
  ];

  await updateTaskCounts();
  updateTodoNumber();
}



async function summaryInit() {
  init();
  await loadUser();
  addToSummary();
  checkEmailSummary(users);
  sortByDate(task);

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

async function checkEmailSummary(users) {
  const emailToSearch = localStorage.getItem('checkinUser');
  const cleanedEmailToSearch = emailToSearch.replace(/^"(.*)"$/, '$1'); // Entfernt Anführungszeichen
  if (emailToSearch) {
    const lowerCaseEmailToSearch = cleanedEmailToSearch.toLowerCase();
    console.log("Lowercase search email:", lowerCaseEmailToSearch);

    const matchingUser = users.find(user => {
      console.log("Lowercase user email:", user.email.toLowerCase());
      return user.email.toLowerCase() === lowerCaseEmailToSearch;
    });

    if (matchingUser) {
      // Übereinstimmung gefunden, setze den Benutzernamen
      document.getElementById('userName').innerHTML = matchingUser.name;
      console.log("Match found. User name:", matchingUser.name);
      return; // Beende die Funktion nach der Aktualisierung des Benutzernamens
    } else {
      console.error("Kein Benutzer mit der angegebenen E-Mail-Adresse gefunden.");
    }
  } else {
    console.error("Fehlender oder ungültiger Wert im localStorage für den Schlüssel 'checkinUser'");
  }
}
/**
 * count tasks
 */
function countTasksByStatus(status) {
  let count = 0;

  task.forEach((task) => {
    if (task.status === status) {
      count++;

      if (task.priority === 'urgent') {
        urgent++;
      }
    }
  });
  
  return count;
}

function sortByDate(task) {
  const filteredTasks = task.filter((task) => task.hasOwnProperty('dueDate'));
  filteredTasks.sort((task1, task2) => new Date(task1.dueDate) - new Date(task2.dueDate));

  if (filteredTasks.length > 0) {
    document.getElementById("date").innerHTML = filteredTasks[0].dueDate;
  } else {
    console.error('No tasks with due dates found');
  }
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