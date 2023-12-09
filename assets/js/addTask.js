

let tasks = [
   
];

function openAssignedInput() {
    let options = document.getElementById('contactsOverlay');

    options.classList.toggle('d-none');
}

function addTask(){
    let description = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    tasks.push({
        title: "", 
        description: description,
        date: date,
        prio: setPrio()
    });
    console.log(tasks);

}

function setPrio() {
    if (setPrioUrgent()) {
        console.log('Urgent');
        return 0;
    } else if (setPrioMedium()) {
        return 1;
    }
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
