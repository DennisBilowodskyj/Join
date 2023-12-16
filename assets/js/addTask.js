let taskPrio;
let assignedTo = [];
let subtasks = [];
let tasks = [
];

let contacts = [
    

];

let contactsRendered = false;

function initAddTask() {
    init();
    // setMinDate();
    // renderContacts();
    isInputFocused();
    // getItem(key);
    getContacts();
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

    subtaskOutput.innerHTML += /*html*/`
       <div class="subtaskContainer d-flex">
            <li>${subtask}</li>
            <div class="d-flex">
                <img src="./assets/img/addTask_icons/subtask_edit.png" alt="">
                <div class="seperatorSubtask"></div>
                <img src="./assets/img/addTask_icons/subtask_delete.png" alt="">
            </div>
       </div>
    `;
    subtasks.push(subtask);

    subtaskInput.value = '';

}

async function getContacts(){
//    return await getItem('contacts');
   contacts = JSON.parse(await getItem("contacts"));
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
}


function renderContacts() {
    let contactsOverlay = document.getElementById('contactsContent');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsOverlay.innerHTML += generateContactsHTML(i , contact);

    }

}

function generateContactsHTML(i,contact) {
    return /*html*/`
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