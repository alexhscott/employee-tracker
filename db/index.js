// const connection = require("./connection");

// class db {
//     constructor(connection) {
//         this.connection = connection;
//     }
//     findAllDepartments() {
//         return this.connection.promise().query("SELECT * FROM department");
//     }
//     findAllRoles() {
//         return this.connection.promise().query("SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles")
//     };
// };

// module.exports = new db(connection);