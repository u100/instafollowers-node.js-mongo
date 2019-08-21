async function logSomething(item) {
    item *= 3;
    return new Promise(resolve => resolve(item));
}

async function fillArray(array) {
    let arr = [];
    for (const item of array) {
        arr.push(await logSomething(item));
    }
    return arr;
}

fillArray([1, 2, 3]).then(results => console.log(results));
