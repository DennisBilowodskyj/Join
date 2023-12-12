function checkInputLogIn(){
    let inputIds = ['passwordLogIn'];
    let imgIds = ['passwordLogInImg'];

    inputIds.forEach((inputId, index) => {
        let input = document.getElementById(inputId);
        let img = document.getElementById(imgIds[index]);
        if (input.value.trim() !== "") {
            img.src = "assets/img/signUp_icons/hidePassword.png";
        } else {
            img.src = "assets/img/signUp_icons/lock.png";
        }
    });
}