const mysql      = require('mysql');
function DBConnect() {
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'dyp123456',
        database : 'learnresource',
        multipleStatements: true
    });
    return connection;
}

module.exports = {DBConnect};
