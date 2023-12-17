let taskPrio;
let assignedTo = [];
let subtasks = [];
let tasks = [
];

let contacts = [


];

let contactsRendered = false;

async function initAddTask() {
    await init();
    isInputFocused();
    await loadTasks();
    getContacts();
}

async function loadTasks() {
    tasks = JSON.parse(await getItem("tasks"));
}

function openAssignedInput() {
    let options = document.getElementById('contactsOverlay');

    options.classList.toggle('d-none');

    if (!contactsRendered) {
        renderContacts();
        contactsRendered = true;
    }
}

async function addTask() {
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let date = document.getElementById('date').value;
    let category = document.getElementById('categorySelect').value;
    tasks.push({
        title: title,
        description: description,
        assignedTo: assignedTo,
        date: date,
        prio: taskPrio,
        category: category,
        subtask: subtasks,
        status: 'todo',
    });
    console.log(tasks);
    await setItem("tasks", JSON.stringify(tasks));
    clearInput();

}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    let subtaskOutput = document.getElementById('subtaskListContainer');

    let subtask = subtaskInput.value;

    subtaskOutput.innerHTML += /*html*/`
       <div class="subtaskContainer d-flex">
            <li>${subtask}</li>
            <div class="subtaskChange d-flex">
                <img src="./assets/img/addTask_icons/subtask_edit.png" alt="">
                <div class="seperatorSubtask"></div>
                <img src="./assets/img/addTask_icons/subtask_delete.png" alt="">
            </div>
       </div>
    `;
    subtasks.push(subtask);

    resetSubtaskInput();

}

async function getContacts() {
    contacts = JSON.parse(await getItem("contacts"));
}

function renderSubtaskBtn() {
    subtaskControls.classList.remove('d-none');
    add_subtaskBtn.classList.add('d-none');
}

function resetSubtaskInput() {
    subtaskInput.value = '';
    subtaskControls.classList.add('d-none');
    add_subtaskBtn.classList.remove('d-none');
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
        let initials = getInitials(contact.name)
        badgesContainer.innerHTML += `
            <div class="contactBadge" style="background-color: #${contact.color};">${initials}</div>
        `;
    });
}

function setPrio(buttonID) {
    taskPrio = buttonID;
    console.log(taskPrio);



    let btnUrgent = document.getElementById('prio_urgent');
    let btnMedium = document.getElementById('prio_medium');
    let btnLow = document.getElementById('prio_low');
    let prioBtn = [btnUrgent, btnMedium, btnLow]

    prioBtn.forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'black';
        btn.style.boxShadow = '0px 0px 4px 0px #0000001A';

        let img = btn.querySelector('img');
        img.src = img.src.replace('_white.svg', '.svg');

    });

    if (taskPrio === 'urgent') {
        btnUrgent.style.backgroundColor = ('#FF3D00');
        btnUrgent.style.color = 'white';
        btnUrgent.style.boxShadow = '0px 4px 4px 0px #00000040';
        let img = btnUrgent.querySelector('img');
        img.src = './assets/img/addTask_icons/prio_urgent_white.svg';

    } else if (taskPrio === 'medium') {
        btnMedium.style.backgroundColor = ('#FFA800');
        btnMedium.style.color = 'white';
        btnMedium.style.boxShadow = '0px 4px 4px 0px #00000040';
        let img = btnMedium.querySelector('img');
        img.src = './assets/img/addTask_icons/prio_medium_white.svg';

    } else if (taskPrio === 'low') {
        btnLow.style.backgroundColor = ('#7AE229');
        btnLow.style.color = 'white';
        btnLow.style.boxShadow = '0px 4px 4px 0px #00000040';
        let img = btnLow.querySelector('img');
        img.src = './assets/img/addTask_icons/prio_low_white.svg';

    }


}

function clearInput() {
    taskTitle.value = '';
    taskDescription.value = '';
    date.value = '';
    assignedInput.value = '';
    subtaskInput.value = '';
    badgesAssignedTo.innerHTML = '';
    categorySelect.value = 'select';
    subtaskListContainer.innerHTML = '';
    contactsRendered = false;
}


function renderContacts() {
    let contactsOverlay = document.getElementById('contactsContent');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const initials = getInitials(contact.name)
        console.log(contact.name)

        contactsOverlay.innerHTML += generateContactsHTML(i, contact, initials);

    }

}

function generateContactsHTML(i, contact, initials) {
    return /*html*/`
         <div class="contact d-flex" id='contact${i}' onclick="assign(${i})">
                 <div class="contactLeft d-flex">
                     <div class="contactBadge" style="background-color: #${contact.color};">${initials}</div>
                    <div class="contactName"><span>${contact.name}</span></div>
                 </div>
                <div class="contactRight">
                    <img id="assignedCechbox${i}" src="./assets/img/addTask_icons/check_button.png" alt="">
                </div>
            </div>
    `
}

function getInitials(fullName) {
    const names = fullName.split(' ');
    let initials = '';
    names.forEach(name => {
        initials += name.charAt(0);
    });
    return initials.toUpperCase();
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