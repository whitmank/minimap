import { Surreal } from "surrealdb";
import { surrealdbNodeEngines } from "@surrealdb/node";

export async function getDb() {
  const db = new Surreal({
    engines: surrealdbNodeEngines(),
  });
  await db.connect("mem://");

  await db.close();
}

// SERVER INSTANCE MUST BE RUNNING TO CONNECT TO IT
// cmd: surreal start --unauthenticated

// Define the database configuration interface
interface DbConfig {
  url: string;
  namespace: string;
  database: string;
}

const DEFAULT_CONFIG: DbConfig = {
  url: "mem://",
  namespace: "test",
  database: "test",
};

// export async function getDb(
//   config: DbConfig = DEFAULT_CONFIG,
// ): Promise<Surreal> {
//   // Constructor with engine (Node or Wasm)
//   const db = new Surreal({
//     engines: surrealdbNodeEngines(),
//   });

//   try {
//     await db.connect(config.url);
//     await db.use({ namespace: config.namespace, database: config.database });
//     return db;
//   } catch (err) {
//     console.error(
//       "Failed to connect to SurrealDB",
//       err instanceof Error ? err.message : String(err),
//     );
//     await db.close();
//     throw err;
//   }
// }
