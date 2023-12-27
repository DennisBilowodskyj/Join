let users = [];
let currentUser = [];

/**
 * This function is used to //////
 */
async function initLogIn(){ /**LOGIN */
    await loadUser();
    showLastUser(currentUser);
}


/**
 * This function is used to open the signUp.html
 */
function openSignUpWindow(){ /**LOGIN */
    let pageURL = 'signUp.html';
    window.location.href = pageURL;
}


/**
 * This function is used to load the last sign up user 
 */
function showLastUser() {
    let currentData = localStorage.getItem("currentUser");
    const logInEmailInput = document.getElementById("emailLogIn");
    const logInPasswordInput = document.getElementById("passwordLogIn");
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
  

/**
 * This function is used to check the content of the input field and, if necessary, converts the image and type of input
 */
function checkInputLogIn() {  /**LOGIN */
    let inputIds = ["passwordLogIn"];
    let imgIds = ["passwordLogInImg"];
    inputIds.forEach((inputId, index) => {
      let input = document.getElementById(inputId);
      let img = document.getElementById(imgIds[index]);
      if (input.value.trim() !== "") {
        if(input.type === 'text'){
          img.src = "../assets/img/signUp_icons/showPassword.png";
        }else{
        input.type = "password";
        img.src = "../assets/img/signUp_icons/hidePassword.png";
        img.onclick = function () {
          hidePassword(input, img);
        }};
      } else {
        changeInputTypeToPassword(img, input);
      }
    });
}


/**
 * This function is used to log in as a guest
 */
function guestLogIn(){
  emailLogIn.value = '';
  localStorage.removeItem('checkinUser');
  localStorage.setItem('guestUser', 'Guest');
  openSummary();
}


/**
 * This function is used to check the email with the password and possibly sets an error message
 */
function logInUser() {
    /**LOGIN */
    localStorage.removeItem("guestUser");
    event.preventDefault();
    let { passwordErrorDiv, emailErrorDiv } = setVariablesForLogInInput();
    removeClasslistFromInputDivRedBorderLogIn();
    clearErrorDiv(passwordErrorDiv, emailErrorDiv);
    const emailInput = document.getElementById("emailLogIn").value;
    const passwordInput = document.getElementById("passwordLogIn").value;
    const foundPassword = findPasswordByEmail(users, emailInput);
    if (foundPassword !== "E-Mail nicht gefunden") {
      if (foundPassword === passwordInput) {
        localStorage.setItem("checkinUser", JSON.stringify(emailInput));
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

/**
 * 
 */
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
  

async function userSignUp() {
    let emailErrorDiv = document.getElementById("emailErrorMessageSignUp");
    let passwordErrorDiv = document.getElementById("passwordErrorMessageSignUp");
    let emailToSearch = document.getElementById("email");
    let checkbox = document.getElementById('accept-privacy-police');
    let checkboxErrorDiv = document.getElementById('checkboxErrorMessageSignUp');
    removeRedBorderClassList();
    emptyErrorDivText(emailErrorDiv, passwordErrorDiv);
    if (checkEmail(users, emailToSearch.value)) {
      emailErrorDiv = setEmailAlertSignUp(emailErrorDiv);
    } else {
      if (password.value === checkPassword.value) {
        if(checkbox.checked){
          signUpButton.disabled = true;
          pushIntoUsers();
          await setItem("users", JSON.stringify(users));
          deleteCurrentUser();
          pushIntoCurrentUser();
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          keyframeAnimationSignUp();
          loadIndex();
          resetForm();
        }else{
          checkboxErrorDiv = setCheckBoxAlertSignUp(checkboxErrorDiv);
        }
      } else {
        passwordErrorDiv = setPasswordAlertSignUp(passwordErrorDiv);
      }
    }
}
  

function removeRedBorderClassList(){
    document.getElementById('inputEmailDivRedBorderSignUp').classList.remove('check-password-red-border');
    document.getElementById('inputPasswordDivRedBorderSignUp').classList.remove('check-password-red-border');
}


function emptyErrorDivText(emailErrorDiv, passwordErrorDiv){
    emailErrorDiv.innerHTML = '';
    passwordErrorDiv.innerHTML = '';
    emailErrorDiv.innerHTML = '';
}


function setCheckBoxAlertSignUp(checkboxErrorDiv){
  checkboxErrorDiv.innerHTML = 'Ups! Bitte akzeptieren sie die Privacy Police.';
  return checkboxErrorDiv;
}


function setEmailAlertSignUp(emailErrorDiv){
    emailErrorDiv.innerHTML = 'Ups! Diese Email ist schon vergeben.';
    document.getElementById('inputEmailDivRedBorderSignUp').classList.add('check-password-red-border');
    return emailErrorDiv;
}


function pushIntoUsers() {
    users.push({
      name: userName.value,
      email: email.value,
      password: password.value,
      confirmPassword: checkPassword.value,
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


function setPasswordAlertSignUp(passwordErrorDiv){
    passwordErrorDiv.innerHTML = 'Ups! your password dont match';
    document.getElementById('inputPasswordDivRedBorderSignUp').classList.add('check-password-red-border');
}


function checkInputSignUp() {
    let inputIds = ["password", "checkPassword"];
    let imgIds = ["passwordInputImg", "checkPasswordInputImg"];
  
    inputIds.forEach((inputId, index) => {
      let input = document.getElementById(inputId);
      let img = document.getElementById(imgIds[index]);
      if (input.value.trim() !== "") {
        if(input.type === 'text'){
          img.src = "../assets/img/signUp_icons/showPassword.png";
        }else{
        input.type = "password";
        img.src = "../assets/img/signUp_icons/hidePassword.png";
        img.onclick = function () {
          hidePassword(input, img);
        }};
      } else {
        changeInputTypeToPassword(img, input);
      }
    });
}
  

/*HELP FUNCTIONS */


async function loadUser(){ 
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.info('Could not load Users')
    }
}


function hidePassword(input, img) {
    input.type = "password";
    img.src = "../assets/img/signUp_icons/hidePassword.png";
    img.onclick = function () {
        showPassword(input, img);
    };
}


function showPassword(input, img) {
    input.type = "text";
    img.src = "../assets/img/signUp_icons/showPassword.png";
    img.onclick = function () {
        hidePassword(input, img);
    };
}


function changeInputTypeToPassword(img, input){
    img.src = "../assets/img/signUp_icons/lock.png";
    input.type = "password";
}


function openNewTab(url) {
    sessionStorage.setItem('previousPage', window.location.href);
    window.open(url, '_blank');
}