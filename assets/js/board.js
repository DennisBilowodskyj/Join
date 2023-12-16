

function openAddTaskOverlay() {
document.getElementById('addTaskOverlay').classList.toggle("d_none");
}

function closeAddTaskOverlay() {
    document.getElementById('addTaskOverlay').classList.toggle("d_none");
}

function closeCardDetails(){
    document.getElementById('card_details_bg').classList.add("d_none");
}

function openCardDetails(){
    document.getElementById('card_details_bg').classList.remove("d_none");
}

// document.getElementById('addTaskOverlay').classList.toggle("d-none");
document.getElementById('addTaskOverlay').style.transform = ('translateX(0)');

// }

function closeAddTaskOverlay() {
    document.getElementById('addTaskOverlay').style.transform = ('translateX(100%)');
}

