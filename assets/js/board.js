

function openAddTaskOverlay() {
document.getElementById('addTaskOverlay').classList.toggle("d-none");
}

function closeAddTaskOverlay() {
    document.getElementById('addTaskOverlay').classList.toggle("d-none");
}

function closeCardDetails(){
    document.getElementById('card_details_bg').classList.add("d-none");
}

// function openCardDetails(){
// }
// document.getElementById('addTaskOverlay').classList.toggle("d-none");
document.getElementById('addTaskOverlay').style.transform = ('translateX(0)');

// }

function closeAddTaskOverlay() {
    document.getElementById('addTaskOverlay').style.transform = ('translateX(100%)');
}
