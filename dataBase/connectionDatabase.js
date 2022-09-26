const mongoose = require('mongoose');

let connection = null;
class Database {
    constructor() {
        this.connection = mongoose.connect(process.env.MONGO_DB);
    }
    
    static getConnection() {
        if (!connection) connection = new Database();
        return connection;
    }
};

//Prueba Singleton
const database = Database.getConnection();
const database2 = Database.getConnection();
console.log("Database connection, database === database2:", database === database2);

module.exports = { Database };