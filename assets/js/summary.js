const STORAGE_TOKEN = 'TZ7FHNN2CSHAW65PQ44EZFBYHAEPS99VXZJH45MK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}

/**
 * test json 
 */
let testTask = [];

 async function addToSummary(){
    
    let task = {
        "title": "test",
        "description": "beispieltask in datenbank speichern" ,
        "due date": "10.12.2023",
        "priority": "urgent"


    };
    testTask.push(task);
    await setItem('allTasks',testTask);
    console.log(testTask);
}

/**
* implement daytime
*/
function greet(){
let hour = new Date().getHours();
let greeting;

if (hour < 11) {
  greeting = "Good morning";
} else if (hour < 18) {
  greeting = "Good afternoon";
} else {
  greeting ="Good evening";
}

document.getElementById("demo").innerHTML = greeting;
}


