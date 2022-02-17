const db = require("../db/connection.js");

exports.fetchUsers = () => {
    return db.query("SELECT username FROM users;").then((users) => {
        // result renamed users. users is promise that resolves as object returned from db
        return users.rows;
    })
    
}