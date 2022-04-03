import { Connection, createConnection } from 'typeorm';

let connection: Connection;

// call that once in index.ts
export const connectToDB = async() => {
    connection = await createConnection();
    console.log("Connection to DB established...");
    return connection;
}

// call that wherever you would like access to the DB, without reinitializing the connection
export const getDB = () => {
    return connection;
}
