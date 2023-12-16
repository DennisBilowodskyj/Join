let users = [];


let currentUser = [];


async function initLogIn(){
    await loadUser();
    showLastUser(currentUser);
}


async function initSignUp(){
    await loadUser();
}


/**
 * This function is used to open the signUp.html
 * 
 * @param {string} pageURL - The URL of the page to open.
 */
function openSignUpWindow(){
    let pageURL = 'signUp.html';
    window.location.href = pageURL;
}


async function loadUser(){
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.info('Could not load Users')
    }
}


async function userSignUp(){
    let passwordErrorDiv = document.getElementById('passwordErrorMessageSignUp');
    document.getElementById('inputDivRedBorderSignUp').classList.remove('check-password-red-border');
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
    while (currentUser.length > 0) {
        currentUser.pop(); 
    }
    currentUser.push({
        currentEmail: email.value,
        currentPassword: password.value,
    });
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('body').classList.add('succes-sign-up');
    document.getElementById('keyframeSignUp').classList.add('start-animation');
    loadIndex();
    resetForm();
    }else{
        passwordErrorDiv.innerHTML = 'Ups! your password dont match';
        document.getElementById('inputDivRedBorderSignUp').classList.add('check-password-red-border');
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


function showLastUser(){
    let currentData = localStorage.getItem('currentUser');
    const logInEmailInput = document.getElementById('emailLogIn');
    const logInPasswordInput = document.getElementById('passwordLogIn');
    if (currentData) {
        const currentUserArray = JSON.parse(currentData);
        if (currentUserArray.length > 0) {
            const lastUser = currentUserArray[currentUserArray.length - 1];
            logInEmailInput.value = lastUser.currentEmail;
            logInPasswordInput.value = lastUser.currentPassword;
        }
    }
    checkInputLogIn();
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
            img.onclick = function () {
                hidePassword(input, img);
            };
        } else {
            img.src = "assets/img/signUp_icons/lock.png";
            input.type = "password";
        }
    });
}


function logInUser(){
    event.preventDefault();
    const { passwordErrorDiv, emailErrorDiv } = setVariablesForLogInInput();
    removeClasslistFromInputDivRedBorderLogIn();
    clearErrorDiv(passwordErrorDiv, emailErrorDiv);
    const emailInput = document.getElementById('emailLogIn').value;
    const passwordInput = document.getElementById('passwordLogIn').value;
    const foundPassword = findPasswordByEmail(users, emailInput);
    if (foundPassword !== "E-Mail nicht gefunden") {
        if (foundPassword === passwordInput) {
            openSummary();
        } else {
            passwordErrorDiv.innerHTML = 'Wrong password Ups! Try again.';
            document.getElementById('inputDivRedBorderLogInPassword').classList.add('check-password-red-border');
        }
    } else {
        emailErrorDiv.innerHTML = 'Wrong Email Ups! Try again.';
        document.getElementById('inputDivRedBorderLogInEmail').classList.add('check-password-red-border');
    }
}


function setVariablesForLogInInput(){
    let passwordErrorDiv = document.getElementById('passwordErrorMessageLogIn');
    let emailErrorDiv = document.getElementById('emailErrorMessageLogIn');
    return { passwordErrorDiv, emailErrorDiv };
}


function removeClasslistFromInputDivRedBorderLogIn(){
    document.getElementById('inputDivRedBorderLogInPassword').classList.remove('check-password-red-border');
    document.getElementById('inputDivRedBorderLogInEmail').classList.remove('check-password-red-border');
}


function clearErrorDiv(passwordErrorDiv, emailErrorDiv){
    passwordErrorDiv.innerHTML = '';
    emailErrorDiv.innerHTML = '';
}


function findPasswordByEmail(users, emailToCheck) {
    for (const user of users) {
        if (user.email === emailToCheck) {
            return user.password;
        }
    }
    return "E-Mail nicht gefunden";
}


function openSummary(){
    let pageURL = 'summary.html';
    window.location.href = pageURL;
}
