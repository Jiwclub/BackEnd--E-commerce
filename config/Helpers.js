const Mysqli = require('mysqli');

let connect = new Mysqli({
    Host: 'localhost', // IP/domain name 
    post: 3306, // port, default 3306 
    user: 'root', // username 
    passwd: '', // password 
    db: 'mega_shop'
});

let db = connect.emit(false, '');

module.exports = {
    database: db
}