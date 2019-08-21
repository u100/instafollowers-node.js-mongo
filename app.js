const MongoClient = require("mongodb").MongoClient;
let lib = require('./library');
const CONNECTION_URL = "mongodb+srv://karol:sto100@mern-m3mky.gcp.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "instafollowers";
const DATABASE_COLLECTION = "users";
const FOLLOWERS_DIRECTORY_PATH_AND_STATUS_NAME = ["./followers_input/", "FOLLOWERS"];
const FOLLOWING_DIRECTORY_PATH_AND_STATUS_NAME = ["./following_input/", "FOLLOWING"];

function updateFollowersData(parsedUserList) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            let dbo = db.db(DATABASE_NAME);

            // dbo.collection(DATABASE_COLLECTION).findOne({ id: "1556133968" }).toArray(function (err, result) {//szukamy kazdego usera z pliku po id w bazie danych
            //     if (err) throw err;
            //     console.log(result[0]._id)
            //     // if(result[0].id){
            //     //     console.log('result', result[0].id);
            //     //     console.log("is true");
            //     // } else if(!result[0]){
            //     //     console.log("is true");
            //     // } else {
            //     //     console.log("a cholera go wie");
            //     // }
            // })

            for (let i = 0; i < parsedUserList.length; i++) {//po liscie uzytkowników z plików
                dbo.collection(DATABASE_COLLECTION).find({ id: parsedUserList[i].id }).toArray(function (err, result) {//szukamy kazdego usera z pliku po id w bazie danych
                    if (err) throw err;
                    if (result.length !== 0) {
                        if (result[0].is_follower === 0) {//status 0
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { is_follower: 1 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, function (err, res) {
                                if (err) throw err;
                                console.log("follower from 0 to 1: ", parsedUserList[i].username + " --- " + result[0].username);
                            });
                        } else if (result[0].is_follower === 1) {//status 1
                            console.log('follower exists status 1: ', parsedUserList[i].username + " --- " + result[0].username);
                        } else if (result[0].is_follower === 2) {//status 2
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { is_follower: 1 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, function (err, res) {
                                if (err) throw err;
                                console.log("follower from 2 to 1: ", parsedUserList[i].username + " --- " + result[0].username);
                            });
                        }
                    } else if (result[0] === undefined){//status brak do 1 
                        try {
                            // let myquery = { id: parsedUserList[i].id, username: parsedUserList[i].username, full_name: parsedUserList[i].full_name, is_follower: 1, is_following: 0 };
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { id: parsedUserList[i].id, username: parsedUserList[i].username, full_name: parsedUserList[i].full_name, is_follower: 1, is_following: 0 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, {upsert: true}, function (err, res) {
                                if (err) throw err;
                                    console.log("follower added: ", parsedUserList[i].username);
                            });
                        } catch (err) {
                            if (err) throw err;
                        }
                    }
                });
            }
            // db.close();
            resolve("");
        });
        resolve("updateFollowersData");
    })
}

function updateFollowingData(parsedUserList) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            let dbo = db.db(DATABASE_NAME);
            for (let i = 0; i < parsedUserList.length; i++) {
                dbo.collection(DATABASE_COLLECTION).find({ id: parsedUserList[i].id }).toArray(function (err, result) {
                    if (err) throw err;
                    if (result.length !== 0) {
                        if (result[0].is_following === 0) {//status 0
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { is_following: 1 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, function (err, res) {
                                if (err) throw err;
                                console.log("following from 0 to 1: ", parsedUserList[i].username + " --- " + result[0].username);
                            });
                        } else if (result[0].is_following === 1) {//status 1
                            console.log('following exists status 1: ', parsedUserList[i].username + " --- " + result[0].username);
                        } else if (result[0].is_following === 2) {//status 2
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { is_following: 3 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, function (err, res) {
                                if (err) throw err;
                                console.log("following from 2 to 1: ", parsedUserList[i].username + " --- " + result[0].username);
                            });
                        }
                    } else if (result[0] === undefined){//status brak do 1 
                        try {
                            // let myquery = { id: parsedUserList[i].id, username: parsedUserList[i].username, full_name: parsedUserList[i].full_name, is_follower: 0, is_following: 1 };
                            let myquery = { id: parsedUserList[i].id };
                            let newvalues = { $set: { id: parsedUserList[i].id, username: parsedUserList[i].username, full_name: parsedUserList[i].full_name, is_follower: 0, is_following: 1 } };
                            dbo.collection(DATABASE_COLLECTION).updateOne(myquery, newvalues, {upsert: true}, function (err, res) {
                                if (err) throw err;
                                console.log("following added : ", parsedUserList[i].username);
                            });
                        } catch (err) {
                            if (err) throw err;
                        }
                    }
                });
            }
            // db.close();
            resolve("");
        });
    })
}

function deleteAllUsers() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            let dbo = db.db(DATABASE_NAME);

            try {
                let myquery = {};
                dbo.collection(DATABASE_COLLECTION).deleteMany(myquery);
            } catch (err) {
                if (err) throw err;
            }

            db.close();
            resolve("Done");
        });
    })
}

async function doAll() {
    //przenies hasło do oddzielnego pliku
    //db.close !!
    //else if dla 1, który jest w db, ale zniknął z obserwujących
    let status = 1;//0-delete; 1-launch script; 2-wolne
    try {
        if (status === 1) {
            let followersList = await lib.combineLists(FOLLOWERS_DIRECTORY_PATH_AND_STATUS_NAME);
            let parsedFollowersList = await lib.parseList(followersList);
            await updateFollowersData(parsedFollowersList);
            let followingList = await lib.combineLists(FOLLOWING_DIRECTORY_PATH_AND_STATUS_NAME);
            let parsedFollowingList = await lib.parseList(followingList);
            await updateFollowingData(parsedFollowingList);
        } else if (status === 0) {
            let del = await deleteAllUsers();
            console.log('deleted!', del);
        } else if (status === 2) {
           //wolne
        }

    } catch (error) {
        console.log(`errorAll = ${error}`);
    }
}

doAll();