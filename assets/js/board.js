

function openAddTaskOverlay() {
// document.getElementById('addTaskOverlay').classList.toggle("d-none");
document.getElementById('addTaskOverlay').style.transform = ('translateX(0)');

}

function closeAddTaskOverlay() {
    document.getElementById('addTaskOverlay').style.transform = ('translateX(100%)');
}