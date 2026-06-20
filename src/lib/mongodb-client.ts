// =============================================================================
// EcoByte - MongoDB Native Client (for NextAuth MongoDBAdapter)
// Separate from Mongoose connection - required by @auth/mongodb-adapter
// =============================================================================

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the client across HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each instance
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
