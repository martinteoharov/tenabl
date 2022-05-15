import { createConnection } from 'typeorm';

// call that once in index.ts
export const connectToDB = async() => {
    const connection = await createConnection();
    console.log("Connection to DB established...");
    return connection;
}
