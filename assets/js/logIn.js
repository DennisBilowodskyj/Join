let users = [];

/**
 * This is
 * 
 * @param {string} name-This ist a function
 */
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
    logInButton.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });

    await setItem('users', JSON.stringify(users));
    resetForm();
}


function resetForm(){
    email.value = '';
    password.value = '';
    logInButton.disabled = false;
}