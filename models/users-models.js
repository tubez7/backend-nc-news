const db = require("../db/connection.js");

exports.fetchUsers = () => {
    return db.query("SELECT username FROM users;").then((users) => {
        console.log(users);
        console.log(users.rows);
        return users.rows;
    })
    
}