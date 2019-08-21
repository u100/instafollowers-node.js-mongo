const fs = require("fs");

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(arguments[0], { encoding: 'utf-8' }, (err, content) => {
            let users_json = [];
            if (content.length !== 0) {
                if (arguments[1] === "FOLLOWERS") {
                    for (const fileContent of Object.values(JSON.parse(content).data.user.edge_followed_by.edges)) {
                        users_json.push({
                            "id": fileContent.node.id,
                            "username": fileContent.node.username,
                            "full_name": fileContent.node.full_name
                        })
                    }
                    resolve(users_json);
                } else if (arguments[1] === "FOLLOWING") {
                    for (const fileContent of Object.values(JSON.parse(content).data.user.edge_follow.edges)) {
                        users_json.push({
                            "id": fileContent.node.id,
                            "username": fileContent.node.username,
                            "full_name": fileContent.node.full_name
                        })
                    }
                    resolve(users_json);
                } else {
                    resolve([]);
                }
            } else {
                resolve([]);
            }
        })
        return 0;
        resolve("");
    })
};

function combineLists(path) {
    const files = fs.readdirSync(path[0]);
    const userList = [];
    files.forEach((file) => {
        userList.push(readFile(path[0] + file, path[1]));
    });
    return Promise.all(userList);
};

function parseList(usersList) {
    return new Promise((resolve, reject) => {
        let parsedUserList = [];
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i].length !== 0) {
                for (let j = 0; j < usersList[i].length; j++) {
                    parsedUserList.push({
                        "id": usersList[i][j].id,
                        "username": usersList[i][j].username,
                        "full_name": usersList[i][j].full_name,
                    });
                }
            }
        }
        resolve(parsedUserList);
    })
};

module.exports = {
    combineLists,
    parseList
}