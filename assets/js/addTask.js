let taskPrio;

let tasks = [
   
];

function openAssignedInput() {
    let options = document.getElementById('contactsOverlay');

    options.classList.toggle('d-none');
}

function addTask(){
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    tasks.push({
        title: title, 
        description: description,
        date: date,
        prio: taskPrio
    });
    console.log(tasks);

}

// function setPrio() {
//     if (setPrioUrgent()) {
//         console.log('Urgent');
//         return 0;
//     } else if (setPrioMedium()) {
//         return 1;
//     }
// }

function setPrio(prio) {
    taskPrio = prio;
    console.log(taskPrio);
}

function setPrioUrgent(){
    return setPrioUrgent;
}

function setPrioMedium(){
    return setPrioMedium;
}



function setMinDate() {
    const dateField = document.getElementById('date');
    const date = new Date();
    const dateFormated = date.toISOString().split('T')[0];
    dateField.min = dateFormated;
}
