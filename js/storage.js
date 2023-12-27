const STORAGE_TOKEN = 'TZ7FHNN2CSHAW65PQ44EZFBYHAEPS99VXZJH45MK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Stores values ​​in backend
 * 
 * @param {string} key 
 * @param {Array} value 
 * @returns 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Loaded values from backend
 * 
 * @param {string} key 
 * @returns 
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}