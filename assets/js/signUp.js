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
    resetForm();
    
    }else{
        passwordErrorDiv.innerHTML = 'Die von ihnen eingebenen Passwörter stimmen nicht überein';
    }
}


function resetForm(){
    userName.value = '';
    email.value = '';
    password.value = '';
    checkPassword.value = '';
    signUpButton.disabled = false;
}