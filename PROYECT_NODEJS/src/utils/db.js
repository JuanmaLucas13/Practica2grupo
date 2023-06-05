const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const connect = async () => {
    try{
        const db = await mongoose.connect(DB_URL)
        const {name, host} = db.connection;
        console.log(`Connected to ${name} DB host:${host}`);
    } catch (error) {
        console.log(`Error conecting to Database: ${error}`);
    }
};

module.exports = {connect, DB_URL};