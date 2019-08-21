

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf-8' }, (err, content) => {
            if (content) {
                resolve(content);
            } else {
                resolve(null);
            }
        })
    })
}


const files = fs.readdirSync('./');

const queue = [];
files.forEach((file) => {
    queue.push(readFile('./' + file));
});

Promise.all(queue)
    .then(result => {
        console.log(result);
    });