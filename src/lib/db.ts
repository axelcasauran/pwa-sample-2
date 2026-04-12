import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface NexusRecord {
  id?: number;
  title: string;
  content: string;
  category: "note" | "scan" | "device";
  timestamp: number;
  meta?: Record<string, unknown>;
}

interface NexusDB extends DBSchema {
  records: {
    key: number;
    value: NexusRecord;
    indexes: {
      "by-category": string;
      "by-timestamp": number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<NexusDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<NexusDB>("pwa-test-db", 1, {
      upgrade(db) {
        const store = db.createObjectStore("records", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by-category", "category");
        store.createIndex("by-timestamp", "timestamp");
      },
    });
  }
  return dbPromise;
}

export async function addRecord(record: Omit<NexusRecord, "id" | "timestamp">): Promise<number> {
  const db = await getDB();
  return db.add("records", {
    ...record,
    timestamp: Date.now(),
  } as NexusRecord);
}

export async function getAllRecords(): Promise<NexusRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex("records", "by-timestamp");
}

export async function getRecordsByCategory(category: NexusRecord["category"]): Promise<NexusRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex("records", "by-category", category);
}

export async function deleteRecord(id: number): Promise<void> {
  const db = await getDB();
  return db.delete("records", id);
}

export async function clearAllRecords(): Promise<void> {
  const db = await getDB();
  return db.clear("records");
}

export async function getRecordCount(): Promise<number> {
  const db = await getDB();
  return db.count("records");
}
