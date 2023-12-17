let users = [];


let currentUser = [];


/*LOG IN */


async function initLogIn(){ /**LOGIN */
    await loadUser();
    showLastUser(currentUser);
}


async function loadUser(){ /**LOGIN */
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.info('Could not load Users')
    }
}


/**
 * This function is used to open the signUp.html
 * 
 * @param {string} pageURL - The URL of the page to open.
 */
function openSignUpWindow(){ /**LOGIN */
    let pageURL = 'signUp.html';
    window.location.href = pageURL;
}



function showLastUser(){ /**LOGIN */
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



function checkInputLogIn(){ /**LOGIN */
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


function logInUser(){ /**LOGIN */
    event.preventDefault();
    let { passwordErrorDiv, emailErrorDiv } = setVariablesForLogInInput();
    removeClasslistFromInputDivRedBorderLogIn();
    clearErrorDiv(passwordErrorDiv, emailErrorDiv);
    const emailInput = document.getElementById('emailLogIn').value;
    const passwordInput = document.getElementById('passwordLogIn').value;
    const foundPassword = findPasswordByEmail(users, emailInput);
    if (foundPassword !== "E-Mail nicht gefunden") {
        if (foundPassword === passwordInput) {
            openSummary();
        } else {
            passwordErrorDiv = setPasswordAlertLogIn(passwordErrorDiv);
        }
    } else {
        emailErrorDiv = setEmailAlertLogIn(emailErrorDiv);
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


function setPasswordAlertLogIn(passwordErrorDiv){
    passwordErrorDiv.innerHTML = 'Wrong password Ups! Try again.';
    document.getElementById('inputDivRedBorderLogInPassword').classList.add('check-password-red-border');
}


function setEmailAlertLogIn(emailErrorDiv){
    emailErrorDiv.innerHTML = 'Wrong Email Ups! Try again.';
    document.getElementById('inputDivRedBorderLogInEmail').classList.add('check-password-red-border');
}


/*SIGN UP */


async function initSignUp(){
    await loadUser();
}


function checkEmail(users, emailToSearch) {
    for (const user of users) {
        if (user.email === emailToSearch) {
            return true;
        }
    }
    return false;
}


async function userSignUp(){
    let emailErrorDiv = document.getElementById('emailErrorMessageSignUp');
    let passwordErrorDiv = document.getElementById('passwordErrorMessageSignUp');
    let emailToSearch = document.getElementById('email');
    removeRedBorderClassList();
    emptyErrorDivText(emailErrorDiv, passwordErrorDiv);
    if (checkEmail(users, emailToSearch.value)) {
        emailErrorDiv = setEmailAlert(emailErrorDiv);
    }
    if(password.value === checkPassword.value){
        signUpButton.disabled = true;
        pushIntoUsers();
    await setItem('users', JSON.stringify(users));
    deleteCurrentUser();
    pushIntoCurrentUser();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    keyframeAnimationSignUp();
    loadIndex();
    resetForm();
    }else{
        passwordErrorDiv = setPasswordAlert(passwordErrorDiv);
    }
}


function removeRedBorderClassList(){
    document.getElementById('inputEmailDivRedBorderSignUp').classList.remove('check-password-red-border');
    document.getElementById('inputPasswordDivRedBorderSignUp').classList.remove('check-password-red-border');
}


function emptyErrorDivText(emailErrorDiv, passwordErrorDiv){
    emailErrorDiv.innerHTML = '';
    passwordErrorDiv.innerHTML = '';
}


function setEmailAlert(emailErrorDiv){
    emailErrorDiv.innerHTML = 'Ups! Diese Email ist schon vergeben.';
    document.getElementById('inputEmailDivRedBorderSignUp').classList.add('check-password-red-border');
    return emailErrorDiv;
}


function pushIntoUsers(){
    users.push({
        name: userName.value,
        email: email.value,
        password: password.value,
        confirmPassword : checkPassword.value,
    });
}


function deleteCurrentUser(){
    while (currentUser.length > 0) {
        currentUser.pop(); 
    }
}


function pushIntoCurrentUser(){
    currentUser.push({
        currentEmail: email.value,
        currentPassword: password.value,
    });
}


function keyframeAnimationSignUp(){
    document.getElementById('body').classList.add('succes-sign-up');
    document.getElementById('keyframeSignUp').classList.add('start-animation');
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


function setPasswordAlert(passwordErrorDiv){
    passwordErrorDiv.innerHTML = 'Ups! your password dont match';
    document.getElementById('inputPasswordDivRedBorderSignUp').classList.add('check-password-red-border');
}


function checkInputSignUp() {
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

/*HELP FUNCTIONS */
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