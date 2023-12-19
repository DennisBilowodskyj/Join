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
  addToSummary(); 
  checkEmailSummary(users);
  displayEarliestDueDate();

   
 

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

async function checkEmailSummary(users) {
  const guestUser = localStorage.getItem('guestUser')
  if(guestUser === 'Guest'){
    document.getElementById('userName').innerHTML += 'Guest';
    document.getElementById('user').innerHTML = 'G';
  }else{
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
      loadInitialsHeader(matchingUser);
      return; // Beende die Funktion nach der Aktualisierung des Benutzernamens
    } else {
      console.error("Kein Benutzer mit der angegebenen E-Mail-Adresse gefunden.");
    }
  } else {
    console.error("Fehlender oder ungültiger Wert im localStorage für den Schlüssel 'checkinUser'");
  }
}
}


function loadInitialsHeader(matchingUser){
    const [firstName, lastName] = matchingUser.name.split(' ');
    const firstLetterFirstName = firstName.charAt(0).toUpperCase();
    const firstLetterLastName = lastName.charAt(0).toUpperCase();
    document.getElementById('user').innerHTML = firstLetterFirstName + firstLetterLastName;
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
