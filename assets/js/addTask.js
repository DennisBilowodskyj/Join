let taskPrio;
let assignedTo = [];
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

let contactsRendered = false;

function initAddTask() {
    init();
    // setMinDate();
    // renderContacts();
    isInputFocused();
    // getItem(key);
}

function openAssignedInput() {
    let options = document.getElementById('contactsOverlay');

    options.classList.toggle('d-none');

    if (!contactsRendered) {
        renderContacts();
        contactsRendered = true;
    }
}

function addTask() {
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    tasks.push({
        title: title,
        description: description,
        assignedTo: assignedTo,
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



function assign(i) {
    console.log('contact' + i);
    let contactContainer = document.getElementById(`contact${i}`);
    let checkbox = document.getElementById(`assignedCechbox${i}`);

    // Toggle assigned status
    contacts[i].assigned = !contacts[i].assigned;

    if (contacts[i].assigned) {
        contactContainer.classList.add('contactAktive');
        contactContainer.style.backgroundColor = ('#2A3647');
        checkbox.src = "./assets/img/addTask_icons/checked-white.png";

        assignedTo.push(contacts[i]);
    } else {
        contactContainer.classList.remove('contactAktive');
        contactContainer.style.backgroundColor = ('');
        checkbox.src = "./assets/img/addTask_icons/check_button.png";

        let indexToRemove = assignedTo.findIndex(contact => contact === contacts[i]);
        if (indexToRemove !== -1) {
            assignedTo.splice(indexToRemove, 1);
        }
    }

    console.log(assignedTo);
    renderAssignedBadges();
}

function renderAssignedBadges() {
    let badgesContainer = document.getElementById('badgesAssignedTo');
    badgesContainer.innerHTML = '';

    assignedTo.forEach(contact => {
        badgesContainer.innerHTML += `
            <div class="contactBadge">${contact.initials}</div>
        `;
    });
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

function isInputFocused() {
    let subtaskInput = document.getElementById('subtaskInput');
    return subtaskInput === document.activeElement;
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