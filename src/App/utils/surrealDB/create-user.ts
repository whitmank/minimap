import { getDb } from "../../surreal";
import { jsonify } from "surrealdb";

interface User {
  username: string;
  email: string;
  password: string;
}

async function createUser(): Promise<void> {
  const db = await getDb();
  // Check if the database is initialized
  if (!db) {
    console.error("Database not initialized");
    return;
  }
  // Create a new user
  try {
    const user = await db.create<User>("User", {
      // User details
      username: "newUser",
      email: "user@example.com",
      password: "securePassword", // Note: Store hashed passwords, not plain text
    });
    // Log the created user
    console.log("User created:", jsonify(user));
  } catch (err: unknown) {
    console.error("Failed to create user:", err instanceof Error ? err.message : String(err));
  } finally {
    // Close the database connection
    await db.close();
  }
}

createUser();
