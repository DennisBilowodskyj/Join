let taskPrio;
let subtasks = [];
let tasks = [
];

let contacts = [
    {
        fullname: "Anton Mayer",
        initials: "AM",
        assigned: false,
    },
    {
        fullname: "Anja Schulz",
        initials: "AS",
        assigned: false,
    },
    {
        fullname: "James Bond",
        initials: "JB",
        assigned: false,
    },
    {
        fullname: "Albert Einstein",
        initials: "AE",
        assigned: false,
    },
    {
        fullname: "Maria Müller",
        initials: "MM",
        assigned: false,
    }

];

function initAddTask() {
    init();
    setMinDate();
    renderContacts();
    // getItem(key);
}

function openAssignedInput() {
    let options = document.getElementById('contactsOverlay');

    options.classList.toggle('d-none');
}

function addTask() {
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    tasks.push({
        title: title,
        description: description,
        assignedTo: [],
        date: date,
        prio: taskPrio,
        subtask: subtasks
    });
    console.log(tasks);
    console.log(tasks.date);

}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    let subtaskOutput = document.getElementById('subtaskListContainer');

    let subtask = subtaskInput.value;

    subtaskOutput.innerHTML += `<li>${subtask}</li>`;
    subtasks.push(subtask);

    subtaskInput.value = '';

}

// test assigned to
function assign(i) {
    console.log('contact' + i);
    let contactContainer = document.getElementById(`contact${i}`);
    let checkbox = document.getElementById(`assignedCechbox${i}`);

    contactContainer.classList.add('contactAktive');
    contactContainer.style.backgroundColor = ('#2A3647');
    checkbox.src = "./assets/img/addTask_icons/checked-white.png";
    
}

function setPrio(prio) {
    taskPrio = prio;
    console.log(taskPrio);
}


function renderContacts() {
    let contactsOverlay = document.getElementById('contactsContent');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsOverlay.innerHTML += /*html*/`
            <div class="contact d-flex" id='contact${i}' onclick="assign(${i})">
                 <div class="contactLeft d-flex">
                     <div class="contactBadge">${contact.initials}</div>
                    <div class="contactName"><span>${contact.fullname}</span></div>
                 </div>
                <div class="contactRight">
                    <img id="assignedCechbox${i}" src="./assets/img/addTask_icons/check_button.png" alt="">
                </div>
            </div>
        `

    }

}




/**
 * 
 */
function setMinDate() {
    const dateField = document.getElementById('date');
    const date = new Date();
    const dateFormated = date.toISOString().split('T')[0];
    dateField.min = dateFormated;
}

function createContact() {
    alert('new contact');
}