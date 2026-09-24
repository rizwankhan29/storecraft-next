// Import the Mongoose ODM library
import mongoose from "mongoose";

// Read the MongoDB URI string from the environment variables (.env.local)
const MONGODB_URI = process.env.MONGODB_URI;

// Verify that the connection string actually exists
if (!MONGODB_URI) {
  // Halt execution and show an informative message if the string is missing
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Access the Node.js global object to preserve the cached connection across hot-reloads
let cached = global.mongoose;

// If the global cache doesn't exist yet on initial server boot
if (!cached) {
  // Create the cache object with null properties
  cached = global.mongoose = { conn: null, promise: null };
}

// Declare the connection function
const connectDB = async () => {
  // Return the active connection immediately if it was previously created
  if (cached.conn) {
    // Return existing Mongoose instance
    return cached.conn;
  }

  // If there is no active connection attempt currently pending
  if (!cached.promise) {
    // Configure Mongoose options
    const opts = {
      // Disable command buffering so queries fail immediately if not connected
      bufferCommands: false,
    };

    // Store the connection promise in cache
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        // Return the completed instance when connected
        return mongooseInstance;
      });
  }

  // Catch any potential rejection during connection resolution
  try {
    // Await the connection promise and save the live connection
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise back to null if it fails so subsequent attempts can retry
    cached.promise = null;
    // Bubble the error up to the route handler
    throw e;
  }

  // Return the connected Mongoose instance
  return cached.conn;
};

// Export as both default and named export to eliminate import mismatches completely
export { connectDB };
// Also provide the default export
export default connectDB;
