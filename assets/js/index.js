function openSignUpWindow(){
    let pageURL = 'signUp.html';
    window.location.href = pageURL;
}


function openSummary(){
    let pageURL = 'summary.html';
    window.location.href = pageURL;
}

let users = [];


async function initLogIn(){
    loadUser();
}


async function loadUser(){
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.info('Could not load Users')
    }
}


async function userLogIn(){
    const passwordErrorDiv = document.getElementById('passwordErrorMessage');
    document.getElementById('inputDivRedBorder').classList.remove('check-password-red-border');
    if(password.value === checkPassword.value){
        passwordErrorDiv.innerHTML = '';
    signUpButton.disabled = true;
    users.push({
        name: userName.value,
        email: email.value,
        password: password.value,
        confirmPassword : checkPassword.value,
    });
    await setItem('users', JSON.stringify(users));
    document.getElementById('body').classList.add('succes-sign-up');
    document.getElementById('keyframeSignUp').classList.add('start-animation');
    loadIndex();
    resetForm();
    }else{
        passwordErrorDiv.innerHTML = 'Ups! your password dont match';
        document.getElementById('inputDivRedBorder').classList.add('check-password-red-border');
    }
}


function loadIndex(){
    setTimeout(function() {
        let pageURL = 'index.html';
        window.location.href = pageURL;
    }, 2000);
}


function resetForm(){
    userName.value = '';
    email.value = '';
    password.value = '';
    checkPassword.value = '';
    signUpButton.disabled = false;
}


function checkInput() {
    let inputIds = ['password', 'checkPassword'];
    let imgIds = ['passwordInputImg', 'checkPasswordInputImg'];
    
    inputIds.forEach((inputId, index) => {
        let input = document.getElementById(inputId);
        let img = document.getElementById(imgIds[index]);

        if (input.value.trim() !== "") {
            img.src = "assets/img/signUp_icons/hidePassword.png";
            img.onclick = function () {
                hidePassword(input, img);
            };
        } else {
            img.src = "assets/img/signUp_icons/lock.png";
            input.type = "password";
        }
    });
}


function showPassword(input, img) {
    input.type = "text";
    img.src = "assets/img/signUp_icons/showPassword.png";
    img.onclick = function () {
        hidePassword(input, img);
    };
}


function hidePassword(input, img) {
    input.type = "password";
    img.src = "assets/img/signUp_icons/hidePassword.png";
    img.onclick = function () {
        showPassword(input, img);
    };
}


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
