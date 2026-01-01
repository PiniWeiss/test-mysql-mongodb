import { MongoClient } from "mongodb";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://admin:password123@localhost:27018";
const DB_NAME = "users_db";

let mongocClient = null;
let mongoConn = null;

export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);

    const usersCollection = mongoConn.collection("users");

    // Create the unique index on title
    await usersCollection.createIndex({ username: 1 }, { unique: true });
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

async function connectionToMongo() {
  if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
      await mongocClient.connect();
    }
    mongoConn = mongocClient.db(DB_NAME);
  }
  return mongoConn;
}

export const getMongoConn = await connectionToMongo();
