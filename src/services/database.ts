import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URI!);
const database = client.db(process.env.DATABASE_NAME);

class Database {
    collection = (name: string) => {
        return database.collection(name);
    };
}

export default new Database();
